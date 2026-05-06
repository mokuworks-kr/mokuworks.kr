"use client";

import Link from "next/link";
import { useTransition } from "react";

import { deleteDesign, togglePublished } from "./actions";

export function DesignRowActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => togglePublished(id, !published));
  }

  function handleDelete() {
    if (!confirm(`'${slug}' 작업을 삭제하시겠습니까? 이미지도 함께 제거됩니다.`))
      return;
    startTransition(() => {
      void deleteDesign(id);
    });
  }

  return (
    <div className="flex items-center gap-4 text-small">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={
          published
            ? "text-ink hover:opacity-60 transition-opacity duration-150"
            : "text-stone hover:text-ink transition-colors duration-150"
        }
      >
        {published ? "공개됨" : "비공개"}
      </button>
      <Link
        href={`/admin/design/${id}/edit`}
        className="text-stone hover:text-ink transition-colors duration-150"
      >
        편집
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-stone hover:text-ink transition-colors duration-150 disabled:opacity-50"
      >
        삭제
      </button>
    </div>
  );
}
