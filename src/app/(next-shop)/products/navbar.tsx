"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Store } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const links = [{ href: "/", label: "Shop", icon: Store }];

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">NextShop</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          <Link
            href="/cart"
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/cart"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <ShoppingCart size={16} />
            Cart
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems() > 9 ? "9+" : totalItems()}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
