"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChipPanel, ChipTrigger } from "@/components/ChipBar";

import { DesignRowActions } from "./DesignRowActions";

type OpenId = "field" | "format" | null;

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
  initialFormats: string[];
  initialFields: string[];
};

export function AdminDesignCatalog({
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
    const url = qs ? `/admin/design?${qs}` : "/admin/design";
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
    <>
      <div ref={filterRef} className="mt-8">
        <div className="border-b border-mist transition-colors has-[input:focus]:border-ink flex flex-col md:flex-row md:items-center md:gap-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목·클라이언트·설명 검색"
            className="md:flex-1 bg-transparent text-ink py-3 text-body placeholder:text-fog focus:outline-none"
          />
          <div className="flex items-center gap-6">
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
          <div className="mt-4">
            <ChipPanel
              tags={fields}
              selected={fieldFilters}
              onClear={() => setFieldFilters(new Set())}
              onToggle={(id) => setFieldFilters((s) => toggle(s, id))}
            />
          </div>
        )}
        {openId === "format" && (
          <div className="mt-4">
            <ChipPanel
              tags={formats}
              selected={formatFilters}
              onClear={() => setFormatFilters(new Set())}
              onToggle={(id) => setFormatFilters((s) => toggle(s, id))}
            />
          </div>
        )}
      </div>

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
