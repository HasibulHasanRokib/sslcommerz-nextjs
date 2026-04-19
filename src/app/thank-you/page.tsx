import { Suspense } from "react";
import { ThankYou } from "./thank-you";

export default function Page() {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
