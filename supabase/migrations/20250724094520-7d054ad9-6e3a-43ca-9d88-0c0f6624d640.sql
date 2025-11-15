-- Fix critical security vulnerabilities in RLS policies

-- Drop the overly permissive policies on subscribers table
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create secure RLS policies for subscribers table
CREATE POLICY "users_can_view_own_subscription" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "system_can_insert_subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (user_id = auth.uid() AND email = auth.email());

CREATE POLICY "system_can_update_verified_subscription" 
ON public.subscribers 
FOR UPDATE 
USING (user_id = auth.uid() OR email = auth.email())
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Create a security definer function for safe subscription updates (only from verified sources)
CREATE OR REPLACE FUNCTION public.update_subscription_from_stripe(
  p_email text,
  p_user_id uuid,
  p_stripe_customer_id text,
  p_subscribed boolean,
  p_subscription_tier text,
  p_subscription_end timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can only be called by edge functions with proper authentication
  INSERT INTO public.subscribers (
    email, 
    user_id, 
    stripe_customer_id, 
    subscribed, 
    subscription_tier, 
    subscription_end
  )
  VALUES (
    p_email,
    p_user_id,
    p_stripe_customer_id,
    p_subscribed,
    p_subscription_tier,
    p_subscription_end
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    user_id = EXCLUDED.user_id,
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    subscribed = EXCLUDED.subscribed,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_end = EXCLUDED.subscription_end,
    updated_at = now();
END;
$$;

-- Grant execute permission only to service role
GRANT EXECUTE ON FUNCTION public.update_subscription_from_stripe TO service_role;

-- Create validation trigger for subscription tier
CREATE OR REPLACE FUNCTION public.validate_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow valid subscription tiers
  IF NEW.subscription_tier NOT IN ('free', 'pro', 'enterprise') THEN
    RAISE EXCEPTION 'Invalid subscription tier: %', NEW.subscription_tier;
  END IF;
  
  -- Ensure subscription_end is set for paid tiers
  IF NEW.subscribed = true AND NEW.subscription_tier != 'free' AND NEW.subscription_end IS NULL THEN
    RAISE EXCEPTION 'Subscription end date required for paid subscriptions';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_subscription_tier_trigger
  BEFORE INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_subscription_tier();