import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { FilterChips } from "@/components/FilterChips";
import { createClient } from "@/lib/supabase/server";

import { DesignRowActions } from "./DesignRowActions";

export const metadata: Metadata = {
  title: "디자인 작업 관리",
  robots: { index: false, follow: false },
};

type SearchParams = { q?: string; type?: string; industry?: string };

export default async function AdminDesignPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const typeFilters = new Set(
    (sp.type ?? "").split(",").filter(Boolean),
  );
  const industryFilters = new Set(
    (sp.industry ?? "").split(",").filter(Boolean),
  );

  const supabase = await createClient();

  let query = supabase
    .from("design")
    .select("*")
    .order("date", { ascending: false });

  if (q) {
    const safe = q.replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${safe}%,client.ilike.%${safe}%`);
  }

  const [{ data: rawDesigns }, { data: tagList }] = await Promise.all([
    query,
    supabase.from("tags").select("*").order("category").order("name"),
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
    <section className="px-4 md:px-8 py-16 max-w-5xl">
      <PageHeader title="디자인 작업 관리">
        <Link
          href="/admin/design/new"
          className="text-small text-ink hover:opacity-60 transition-opacity duration-150"
        >
          + 새 작업
        </Link>
      </PageHeader>

      <form className="mt-8 flex gap-2" action="/admin/design">
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
        baseHref="/admin/design"
        searchParams={sp}
      />
      <FilterChips
        label="Work Type"
        paramName="type"
        tags={types}
        selected={typeFilters}
        baseHref="/admin/design"
        searchParams={sp}
      />

      {designs.length === 0 ? (
        <p className="mt-12 text-small text-stone">
          조건에 맞는 작업이 없어요.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col">
          {designs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-4 py-4 border-b border-mist"
            >
              <div className="relative w-16 aspect-[4/3] bg-cloud overflow-hidden rounded-sm flex-none">
                {d.image_url && (
                  <Image
                    src={d.image_url}
                    alt={d.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body text-ink truncate">{d.title}</p>
                <p className="text-small text-stone truncate">
                  {d.client} · {d.date}
                </p>
              </div>
              <DesignRowActions
                id={d.id}
                slug={d.slug}
                published={d.published}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

