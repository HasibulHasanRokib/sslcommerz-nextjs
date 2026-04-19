"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { plans } from "@/lib/subscription";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { subscriptionSession } from "./action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function SubscriptionPlan() {
  const [isPending, startTransition] = useTransition();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = (planId: string) => {
    setLoadingPlanId(planId);
    startTransition(async () => {
      try {
        const res = await subscriptionSession({ planId });
        if (!res.url) {
          toast.error(res.error);
          return;
        }
        router.push(res.url);
      } catch {
        toast.error("Something went wrong!");
      } finally {
        setLoadingPlanId(null);
      }
    });
  };

  return (
    <main className="min-h-screen">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const isThisPlanLoading = isPending && loadingPlanId === plan.id;
              return (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    plan.recommended
                      ? "border-2 border-blue-600 lg:scale-105 lg:shadow-xl"
                      : "border border-border"
                  }`}
                >
                  {plan.recommended && (
                    <div className="text-center">
                      <p className="text-sm font-semibold bg-blue-600 inline-block px-4 py-2 text-primary-foreground rounded-2xl">
                        Recommended
                      </p>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col px-6 py-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-foreground">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={plan.recommended ? "outline" : "default"}
                      className="mb-8 w-full"
                      size="lg"
                      disabled={isPending}
                      onClick={() => handleCheckout(plan.id)}
                    >
                      {isThisPlanLoading ? <Spinner /> : plan.cta}
                    </Button>

                    <div className="mb-6 border-t border-border" />

                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <Check className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
