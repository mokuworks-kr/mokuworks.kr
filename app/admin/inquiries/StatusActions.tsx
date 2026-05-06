"use client";

import { useTransition } from "react";

import { setInquiryStatus } from "./actions";

type Status = "new" | "replied" | "archived";

const LABELS: Record<Status, string> = {
  new: "새 문의",
  replied: "답장함",
  archived: "보관함",
};

export function StatusActions({
  id,
  current,
}: {
  id: string;
  current: Status;
}) {
  const [pending, startTransition] = useTransition();

  function set(next: Status) {
    if (next === current) return;
    startTransition(() => setInquiryStatus(id, next));
  }

  return (
    <div className="flex items-center gap-3 text-small">
      {(["new", "replied", "archived"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => set(s)}
          disabled={pending || s === current}
          className={
            s === current
              ? "text-ink"
              : "text-stone hover:text-ink transition-colors duration-150 disabled:opacity-50"
          }
        >
          {s === current ? `· ${LABELS[s]}` : `${LABELS[s]}로 표시`}
        </button>
      ))}
    </div>
  );
}
