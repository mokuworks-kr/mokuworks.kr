"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ImageItem = {
  key: string;
  url: string;
  starred: boolean;
  pending?: File;
};

type Props = {
  items: ImageItem[];
  setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
};

export function DesignImageBoard({ items, setItems }: Props) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dropOver, setDropOver] = useState(false);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  function isFileDrag(e: React.DragEvent) {
    return Array.from(e.dataTransfer.types).includes("Files");
  }

  function addFiles(files: FileList) {
    const newItems: ImageItem[] = [];
    for (const file of Array.from(files)) {
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(objectUrl);
      newItems.push({
        key: crypto.randomUUID(),
        url: objectUrl,
        starred: false,
        pending: file,
      });
    }
    setItems((prev) => {
      const next = [...prev, ...newItems];
      if (!next.some((it) => it.starred) && next.length > 0) {
        next[0] = { ...next[0], starred: true };
      }
      return next;
    });
  }

  function star(idx: number) {
    setItems((prev) => prev.map((it, i) => ({ ...it, starred: i === idx })));
  }

  function remove(idx: number) {
    setItems((prev) => {
      const removed = prev[idx];
      if (removed?.pending && objectUrlsRef.current.has(removed.url)) {
        URL.revokeObjectURL(removed.url);
        objectUrlsRef.current.delete(removed.url);
      }
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
        저장 시 업로드됩니다.
      </p>
      <label
        onDragEnter={(e) => {
          if (!isFileDrag(e)) return;
          e.preventDefault();
          setDropOver(true);
        }}
        onDragOver={(e) => {
          if (!isFileDrag(e)) return;
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
          setDropOver(false);
        }}
        onDrop={(e) => {
          if (!isFileDrag(e)) return;
          e.preventDefault();
          setDropOver(false);
          const fs = e.dataTransfer.files;
          if (fs && fs.length > 0) addFiles(fs);
        }}
        className={`flex flex-col items-center gap-1 border-2 border-dashed rounded-sm px-6 py-10 cursor-pointer transition-colors duration-150 ${
          dropOver
            ? "border-ink bg-canvas"
            : "border-mist hover:border-stone bg-transparent"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const fs = e.target.files;
            if (fs && fs.length > 0) addFiles(fs);
            e.target.value = "";
          }}
          className="sr-only"
        />
        <p className="text-body text-ink">이미지를 끌어다 놓거나 클릭</p>
        <p className="text-caption text-stone">여러 장 동시 추가 가능</p>
      </label>
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
                unoptimized={Boolean(it.pending)}
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
              {it.pending && (
                <span className="absolute bottom-1.5 left-1.5 text-caption bg-paper/80 text-stone px-2 py-0.5 rounded-sm">
                  미업로드
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
