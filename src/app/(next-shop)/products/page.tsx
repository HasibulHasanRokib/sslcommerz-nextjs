import { Navbar } from "./navbar";
import { ProductCard } from "./product-card";
import { db } from "@/lib/db";

export default async function Page() {
  const products = await db.product.findMany();
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
