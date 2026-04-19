import {
  SSLCommerzSessionRequest,
  SSLCommerzSessionResponse,
  SSLCommerzValidationResponse,
} from "@/types/sslcommerz";

const SSLCOMMERZ_BASE_URL =
  process.env.SSL_IS_LIVE === "true"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

export async function initiateSSLPayment(
  payload: Omit<
    SSLCommerzSessionRequest,
    "store_id" | "store_passwd" | "currency"
  >,
): Promise<SSLCommerzSessionResponse> {
  const params = new URLSearchParams({
    store_id: process.env.SSL_STORE_ID!,
    store_passwd: process.env.SSL_STORE_PASSWORD!,

    total_amount: payload.total_amount.toString(),
    currency: "BDT",
    tran_id: payload.tran_id,

    success_url: payload.success_url,
    fail_url: payload.fail_url,
    cancel_url: payload.cancel_url,
    ipn_url: payload.ipn_url,

    cus_name: payload.cus_name,
    cus_email: payload.cus_email,
    cus_phone: payload.cus_phone,
    cus_add1: payload.cus_add1,
    cus_city: payload.cus_city,
    cus_country: payload.cus_country,
    cus_postcode: payload.cus_postcode,

    product_name: payload.product_name,
    product_category: payload.product_category,
    product_profile: payload.product_profile,

    shipping_method: payload.shipping_method,
    ship_name: payload.ship_name ?? "",
    ship_add1: payload.ship_add1 ?? "",
    ship_city: payload.ship_city ?? "",
    ship_postcode: payload.ship_postcode ?? "",
    ship_country: payload.ship_country ?? "",
    num_of_item: payload.num_of_item.toString(),
    value_a: payload.value_a ?? "",
    value_b: payload.value_b ?? "",
  });

  const response = await fetch(`${SSLCOMMERZ_BASE_URL}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  return response.json();
}

export async function validateSSLCommerzTransaction(
  valId: string,
): Promise<SSLCommerzValidationResponse> {
  const params = new URLSearchParams({
    val_id: valId,
    store_id: process.env.SSL_STORE_ID!,
    store_passwd: process.env.SSL_STORE_PASSWORD!,
    format: "json",
  });
  const response = await fetch(
    `${SSLCOMMERZ_BASE_URL}/validator/api/validationserverAPI.php?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  return response.json();
}
