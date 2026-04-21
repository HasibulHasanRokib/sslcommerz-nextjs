import { Suspense } from "react";
import { CheckoutPage } from "./checkout";

export default function Page() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
