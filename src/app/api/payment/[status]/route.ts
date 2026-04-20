import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ status: string }> },
) {
  const { status } = await params;

  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const tranId = data.tran_id as string;

  if (!tranId) {
    return NextResponse.json(
      { message: "Transaction ID not found" },
      { status: 400 },
    );
  }

  let redirectUrl = `${APP_URL}/subscriptions`;

  try {
    if (status === "success") {
      await db.payment.findUnique({
        where: { tranId: tranId, status: "VALID" },
      });
      redirectUrl = `${APP_URL}/thank-you?tran_id=${tranId}`;
    }

    if (status === "fail") {
      await db.payment.update({
        where: { tranId: tranId },
        data: { status: "FAILED" },
      });
      redirectUrl = `${APP_URL}/subscriptions?error=payment_failed`;
    }

    if (status === "cancel") {
      await db.payment.update({
        where: { tranId: tranId },
        data: { status: "CANCELLED" },
      });
      redirectUrl = `${APP_URL}/subscriptions?error=payment_cancelled`;
    }
  } catch (error) {
    console.error("Payment Route Error:", error);
    redirectUrl = `${APP_URL}/subscriptions?error=something_went_wrong`;
  }
  redirect(redirectUrl);
}
