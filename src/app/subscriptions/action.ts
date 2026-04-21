"use server";

import { db } from "@/lib/db";
import { initiateSSLPayment } from "@/lib/sslcommerz";
import { plans } from "@/lib/subscription-data";
import { generateTransactionId } from "@/lib/utils";

export async function subscriptionSession({ planId }: { planId: string }) {
  try {
    const plan = plans.find((plan) => plan.id === planId);

    if (!plan) throw new Error("Subscription plan not found");

    const user = await db.user.findUnique({
      where: { id: "user1" },
    });

    if (!user) throw new Error("User not found");

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    const tranId = generateTransactionId();

    await db.payment.create({
      data: {
        userId: user.id,
        tranId: tranId,
        amount: plan.price,
        status: "PENDING",
        type: "SUBSCRIPTION",
      },
    });

    const sslSession = await initiateSSLPayment({
      total_amount: plan.price,
      tran_id: tranId,

      success_url: `${APP_URL}/api/payment/subscription/success`,
      fail_url: `${APP_URL}/api/payment/subscription/fail`,
      cancel_url: `${APP_URL}/api/payment/subscription/cancel`,
      ipn_url: `${APP_URL}/api/payment/ipn`,

      cus_name: "Hasibul Hasan Rokib",
      cus_email: "rokib4000@gmail.com",
      cus_phone: "01839027207",
      cus_add1: "Konabari",
      cus_city: "Gazipur",
      cus_country: "Bangladesh",
      cus_postcode: "1340",

      product_name: `Subscription ${plan.name}`,
      product_category: "Subscription",
      product_profile: "non-physical-goods",
      num_of_item: 1,
      shipping_method: "NO",
      value_a: plan.id,
    });

    if (!sslSession.GatewayPageURL)
      throw new Error(" Failed to initiate payment session: ");

    return { url: sslSession.GatewayPageURL };
  } catch (err) {
    console.error("[subscriptionSession]:" + err);
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
