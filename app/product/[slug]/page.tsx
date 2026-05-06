import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type RouteParams = { slug: string };

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };

  return {
    title: `${product.name} | mokuworks`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <article>
      <header className="px-4 md:px-8 py-16 md:py-24 max-w-3xl">
        <h1 className="text-heading font-semibold text-ink leading-tight">
          {product.name}
        </h1>
        <p className="mt-4 text-title text-stone leading-snug">
          {product.tagline}
        </p>
        {product.launch_date && (
          <p className="mt-2 text-small text-fog">{product.launch_date}</p>
        )}

        {product.external_domain && (
          <div className="mt-10">
            <a
              href={`https://${product.external_domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-ink text-paper text-body font-medium px-8 py-4 rounded-sm hover:opacity-85 transition-opacity duration-150"
            >
              {product.external_domain} 방문하기 →
            </a>
          </div>
        )}
      </header>

      {product.image_url && (
        <div className="relative w-full bg-cloud">
          <Image
            src={product.image_url}
            alt={product.name}
            width={2000}
            height={2000}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
      )}

      <footer className="px-4 md:px-8 py-16 md:py-24">
        <Link
          href="/products"
          className="text-body text-ink hover:opacity-60 transition-opacity duration-150"
        >
          ← Products로 돌아가기
        </Link>
      </footer>
    </article>
  );
}
