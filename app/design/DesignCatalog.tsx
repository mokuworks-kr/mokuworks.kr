"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChipPanel, ChipTrigger } from "@/components/ChipBar";

export type DesignItem = {
  id: string;
  title: string;
  slug: string;
  client: string;
  description: string;
  image_url: string | null;
  tags: string[];
};

export type TagItem = { id: string; name: string; category: string };

function lgPlacement(i: number): CSSProperties {
  const cycle = Math.floor(i / 5);
  const pos = i % 5;
  const isRight = cycle % 2 === 1;
  const rowBase = cycle * 3 + 1;

  if (pos === 0) {
    return {
      "--lg-col": isRight ? "2 / span 2" : "1 / span 2",
      "--lg-row": `${rowBase} / span 2`,
    } as CSSProperties;
  }
  if (pos === 1) {
    return {
      "--lg-col": isRight ? "1" : "3",
      "--lg-row": `${rowBase}`,
    } as CSSProperties;
  }
  return {
    "--lg-col": `${pos - 1}`,
    "--lg-row": `${rowBase + 2}`,
  } as CSSProperties;
}

type Props = {
  designs: DesignItem[];
  tags: TagItem[];
  initialQ: string;
  initialFormats: string[];
  initialFields: string[];
};

type OpenId = "field" | "format" | "all" | null;

export function DesignCatalog({
  designs,
  tags,
  initialQ,
  initialFormats,
  initialFields,
}: Props) {
  const [q, setQ] = useState(initialQ);
  const [formatFilters, setFormatFilters] = useState<Set<string>>(
    () => new Set(initialFormats),
  );
  const [fieldFilters, setFieldFilters] = useState<Set<string>>(
    () => new Set(initialFields),
  );
  const [openId, setOpenId] = useState<OpenId>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (fieldFilters.size > 0) sp.set("field", [...fieldFilters].join(","));
    if (formatFilters.size > 0) sp.set("format", [...formatFilters].join(","));
    const qs = sp.toString();
    const url = qs ? `/design?${qs}` : "/design";
    window.history.replaceState({}, "", url);
  }, [q, formatFilters, fieldFilters]);

  useEffect(() => {
    if (!openId) return;
    function onDown(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const fields = useMemo(
    () => tags.filter((t) => t.category === "field"),
    [tags],
  );
  const formats = useMemo(
    () => tags.filter((t) => t.category === "format"),
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
        fieldFilters.size > 0 &&
        ![...fieldFilters].some((id) => ds.has(id))
      )
        return false;
      if (
        formatFilters.size > 0 &&
        ![...formatFilters].some((id) => ds.has(id))
      )
        return false;
      return true;
    });
  }, [designs, q, formatFilters, fieldFilters]);

  function toggle(set: Set<string>, id: string): Set<string> {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }

  function toggleOpen(id: Exclude<OpenId, null>) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-24 md:py-32">
      <h1 className="sr-only">Design</h1>

      <div ref={filterRef}>
        <div className="border-b border-mist transition-colors has-[input:focus]:border-ink flex flex-col md:flex-row md:items-center md:gap-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목·클라이언트·설명 검색"
            className="md:flex-1 bg-transparent text-ink py-3 text-body placeholder:text-fog focus:outline-none"
          />
          {(fields.length > 0 || formats.length > 0) && (
            <div className="md:hidden">
              <ChipTrigger
                label="필터"
                count={fieldFilters.size + formatFilters.size}
                open={openId === "all"}
                onClick={() => toggleOpen("all")}
              />
            </div>
          )}
          <div className="hidden md:flex items-center gap-6">
            {fields.length > 0 && (
              <ChipTrigger
                label="Field"
                count={fieldFilters.size}
                open={openId === "field"}
                onClick={() => toggleOpen("field")}
              />
            )}
            {formats.length > 0 && (
              <ChipTrigger
                label="Format"
                count={formatFilters.size}
                open={openId === "format"}
                onClick={() => toggleOpen("format")}
              />
            )}
          </div>
        </div>

        {openId === "field" && (
          <div className="hidden md:block mt-4">
            <ChipPanel
              tags={fields}
              selected={fieldFilters}
              onClear={() => setFieldFilters(new Set())}
              onToggle={(id) => setFieldFilters((s) => toggle(s, id))}
            />
          </div>
        )}
        {openId === "format" && (
          <div className="hidden md:block mt-4">
            <ChipPanel
              tags={formats}
              selected={formatFilters}
              onClear={() => setFormatFilters(new Set())}
              onToggle={(id) => setFormatFilters((s) => toggle(s, id))}
            />
          </div>
        )}
        {openId === "all" && (
          <div className="md:hidden mt-4 flex flex-col gap-6">
            {fields.length > 0 && (
              <div>
                <p className="text-caption text-stone mb-2">Field</p>
                <ChipPanel
                  tags={fields}
                  selected={fieldFilters}
                  onClear={() => setFieldFilters(new Set())}
                  onToggle={(id) => setFieldFilters((s) => toggle(s, id))}
                />
              </div>
            )}
            {formats.length > 0 && (
              <div>
                <p className="text-caption text-stone mb-2">Format</p>
                <ChipPanel
                  tags={formats}
                  selected={formatFilters}
                  onClear={() => setFormatFilters(new Set())}
                  onToggle={(id) => setFormatFilters((s) => toggle(s, id))}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-small text-stone">
          조건에 맞는 작업이 없어요.
        </p>
      ) : (
        <ul className="design-grid mt-10">
          {filtered.map((d, i) => (
            <li key={d.id} style={lgPlacement(i)}>
              <Link href={`/design/${d.slug}`} className="group block">
                <div className="relative aspect-[4/3] bg-cloud overflow-hidden rounded-sm">
                  {d.image_url && (
                    <Image
                      src={d.image_url}
                      alt={d.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 67vw"
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
