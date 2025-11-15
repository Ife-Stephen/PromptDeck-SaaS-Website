import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Security: Environment-specific CORS configuration
const getAllowedOrigins = () => {
  const production = Deno.env.get('DENO_DEPLOYMENT_ID');
  if (production) {
    return ['https://your-domain.com']; // Replace with actual production domain
  }
  return ['http://localhost:3000', 'http://localhost:5173', 'https://*.lovableproject.com'];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Will be dynamically set
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Security: Validate request method
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // Security: Dynamic CORS validation
  const origin = req.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  const isOriginAllowed = !origin || allowedOrigins.some(allowed => 
    allowed === '*' || origin === allowed || (allowed.includes('*') && origin.includes('lovableproject.com'))
  );
  
  const dynamicCorsHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isOriginAllowed ? (origin || '*') : 'null',
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: dynamicCorsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.rpc('update_subscription_from_stripe', {
        p_email: user.email,
        p_user_id: user.id,
        p_stripe_customer_id: null,
        p_subscribed: false,
        p_subscription_tier: 'free',
        p_subscription_end: null
      });
      return new Response(JSON.stringify({ subscribed: false, subscription_tier: 'free' }), {
        headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = 'free';
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount === 1900) { // $19.00
        subscriptionTier = "pro";
      } else if (amount === 9900) { // $99.00
        subscriptionTier = "enterprise";
      } else {
        subscriptionTier = "pro"; // Default fallback
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.rpc('update_subscription_from_stripe', {
      p_email: user.email,
      p_user_id: user.id,
      p_stripe_customer_id: customerId,
      p_subscribed: hasActiveSub,
      p_subscription_tier: subscriptionTier,
      p_subscription_end: subscriptionEnd
    });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Security: Sanitize error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    const sanitizedError = errorMessage.includes('key') || errorMessage.includes('secret')
      ? 'Authentication service error'
      : errorMessage;
    
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: sanitizedError }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});