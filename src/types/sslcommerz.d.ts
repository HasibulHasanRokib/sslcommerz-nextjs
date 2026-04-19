export interface SSLCommerzSessionRequest {
  store_id: string;
  store_passwd: string;

  total_amount: number;
  currency: "BDT";
  tran_id: string;

  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;

  cus_name: string;
  cus_email: string;
  cus_city: string;
  cus_add1: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;

  product_name: string;
  product_category: string;
  product_profile:
    | "general"
    | "physical-goods"
    | "non-physical-goods"
    | "airline-tickets"
    | "travel-vertical"
    | "telecom-vertical";

  shipping_method: "YES" | "NO" | "Courier";
  ship_name?: string;
  ship_add1?: string;
  ship_city?: string;
  ship_postcode?: string;
  ship_country?: string;
  num_of_item: number;
  value_a?: string;
  value_b?: string;
}

export interface SSLCommerzSessionResponse {
  status: "SUCCESS" | "FAILED";
  failedreason: string;
  sessionkey: string;
  GatewayPageURL: string;
  storeBanner: string;
  storeLogo: string;
  gw: {
    visa: string;
    master: string;
    amex: string;
    othercards: string;
    internetbanking: string;
    mobilebanking: string;
  };
}

export interface SSLCommerzIPNData {
  status: "VALID" | "FAILED" | "CANCELLED" | "EXPIRED" | "UNATTEMPTED";
  tran_date: string;
  tran_id: string;
  val_id: string;
  amount: string;
  store_amount: string;
  card_type: string;
  card_no: string;
  currency: string;
  bank_tran_id: string;
  store_id: string;
  verify_sign: string;
  verify_key: string;
  risk_level?: string;
  risk_title?: string;
  value_a?: string;
  value_b?: string;
}

export interface SSLCommerzValidationResponse {
  status:
    | "VALID"
    | "VALIDATED"
    | "FAILED"
    | "CANCELLED"
    | "EXPIRED"
    | "UNATTEMPTED";
  tran_id: string;
  tran_date: string;
  val_id: string;
  amount: string;
  card_type: string;
  card_no: string;
  store_amount: string;
  currency: string;
  bank_tran_id: string;
  error?: string;
}
