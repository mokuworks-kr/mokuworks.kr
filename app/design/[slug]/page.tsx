import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type RouteParams = { slug: string };

async function getDesign(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("design")
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
  const design = await getDesign(slug);
  if (!design) return { title: "Not Found" };

  const desc = design.description?.trim()
    ? design.description.slice(0, 100)
    : `${design.title} — ${design.client}`;
  const images = design.image_url
    ? [{ url: design.image_url, alt: design.title }]
    : undefined;

  return {
    title: design.title,
    description: desc,
    alternates: { canonical: `/design/${design.slug}` },
    openGraph: {
      title: design.title,
      description: desc,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: design.title,
      description: desc,
      images,
    },
  };
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) notFound();

  let tagNames: string[] = [];
  if (design.tags.length > 0) {
    const supabase = await createClient();
    const { data: tagList } = await supabase
      .from("tags")
      .select("id, name")
      .in("id", design.tags);
    tagNames = (tagList ?? []).map((t) => t.name);
  }

  const images = [design.image_url, ...(design.gallery ?? [])].filter(
    (u): u is string => !!u,
  );

  return (
    <article className="mx-auto max-w-page px-4 md:px-8">
      <div className="py-24 md:py-32 lg:grid lg:grid-cols-3 lg:gap-12">
        <header className="lg:sticky lg:top-48 lg:self-start">
          <h1 className="text-heading font-semibold text-ink leading-tight">
            {design.title}
          </h1>
          <p className="mt-4 text-small text-stone">
            {design.client} · {design.date}
            {tagNames.length > 0 ? ` · ${tagNames.join(", ")}` : ""}
          </p>
          {design.description?.trim() && (
            <p className="mt-8 text-body text-ink leading-relaxed whitespace-pre-line">
              {design.description}
            </p>
          )}
        </header>

        {images.length > 0 && (
          <div className="mt-12 lg:mt-0 lg:col-span-2 flex flex-col gap-6">
            {images.map((url) => (
              <div
                key={url}
                className="relative w-full bg-cloud overflow-hidden rounded-sm"
              >
                <Image
                  src={url}
                  alt=""
                  width={2000}
                  height={2000}
                  sizes="(min-width: 1024px) 1200px, 100vw"
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="py-16 md:py-24">
        <Link
          href="/design"
          className="text-body text-ink hover:opacity-60 transition-opacity duration-150"
        >
          ← Design 작업 더 보기
        </Link>
      </footer>
    </article>
  );
}
