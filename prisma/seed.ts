import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Tee",
        description:
          "Lightweight cotton crew neck for everyday wear. Pre-shrunk fabric holds its shape wash after wash. Pair it with jeans or layer it under a jacket.",
        price: 35,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/tee.png",
        category: "tops",
        slug: "tee",
        stock: 10,
      },
      {
        name: "Joggers",
        description:
          "Tapered sweatpants with an elastic waistband and cuffed ankles. Brushed fleece interior keeps you warm without the bulk. Deep side pockets fit your phone and essentials.",
        price: 65,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/joggers.png",
        category: "shorts",
        slug: "joggers",
        stock: 10,
      },
      {
        name: "Tennis Shoes",
        description:
          "Court-ready sneakers with reinforced toe and cushioned sole. Herringbone-pattern outsole grips hard courts in every direction. Breathable mesh upper keeps your feet cool during long sets.",
        price: 120,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/tennis-shoes.png",
        category: "shoes",
        slug: "tennis-shoes",
        stock: 10,
      },
      {
        name: "Overshirt",
        description:
          "Brushed twill button-up that works as a light outer layer. Two chest pockets add storage without extra bulk. Fits comfortably over a tee or henley.",
        price: 90,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/overshirt.png",
        category: "tops",
        slug: "overshirt",
        stock: 10,
      },
      {
        name: "Bomber Jacket",
        description:
          "Zip-up bomber with ribbed cuffs and a satin-finish shell. Lined interior adds warmth for cooler evenings. Minimal branding keeps the look clean and versatile.",
        price: 145,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/bomber-jacket.png",
        category: "tops",
        slug: "bomber-jacket",
        stock: 10,
      },
      {
        name: "Beach Shirt",
        description:
          "Relaxed-fit camp collar shirt in a breezy linen blend. Lightweight weave dries fast after a swim. Looks just as good at dinner as it does on the boardwalk.",
        price: 55,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/beach-shirt.png",
        category: "tops",
        slug: "beach-shirt",
        stock: 10,
      },
      {
        name: "Shorts",
        description:
          "Flat-front chino shorts with a 7-inch inseam. Stretch cotton moves with you all day. Clean side-seam pockets sit flat against your leg.",
        price: 45,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/shorts.png",
        category: "shorts",
        slug: "shorts",
        stock: 10,
      },
      {
        name: "Puffer Jacket",
        description:
          "Insulated puffer with a packable design and water-resistant finish. Synthetic fill stays warm even when damp. Stuffs into its own interior pocket for easy travel.",
        price: 185,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/puffer-jacket.png",
        category: "tops",
        slug: "puffer-jacket",
        stock: 10,
      },
      {
        name: "Basketball Shoes",
        description:
          "High-top sneakers with ankle support and responsive cushioning. Foam midsole absorbs impact on hard landings. Rubber outsole with pivot points for quick cuts and crossovers.",
        price: 160,
        image:
          "https://epwzesmp9vjqcvrw.public.blob.vercel-storage.com/shop/basketball-shoes.png",
        category: "shoes",
        slug: "basketball-shoes",
        stock: 10,
      },
    ],
  });
  console.log("✅ Seed data inserted!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
