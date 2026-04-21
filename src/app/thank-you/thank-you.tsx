"use client";

import { Payment } from "@/lib/generated/prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getPaymentStatus } from "./action";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

type PaymentResult = Payment | false | { error: string } | undefined;

export function ThankYou() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id") || "";
  const [isPending, startTransition] = useTransition();
  const [paymentData, setPaymentData] = useState<PaymentResult>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (tranId) {
      startTransition(async () => {
        const res = await getPaymentStatus({ tranId });
        setPaymentData(res);
      });
    }
  }, [tranId]);

  if (paymentData === undefined || isPending) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <h3>Loading your confirmation...</h3>
          <p>This won&apos;t take long.</p>
        </div>
      </div>
    );
  }

  if (typeof paymentData === "object" && "error" in paymentData) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-red-600">
          <h3>Something went wrong</h3>
          <p>{paymentData.error}</p>
          <Button onClick={() => router.push("/")}>Go back</Button>
        </div>
      </div>
    );
  }

  if (paymentData === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <h3>Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <Button onClick={() => router.push("/")} className="mt-6 w-full ">
        Go to Dashboard
      </Button>
    </div>
  );
}
