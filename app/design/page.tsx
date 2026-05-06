import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FilterChips } from "@/components/FilterChips";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Design",
  description: "mokuworks의 그래픽 디자인 외주 작업물 카탈로그.",
};

type SearchParams = { q?: string; type?: string; industry?: string };

export default async function DesignIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const typeFilters = new Set((sp.type ?? "").split(",").filter(Boolean));
  const industryFilters = new Set(
    (sp.industry ?? "").split(",").filter(Boolean),
  );

  const supabase = await createClient();

  let query = supabase
    .from("design")
    .select("id, title, slug, client, image_url, tags")
    .eq("published", true)
    .order("date", { ascending: false });

  if (q) {
    const safe = q.replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${safe}%,client.ilike.%${safe}%`);
  }

  const [{ data: rawDesigns }, { data: tagList }] = await Promise.all([
    query,
    supabase.from("tags").select("id, name, category").order("name"),
  ]);

  const industries = (tagList ?? []).filter((t) => t.category === "industry");
  const types = (tagList ?? []).filter((t) => t.category === "type");

  const designs = (rawDesigns ?? []).filter((d) => {
    const ds = new Set(d.tags);
    if (
      industryFilters.size > 0 &&
      ![...industryFilters].some((id) => ds.has(id))
    )
      return false;
    if (typeFilters.size > 0 && ![...typeFilters].some((id) => ds.has(id)))
      return false;
    return true;
  });

  return (
    <section className="px-4 md:px-8 py-12">
      <h1 className="sr-only">Design</h1>

      <form className="flex gap-2 max-w-2xl" action="/design">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="제목·클라이언트 검색"
          className="flex-1 bg-cloud text-ink rounded-sm px-4 py-2 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
        />
        {sp.type && <input type="hidden" name="type" value={sp.type} />}
        {sp.industry && (
          <input type="hidden" name="industry" value={sp.industry} />
        )}
        <button
          type="submit"
          className="text-small text-stone hover:text-ink transition-colors duration-150 px-2"
        >
          검색
        </button>
      </form>

      <FilterChips
        label="Industry"
        paramName="industry"
        tags={industries}
        selected={industryFilters}
        baseHref="/design"
        searchParams={sp}
      />
      <FilterChips
        label="Work Type"
        paramName="type"
        tags={types}
        selected={typeFilters}
        baseHref="/design"
        searchParams={sp}
      />

      {designs.length === 0 ? (
        <p className="mt-16 text-small text-stone">
          조건에 맞는 작업이 없어요.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((d) => (
            <li key={d.id}>
              <Link href={`/design/${d.slug}`} className="group block">
                <div className="relative aspect-[4/3] bg-cloud overflow-hidden rounded-sm">
                  {d.image_url && (
                    <Image
                      src={d.image_url}
                      alt={d.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <p className="text-body text-ink font-medium truncate">
                    {d.title}
                  </p>
                  <p className="text-small text-stone truncate">{d.client}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
