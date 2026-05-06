"use client";

import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";
import { sanitizeFilename } from "@/lib/supabase/storage";

import { createDesign, updateDesign } from "./actions";
import { DesignImageBoard, type ImageItem } from "./DesignImageBoard";

const BUCKET = "design-images";

export type DesignInitial = {
  id: string;
  title: string;
  slug: string;
  client: string;
  description: string;
  date: string;
  tags: string[];
  image_url: string | null;
  gallery: string[];
  published: boolean;
};

export type TagOption = {
  id: string;
  name: string;
  category: "type" | "industry";
};

const inputCls =
  "bg-cloud text-ink rounded-sm px-4 py-3 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink";
const labelCls = "text-small text-stone";

function buildInitialItems(initial?: DesignInitial): ImageItem[] {
  if (!initial) return [];
  const items: ImageItem[] = [];
  if (initial.image_url) {
    items.push({
      key: initial.image_url,
      url: initial.image_url,
      starred: true,
    });
  }
  for (const url of initial.gallery) {
    items.push({ key: url, url, starred: false });
  }
  return items;
}

async function uploadPendingItems(items: ImageItem[]): Promise<ImageItem[]> {
  const supabase = createClient();
  const out: ImageItem[] = [];
  for (const it of items) {
    if (!it.pending) {
      out.push(it);
      continue;
    }
    const path = sanitizeFilename(it.pending.name);
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, it.pending, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    out.push({ key: it.key, url: data.publicUrl, starred: it.starred });
  }
  return out;
}

export function DesignForm({
  initial,
  tags,
}: {
  initial?: DesignInitial;
  tags: TagOption[];
}) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    buildInitialItems(initial),
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    () => new Set(initial?.tags ?? []),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError(null);
      let uploaded: ImageItem[];
      try {
        uploaded = await uploadPendingItems(items);
      } catch {
        setError("이미지 업로드에 실패했습니다.");
        return;
      }
      setItems(uploaded);

      const starred = uploaded.find((it) => it.starred);
      const gallery = uploaded.filter((it) => !it.starred).map((it) => it.url);
      formData.set("image_url", starred?.url ?? "");
      formData.set("gallery", JSON.stringify(gallery));
      formData.set("tags", JSON.stringify(Array.from(selectedTagIds)));

      const res = initial
        ? await updateDesign(initial.id, formData)
        : await createDesign(formData);
      if (res && "error" in res) setError(res.error);
    });
  }

  const industryTags = tags.filter((t) => t.category === "industry");
  const typeTags = tags.filter((t) => t.category === "type");

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      <Field label="제목" required>
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title}
          className={inputCls}
        />
      </Field>

      <Field label="slug (URL 식별자)" required>
        <input
          id="slug"
          type="text"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          defaultValue={initial?.slug}
          placeholder="dnotitia-brochure"
          className={inputCls}
        />
      </Field>

      <Field label="클라이언트" required>
        <input
          type="text"
          name="client"
          required
          defaultValue={initial?.client}
          className={inputCls}
        />
      </Field>

      <Field label="작업 시기 (YYYY-MM)" required>
        <input
          type="text"
          name="date"
          required
          pattern="\d{4}-\d{2}"
          defaultValue={initial?.date}
          placeholder="2026-02"
          className={inputCls}
        />
      </Field>

      <Field label="설명">
        <textarea
          name="description"
          defaultValue={initial?.description}
          rows={6}
          className={`${inputCls} leading-relaxed`}
        />
      </Field>

      <fieldset className="flex flex-col gap-4">
        <legend className={labelCls}>태그</legend>
        <TagGroup
          label="Industry"
          tags={industryTags}
          selected={selectedTagIds}
          onToggle={toggleTag}
        />
        <TagGroup
          label="Work Type"
          tags={typeTags}
          selected={selectedTagIds}
          onToggle={toggleTag}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelCls}>이미지</legend>
        <DesignImageBoard items={items} setItems={setItems} />
      </fieldset>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? false}
        />
        <span className="text-body text-ink">공개</span>
      </label>

      {error && (
        <p className="text-small text-ink" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-paper rounded-sm px-8 py-4 text-body font-medium hover:opacity-85 transition-opacity duration-150 disabled:opacity-50 self-start"
      >
        {pending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelCls}>
        {label}
        {required && <span className="text-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}

function TagGroup({
  label,
  tags,
  selected,
  onToggle,
}: {
  label: string;
  tags: TagOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-stone">{label}</p>
      {tags.length === 0 ? (
        <p className="text-small text-fog">아직 태그가 없어요.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = selected.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggle(t.id)}
                className={`px-4 py-1.5 rounded-full text-small border transition-colors duration-150 ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "bg-transparent text-stone border-mist hover:border-stone"
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
