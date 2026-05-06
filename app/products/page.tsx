import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Products",
  description: "mokuworks가 직접 만들어 운영하는 웹앱 제품들.",
};

export default async function ProductsIndexPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, tagline, image_url, launch_date, created_at")
    .eq("published", true)
    .order("launch_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <section className="px-4 md:px-8 py-12">
      <h1 className="sr-only">Products</h1>

      {!products || products.length === 0 ? (
        <p className="text-small text-stone">아직 공개된 제품이 없어요.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/product/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] bg-cloud overflow-hidden rounded-sm">
                  {p.image_url && (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <p className="text-body text-ink font-medium truncate">
                    {p.name}
                  </p>
                  <p className="text-small text-stone truncate">{p.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
