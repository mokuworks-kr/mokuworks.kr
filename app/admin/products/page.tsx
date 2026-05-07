import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { ProductRowActions } from "./ProductRowActions";

export const metadata: Metadata = {
  title: "제품 관리",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("launch_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-form px-4 md:px-8 py-16">
      <PageHeader title="제품 관리">
        <Link
          href="/admin/products/new"
          className="text-small text-ink hover:opacity-60 transition-opacity duration-150"
        >
          + 새 제품
        </Link>
      </PageHeader>

      {(products ?? []).length === 0 ? (
        <p className="mt-12 text-small text-stone">
          아직 등록된 제품이 없어요.
        </p>
      ) : (
        <ul className="mt-12 flex flex-col">
          {products?.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 py-4 border-b border-mist"
            >
              <div className="relative w-16 aspect-[4/3] bg-cloud overflow-hidden rounded-sm flex-none">
                {p.image_url && (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body text-ink truncate">{p.name}</p>
                <p className="text-small text-stone truncate">
                  /product/{p.slug}
                  {p.tagline ? ` — ${p.tagline}` : ""}
                </p>
              </div>
              <ProductRowActions
                id={p.id}
                slug={p.slug}
                published={p.published}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
