"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/validations/checkout.schema";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { checkoutSession } from "./action";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [form, setForm] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      if (error === "payment_cancelled") {
        toast.error("Payment was cancelled by the user.");
      } else if (error === "payment_failed") {
        toast.error("Payment failed. Please try again.");
      } else if (error === "something_went_wrong") {
        toast.error("An unexpected error occurred.");
      }
      router.replace("/checkout", { scroll: false });
    }
  }, [error, router]);

  async function handleSubmit() {
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        address: fieldErrors.address?.[0],
      });
      return;
    }
    setErrors({});
    const data = {
      ...form,
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        price: i.price,
        name: i.name,
      })),
    };
    startTransition(async () => {
      const response = await checkoutSession(data);
      if (!response.url) {
        toast.error(response.error);
        return;
      }
      clearCart();
      router.push(response.url);
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4 mb-6">
        {[
          {
            label: "Name",
            key: "name",
            type: "text",
            placeholder: "Your full name",
          },
          {
            label: "Email",
            key: "email",
            type: "email",
            placeholder: "email@example.com",
          },
          {
            label: "Phone",
            key: "phone",
            type: "tel",
            placeholder: "01XXXXXXXXX",
          },
          {
            label: "Address",
            key: "address",
            type: "text",
            placeholder: "House/Flat, Street, Area, District",
          },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key as keyof CheckoutFormData]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[key as keyof CheckoutFormData] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[key as keyof CheckoutFormData]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(totalAmount())}</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full  py-5 rounded-xl font-semibold"
      >
        {isPending ? "Processing..." : "Pay with SSLCommerz"}
      </Button>
    </div>
  );
}
