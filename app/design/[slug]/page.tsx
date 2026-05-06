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

  return {
    title: `${design.title} | mokuworks`,
    description: desc,
    openGraph: {
      title: design.title,
      description: desc,
      images: design.image_url ? [{ url: design.image_url }] : undefined,
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
    <article>
      <header className="px-4 md:px-8 py-12 md:py-16 max-w-3xl">
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
        <div className="flex flex-col">
          {images.map((url) => (
            <div key={url} className="relative w-full bg-cloud">
              <Image
                src={url}
                alt=""
                width={2000}
                height={2000}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}

      <footer className="px-4 md:px-8 py-16 md:py-24">
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
