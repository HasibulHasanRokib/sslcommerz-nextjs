"use server";

import { db } from "@/lib/db";
import { initiateSSLPayment } from "@/lib/sslcommerz";
import { generateTransactionId } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().min(10),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      name: z.string(),
    }),
  ),
});

export async function checkoutSession(data: z.infer<typeof checkoutSchema>) {
  try {
    const user = await db.user.findUnique({
      where: { id: "user1" },
    });

    if (!user) throw new Error("User not found");

    const parsed = checkoutSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid data");

    const { name, email, phone, address, items } = parsed.data;
    const productIds = items.map((i) => i.productId);

    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    const tranId = generateTransactionId();

    const { order } = await db.$transaction(async (tx) => {
      let totalAmount = 0;

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        if (product.stock < item.quantity) {
          throw new Error(`"${product.name}" not in stock`);
        }
        totalAmount += product.price * item.quantity;
      }

      const shippingAddress = await tx.shippingAddress.create({
        data: {
          name,
          email,
          phoneNumber: phone,
          address,
          city: address,
          country: "Bangladesh",
        },
      });

      const order = await tx.order.create({
        data: {
          userId: user.id,
          amount: totalAmount,
          status: "PENDING",
          shippingAddressId: shippingAddress.id,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find((p) => p.id === item.productId)!.price,
            })),
          },
        },
      });

      await tx.payment.create({
        data: {
          userId: user.id,
          tranId,
          amount: totalAmount,
          status: "PENDING",
          type: "ONE_TIME",
        },
      });

      return { order, totalAmount };
    });

    const sslSession = await initiateSSLPayment({
      total_amount: order.amount,
      tran_id: tranId,

      success_url: `${APP_URL}/api/payment/product/success`,
      fail_url: `${APP_URL}/api/payment/product/fail`,
      cancel_url: `${APP_URL}/api/payment/product/cancel`,
      ipn_url: `${APP_URL}/api/payment/ipn`,

      cus_name: name,
      cus_email: email,
      cus_phone: phone,
      cus_add1: address,
      cus_city: address,
      cus_country: "Bangladesh",
      cus_postcode: "",

      product_name: items
        .map((i) => i.name)
        .join(", ")
        .slice(0, 255),
      product_category: "physical-goods",
      product_profile: "physical-goods",
      num_of_item: items.length,
      shipping_method: "NO",
      value_b: order.id,
    });

    if (!sslSession.GatewayPageURL)
      throw new Error(
        " Failed to initiate payment session: " + sslSession.failedreason,
      );

    return { url: sslSession.GatewayPageURL };
  } catch (err) {
    console.error("[CheckoutSession]", err);
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
