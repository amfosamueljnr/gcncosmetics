import { supabase } from "@/lib/supabase";

export type PaystackCheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type PaystackCheckoutPayload = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  items: PaystackCheckoutItem[];
  callbackUrl: string;
};

export type PaystackCheckoutResponse = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  orderId: string;
  amount: number;
};

export type PaystackVerificationResponse = {
  orderId: string;
  reference: string;
  status: "paid";
};

async function functionError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "context" in error) {
    const response = (error as { context?: Response }).context;
    if (response) {
      try {
        const body = await response.json();
        if (typeof body?.error === "string") return body.error;
      } catch {
        // Fall back to the SDK error message below.
      }
    }
  }

  if (error instanceof Error) return error.message;
  return fallback;
}

export async function initializePaystackCheckout(payload: PaystackCheckoutPayload) {
  const { data, error } = await supabase.functions.invoke<PaystackCheckoutResponse>(
    "initialize-paystack-payment",
    { body: payload }
  );

  if (error) throw new Error(await functionError(error, "Unable to initialize Paystack payment."));
  if (!data?.authorizationUrl) throw new Error("Paystack did not return a checkout URL.");

  return data;
}

export async function verifyPaystackPayment(reference: string) {
  const { data, error } = await supabase.functions.invoke<PaystackVerificationResponse>(
    "verify-paystack-payment",
    { body: { reference } }
  );

  if (error) throw new Error(await functionError(error, "Unable to verify Paystack payment."));
  if (!data?.orderId) throw new Error("Payment verification did not return an order.");

  return data;
}
