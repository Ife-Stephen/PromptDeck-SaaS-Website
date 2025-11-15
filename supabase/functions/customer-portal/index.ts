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
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
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

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });
    logStep("Customer portal session created", { sessionId: portalSession.id, url: portalSession.url });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Security: Sanitize error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    const sanitizedError = errorMessage.includes('key') || errorMessage.includes('secret')
      ? 'Portal service error'
      : errorMessage;
    
    logStep("ERROR in customer-portal", { message: errorMessage });
    return new Response(JSON.stringify({ error: sanitizedError }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});