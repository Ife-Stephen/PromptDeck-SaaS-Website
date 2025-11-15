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
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
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
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Security: Enhanced input validation
    const body = await req.json().catch(() => ({}));
    const { plan } = body;
    
    if (!plan || typeof plan !== 'string' || !['pro', 'enterprise'].includes(plan)) {
      throw new Error("Invalid plan specified");
    }

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email, plan });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Determine pricing based on plan
    const planPricing = {
      pro: { amount: 1900, name: "Pro Plan" }, // $19.00
      enterprise: { amount: 9900, name: "Enterprise Plan" } // $99.00
    };

    const selectedPlan = planPricing[plan as keyof typeof planPricing];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPlan.name },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?checkout=success`,
      cancel_url: `${req.headers.get("origin")}/dashboard?checkout=cancel`,
    });

    logStep("Checkout session created", { sessionId: session.id, plan, amount: selectedPlan.amount });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Security: Sanitize error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    const sanitizedError = errorMessage.includes('key') || errorMessage.includes('secret')
      ? 'Payment service error'
      : errorMessage;
    
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: sanitizedError }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});