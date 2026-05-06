"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { ChipBar } from "@/components/ChipBar";

import { DesignRowActions } from "./DesignRowActions";

export type AdminDesignItem = {
  id: string;
  title: string;
  slug: string;
  client: string;
  description: string;
  date: string;
  image_url: string | null;
  tags: string[];
  published: boolean;
};

export type TagItem = { id: string; name: string; category: string };

type Props = {
  designs: AdminDesignItem[];
  tags: TagItem[];
  initialQ: string;
  initialTypes: string[];
  initialIndustries: string[];
};

export function AdminDesignCatalog({
  designs,
  tags,
  initialQ,
  initialTypes,
  initialIndustries,
}: Props) {
  const [q, setQ] = useState(initialQ);
  const [typeFilters, setTypeFilters] = useState<Set<string>>(
    () => new Set(initialTypes),
  );
  const [industryFilters, setIndustryFilters] = useState<Set<string>>(
    () => new Set(initialIndustries),
  );

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (industryFilters.size > 0)
      sp.set("industry", [...industryFilters].join(","));
    if (typeFilters.size > 0) sp.set("type", [...typeFilters].join(","));
    const qs = sp.toString();
    const url = qs ? `/admin/design?${qs}` : "/admin/design";
    window.history.replaceState({}, "", url);
  }, [q, typeFilters, industryFilters]);

  const industries = useMemo(
    () => tags.filter((t) => t.category === "industry"),
    [tags],
  );
  const types = useMemo(
    () => tags.filter((t) => t.category === "type"),
    [tags],
  );

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return designs.filter((d) => {
      if (lower) {
        const hay = `${d.title} ${d.client} ${d.description}`.toLowerCase();
        if (!hay.includes(lower)) return false;
      }
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
  }, [designs, q, typeFilters, industryFilters]);

  function toggle(set: Set<string>, id: string): Set<string> {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }

  return (
    <>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="제목·클라이언트·설명 검색"
        className="mt-8 w-full max-w-2xl bg-cloud text-ink rounded-sm px-4 py-2 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
      />

      <ChipBar
        label="Industry"
        tags={industries}
        selected={industryFilters}
        onClear={() => setIndustryFilters(new Set())}
        onToggle={(id) => setIndustryFilters((s) => toggle(s, id))}
      />
      <ChipBar
        label="Work Type"
        tags={types}
        selected={typeFilters}
        onClear={() => setTypeFilters(new Set())}
        onToggle={(id) => setTypeFilters((s) => toggle(s, id))}
      />

      {filtered.length === 0 ? (
        <p className="mt-12 text-small text-stone">
          조건에 맞는 작업이 없어요.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col">
          {filtered.map((d) => (
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
    </>
  );
}
