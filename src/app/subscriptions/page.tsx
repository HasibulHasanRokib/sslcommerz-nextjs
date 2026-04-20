import { Suspense } from "react";
import { SubscriptionPlan } from "./subscription-plan";

export default function Page() {
  return (
    <Suspense>
      <SubscriptionPlan />
    </Suspense>
  );
}
