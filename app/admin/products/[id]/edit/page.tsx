import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { ProductForm } from "../../ProductForm";

export const metadata: Metadata = {
  title: "제품 편집",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16">
      <PageHeader
        title={`편집: ${product.name}`}
        back={{ href: "/admin/products", label: "← 목록" }}
      />
      <div className="mt-12">
        <ProductForm
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            tagline: product.tagline,
            image_url: product.image_url,
            external_domain: product.external_domain,
            launch_date: product.launch_date,
            published: product.published,
          }}
        />
      </div>
    </section>
  );
}
