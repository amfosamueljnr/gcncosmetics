import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";

type CheckoutMetadataItem = {
  product_id?: unknown;
  product_name?: unknown;
  size?: unknown;
  quantity?: unknown;
  unit_price?: unknown;
  total_price?: unknown;
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

function readMetadata(metadata: unknown) {
  if (typeof metadata === "string") {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }

  return metadata && typeof metadata === "object" ? metadata as Record<string, unknown> : {};
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

  let reference: string;
  try {
    const body = await req.json();
    reference = cleanText(body.reference);
  } catch {
    return json({ error: "Invalid verification payload." }, 400);
  }

  if (!reference) return json({ error: "Payment reference is required." }, 400);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: existingOrder, error: orderError } = await supabase
    .from("orders")
    .select("id, total, status, payment_reference")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (orderError) return json({ error: orderError.message }, 500);

  if (existingOrder?.status === "paid") {
    return json({ orderId: existingOrder.id, reference, status: "paid" });
  }

  const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
    },
  });

  const paystackData = await paystackResponse.json();

  if (!paystackResponse.ok || paystackData.status !== true) {
    return json({ error: paystackData.message || "Paystack could not verify this payment." }, 502);
  }

  const transaction = paystackData.data;
  const metadata = readMetadata(transaction.metadata);
  const checkout = readMetadata(metadata.checkout);
  const expectedAmount = existingOrder
    ? Math.round(Number(existingOrder.total) * 100)
    : Number(metadata.expected_amount);

  if (transaction.status !== "success") {
    return json({ error: `Payment is ${transaction.status}.` }, 402);
  }

  if (transaction.reference !== reference || Number(transaction.amount) !== expectedAmount || transaction.currency !== "GHS") {
    return json({ error: "Payment details do not match this order." }, 409);
  }

  if (existingOrder) {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_verified_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);

    if (updateError) return json({ error: updateError.message }, 500);

    return json({ orderId: existingOrder.id, reference, status: "paid" });
  }

  const customer = readMetadata(checkout.customer);
  const fullName = cleanText(customer.full_name);
  const email = cleanText(customer.email).toLowerCase();
  const phone = cleanText(customer.phone);
  const address = cleanText(customer.address);
  const total = Number(checkout.total);
  const items = Array.isArray(checkout.items) ? checkout.items as CheckoutMetadataItem[] : [];

  if (
    !fullName ||
    !email ||
    !phone ||
    !address ||
    !Number.isFinite(total) ||
    total <= 0 ||
    Math.round(total * 100) !== expectedAmount ||
    !items.length
  ) {
    return json({ error: "Verified payment is missing checkout details." }, 409);
  }

  const orderItems = items.map((item) => ({
    product_id: cleanText(item.product_id) || null,
    product_name: cleanText(item.product_name),
    size: cleanText(item.size) || null,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    total_price: Number(item.total_price),
  }));

  if (
    orderItems.some((item) =>
      !item.product_name ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      !Number.isFinite(item.unit_price) ||
      item.unit_price < 0 ||
      !Number.isFinite(item.total_price) ||
      item.total_price < 0
    )
  ) {
    return json({ error: "Verified payment contains invalid order items." }, 409);
  }

  const { data: savedCustomer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        full_name: fullName,
        email,
        phone,
        default_address: address,
        status: "active",
      },
      { onConflict: "phone" }
    )
    .select("id")
    .single();

  if (customerError) return json({ error: customerError.message }, 500);

  const { data: order, error: createOrderError } = await supabase
    .from("orders")
    .insert({
      customer_id: savedCustomer.id,
      total,
      status: "paid",
      shipping_address: address,
      payment_provider: "paystack",
      payment_reference: reference,
      payment_verified_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (createOrderError) {
    const { data: paidOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("payment_reference", reference)
      .maybeSingle();

    if (paidOrder?.status === "paid") {
      return json({ orderId: paidOrder.id, reference, status: "paid" });
    }

    return json({ error: createOrderError.message }, 500);
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return json({ error: itemsError.message }, 500);
  }

  return json({ orderId: order.id, reference, status: "paid" });
});
