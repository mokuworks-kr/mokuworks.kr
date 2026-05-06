"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";
import { sanitizeFilename } from "@/lib/supabase/storage";

import { createProduct, updateProduct } from "./actions";

const BUCKET = "product-images";

export type ProductInitial = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image_url: string | null;
  external_domain: string | null;
  launch_date: string | null;
  published: boolean;
};

const inputCls =
  "bg-cloud text-ink rounded-sm px-4 py-3 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink";
const labelCls = "text-small text-stone";

type ImageState =
  | { kind: "empty" }
  | { kind: "remote"; url: string }
  | { kind: "pending"; objectUrl: string; file: File };

export function ProductForm({ initial }: { initial?: ProductInitial }) {
  const [imageState, setImageState] = useState<ImageState>(() =>
    initial?.image_url
      ? { kind: "remote", url: initial.image_url }
      : { kind: "empty" },
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFile(file: File) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setImageState({ kind: "pending", objectUrl, file });
  }

  async function uploadPending(state: ImageState): Promise<string | null> {
    if (state.kind === "empty") return null;
    if (state.kind === "remote") return state.url;
    const supabase = createClient();
    const path = sanitizeFilename(state.file.name);
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, state.file, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setError(null);
      let url: string | null;
      try {
        url = await uploadPending(imageState);
      } catch {
        setError("이미지 업로드에 실패했습니다.");
        return;
      }
      if (url && imageState.kind === "pending") {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setImageState({ kind: "remote", url });
      }
      formData.set("image_url", url ?? "");
      const res = initial
        ? await updateProduct(initial.id, formData)
        : await createProduct(formData);
      if (res && "error" in res) setError(res.error);
    });
  }

  const previewUrl =
    imageState.kind === "remote"
      ? imageState.url
      : imageState.kind === "pending"
        ? imageState.objectUrl
        : null;

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      <Field label="제품명" required>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial?.name}
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
          placeholder="suma"
          className={inputCls}
        />
      </Field>

      <Field label="한 줄 소개">
        <input
          type="text"
          name="tagline"
          defaultValue={initial?.tagline}
          className={inputCls}
        />
      </Field>

      <Field label="대표이미지">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="text-small text-stone"
        />
        <p className="text-caption text-stone">저장 시 업로드됩니다.</p>
        {previewUrl && (
          <div className="mt-2 relative w-48 aspect-[4/3] bg-cloud overflow-hidden rounded-sm">
            <Image
              src={previewUrl}
              alt="대표이미지 미리보기"
              fill
              sizes="192px"
              unoptimized={imageState.kind === "pending"}
              className="object-cover"
            />
            {imageState.kind === "pending" && (
              <span className="absolute bottom-1.5 left-1.5 text-caption bg-paper/80 text-stone px-2 py-0.5 rounded-sm">
                미업로드
              </span>
            )}
          </div>
        )}
      </Field>

      <Field label="외부 도메인 (옵션)">
        <input
          type="text"
          name="external_domain"
          defaultValue={initial?.external_domain ?? ""}
          placeholder="suma.app"
          className={inputCls}
        />
      </Field>

      <Field label="출시일 (YYYY-MM, 옵션)">
        <input
          type="text"
          name="launch_date"
          pattern="\d{4}-\d{2}"
          defaultValue={initial?.launch_date ?? ""}
          placeholder="2026-05"
          className={inputCls}
        />
      </Field>

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
