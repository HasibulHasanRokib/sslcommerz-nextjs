"use server";

import { db } from "@/lib/db";

export async function getPaymentStatus({ tranId }: { tranId: string }) {
  try {
    const user = await db.user.findUnique({
      where: { id: "user1" },
    });
    if (!user) throw new Error("You need to logged in to view this page.");

    const payment = await db.payment.findFirst({
      where: { tranId, userId: user.id },
    });
    console.log(payment);

    if (!payment) throw new Error("Payment does not exist");

    return payment.status === "VALID" ? payment : false;
  } catch (err) {
    console.error("[GetPaymentStatus]" + err);
    return {
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
