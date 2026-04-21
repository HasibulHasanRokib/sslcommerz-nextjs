import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col gap-8 justify-center items-center">
      <h1 className="font-bold text-4xl leading-relaxed">
        SSLCommerz payment gateway
      </h1>
      <div className="flex gap-4 items-center">
        <Button size={"lg"} className="py-6 px-8">
          <Link href={"/subscriptions"}>Upgrade plan</Link>
        </Button>
        <Button size={"lg"} className="py-6 px-8">
          <Link href={"/products"}>NextShop</Link>
        </Button>
      </div>
    </div>
  );
}
