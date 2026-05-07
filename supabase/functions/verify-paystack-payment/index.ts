import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";

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

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, total, status, payment_reference")
    .eq("payment_reference", reference)
    .single();

  if (orderError || !order) return json({ error: "Order not found for this payment reference." }, 404);

  if (order.status === "paid") {
    return json({ orderId: order.id, reference, status: "paid" });
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
  const expectedAmount = Math.round(Number(order.total) * 100);

  if (transaction.status !== "success") {
    return json({ error: `Payment is ${transaction.status}.` }, 402);
  }

  if (transaction.reference !== reference || Number(transaction.amount) !== expectedAmount || transaction.currency !== "GHS") {
    return json({ error: "Payment details do not match this order." }, 409);
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_verified_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateError) return json({ error: updateError.message }, 500);

  return json({ orderId: order.id, reference, status: "paid" });
});
