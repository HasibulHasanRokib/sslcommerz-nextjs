import { db } from "@/lib/db";
import { validateSSLCommerzTransaction } from "@/lib/sslcommerz";
import { plans } from "@/lib/subscription";
import { SSLCommerzIPNData } from "@/types/sslcommerz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const data: SSLCommerzIPNData = Object.fromEntries(
      formData,
    ) as unknown as SSLCommerzIPNData;

    const { tran_id, val_id, status, value_a: planId } = data;

    if (!tran_id || !val_id) {
      return NextResponse.json({ error: "Invalid IPN data" }, { status: 400 });
    }

    const paymentRecord = await db.payment.findUnique({
      where: { tranId: tran_id },
      include: { user: true },
    });

    if (!paymentRecord) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    if (paymentRecord.status === "VALID") {
      return NextResponse.json(
        { message: "Payment already processed" },
        { status: 200 },
      );
    }

    if (status === "VALID") {
      const validation = await validateSSLCommerzTransaction(val_id);

      const receivedAmount = parseFloat(validation.amount);

      if (Math.abs(receivedAmount - paymentRecord.amount) > 0.1) {
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }
      if (validation.status === "VALID" || validation.status === "VALIDATED") {
        const selectedPlan = plans.find((p) => p.id === planId);
        if (!selectedPlan) throw new Error("Plan not found in IPN");

        await db.$transaction(async (tx) => {
          await tx.payment.update({
            where: { tranId: tran_id },
            data: {
              status: "VALID",
              valId: val_id,
              paymentMethod: validation.card_type,
            },
          });

          if (paymentRecord.type === "SUBSCRIPTION" && paymentRecord.userId) {
            const existingSubscription = await tx.subscription.findUnique({
              where: { userId: paymentRecord.userId },
            });

            const startDate =
              existingSubscription && existingSubscription.endDate > new Date()
                ? existingSubscription.endDate
                : new Date();

            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30);

            await tx.subscription.upsert({
              where: { userId: paymentRecord.userId },
              update: {
                planId: selectedPlan.id,
                active: true,
                amount: paymentRecord.amount,
                endDate: endDate,
              },
              create: {
                userId: paymentRecord.userId,
                planId: selectedPlan.id,
                active: true,
                amount: paymentRecord.amount,
                endDate: endDate,
              },
            });
          }
        });
      }
    }

    return NextResponse.json({ message: "Received" });
  } catch (err) {
    console.error("Error processing IPN:", err);
    return NextResponse.json(
      { error: "Failed to process IPN" },
      { status: 500 },
    );
  }
}
