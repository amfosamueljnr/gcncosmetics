import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";

type CheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

type CheckoutPayload = {
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items?: CheckoutItem[];
  callbackUrl?: string;
};

type PaystackMetadataItem = {
  product_id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!paystackSecretKey || !supabaseUrl || !serviceRoleKey) {
    return json({ error: "Payment service is not configured." }, 500);
  }

  let payload: CheckoutPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid checkout payload." }, 400);
  }

  const customer = payload.customer ?? {};
  const fullName = cleanText(customer.fullName);
  const email = cleanText(customer.email).toLowerCase();
  const phone = cleanText(customer.phone);
  const address = cleanText(customer.address);
  const callbackUrl = cleanText(payload.callbackUrl);
  const items = payload.items ?? [];

  if (!fullName || !email || !phone || !address) {
    return json({ error: "Customer name, email, phone, and address are required." }, 400);
  }

  if (!items.length || items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return json({ error: "Your cart has invalid items." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, volume_pricing, is_active, status")
    .in("id", productIds);

  if (productsError) return json({ error: productsError.message }, 500);

  const productsById = new Map((products ?? []).map((product) => [product.id as string, product]));
  const orderItems: PaystackMetadataItem[] = [];
  let total = 0;

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product || product.is_active !== true || product.status !== "published") {
      return json({ error: "One or more products are no longer available." }, 400);
    }

    // Get price based on volume if available, otherwise fall back to product price
    let unitPrice = Number(product.price);
    if (product.volume_pricing && item.size) {
      const volumePricing = product.volume_pricing[item.size];
      if (volumePricing) {
        // Use discount price if available, otherwise use regular price
        unitPrice = volumePricing.discountPrice ?? volumePricing.price;
      }
    }
    
    const lineTotal = unitPrice * item.quantity;
    total += lineTotal;
    orderItems.push({
      product_id: item.productId,
      product_name: product.name,
      size: cleanText(item.size) || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: lineTotal,
    });
  }

  const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(total * 100),
      email,
      currency: "GHS",
      callback_url: callbackUrl || undefined,
      metadata: {
        checkout: {
          customer: {
            full_name: fullName,
            email,
            phone,
            address,
          },
          items: orderItems,
          total,
        },
        expected_amount: Math.round(total * 100),
        customer_name: fullName,
        customer_phone: phone,
      },
    }),
  });

  const paystackData = await paystackResponse.json();

  if (!paystackResponse.ok || paystackData.status !== true) {
    return json({ error: paystackData.message || "Paystack could not initialize this payment." }, 502);
  }

  const reference = paystackData.data.reference as string;
  return json({
    authorizationUrl: paystackData.data.authorization_url,
    accessCode: paystackData.data.access_code,
    reference,
    amount: total,
  });
});
