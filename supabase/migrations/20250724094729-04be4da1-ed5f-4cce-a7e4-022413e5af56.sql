-- Fix function search path security warning
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
SET search_path = 'public'
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

-- Update other functions to fix search path
CREATE OR REPLACE FUNCTION public.validate_subscription_tier()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;