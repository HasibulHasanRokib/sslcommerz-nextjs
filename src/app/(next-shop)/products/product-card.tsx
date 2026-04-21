"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.image}
            alt={product.name}
            width={192}
            height={192}
            className="object-cover opacity-90 brightness-150 dark:brightness-100"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold ">
            {formatPrice(product.price)}
          </span>
          <Button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            disabled={product.stock === 0}
            className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            Add
          </Button>
        </div>
        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </div>
  );
}
