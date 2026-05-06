"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { sanitizeFilename } from "@/lib/supabase/storage";

const BUCKET = "design-images";

export type ImageItem = {
  key: string;
  url: string;
  starred: boolean;
};

type Props = {
  items: ImageItem[];
  setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  getSlug: () => string;
  onError: (msg: string | null) => void;
  onUploadingChange: (busy: boolean) => void;
};

export function DesignImageBoard({
  items,
  setItems,
  getSlug,
  onError,
  onUploadingChange,
}: Props) {
  const [uploading, setUploading] = useState(0);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    onUploadingChange(uploading > 0);
  }, [uploading, onUploadingChange]);

  async function handleFiles(files: FileList) {
    const prefix = getSlug() || "untitled";
    const supabase = createClient();
    onError(null);

    for (const file of Array.from(files)) {
      setUploading((n) => n + 1);
      try {
        const path = `${prefix}/${Date.now()}-${sanitizeFilename(file.name)}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        setItems((prev) => {
          const next = [
            ...prev,
            { key: data.publicUrl, url: data.publicUrl, starred: false },
          ];
          if (!next.some((it) => it.starred)) {
            next[0] = { ...next[0], starred: true };
          }
          return next;
        });
      } catch {
        onError("이미지 업로드에 실패했습니다.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  function star(idx: number) {
    setItems((prev) => prev.map((it, i) => ({ ...it, starred: i === idx })));
  }

  function remove(idx: number) {
    setItems((prev) => {
      const removed = prev[idx];
      const next = prev.filter((_, i) => i !== idx);
      if (removed?.starred && next.length > 0) {
        next[0] = { ...next[0], starred: true };
      }
      return next;
    });
  }

  function onDrop(targetIdx: number) {
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDraggedIdx(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption text-stone">
        별표 = 대표이미지. 카드 드래그로 순서 변경. 첫 이미지가 자동으로 별표.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const fs = e.target.files;
          if (fs && fs.length > 0) handleFiles(fs);
          e.target.value = "";
        }}
        className="text-small text-stone"
      />
      {uploading > 0 && (
        <p className="text-small text-stone">업로드 중... ({uploading})</p>
      )}
      {items.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <li
              key={it.key}
              draggable
              onDragStart={() => setDraggedIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(idx)}
              onDragEnd={() => setDraggedIdx(null)}
              className={`relative aspect-[4/3] bg-cloud rounded-sm overflow-hidden cursor-move ${
                draggedIdx === idx ? "opacity-40" : ""
              }`}
            >
              <Image
                src={it.url}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover pointer-events-none"
              />
              <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
                <button
                  type="button"
                  onClick={() => star(idx)}
                  title={it.starred ? "대표이미지" : "대표이미지로 지정"}
                  aria-label={it.starred ? "대표이미지" : "대표이미지로 지정"}
                  className={`w-7 h-7 rounded-sm flex items-center justify-center text-small ${
                    it.starred
                      ? "bg-ink text-paper"
                      : "bg-paper/80 text-stone hover:text-ink"
                  }`}
                >
                  ★
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  title="제거"
                  aria-label="제거"
                  className="w-7 h-7 rounded-sm bg-paper/80 text-stone hover:text-ink flex items-center justify-center text-small"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
