"use client";

import { useId, useState } from "react";

type Tag = { id: string; name: string };

type Props = {
  label: string;
  tags: Tag[];
  selected: Set<string>;
  onClear: () => void;
  onToggle: (id: string) => void;
};

export function ChipBar({ label, tags, selected, onClear, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (tags.length === 0) return null;

  const selectedNames = tags
    .filter((t) => selected.has(t.id))
    .map((t) => t.name);
  const hasSelection = selectedNames.length > 0;
  const summary = hasSelection ? selectedNames.join(", ") : label;

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile disclosure toggle (md 미만) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="md:hidden flex items-center gap-2 border-b border-mist py-3 text-body w-full"
      >
        <span
          className={`flex-1 truncate text-left ${
            hasSelection ? "text-ink" : "text-stone"
          }`}
        >
          {summary}
        </span>
        <svg
          className={`flex-none transition-transform duration-150 text-stone ${
            open ? "rotate-180" : ""
          }`}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 5.25L7 8.75l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Desktop label (md 이상) */}
      <p className="hidden md:block text-caption text-stone">{label}</p>

      {/* Chips panel — mobile에선 토글 시 노출, md+ 항상 노출 */}
      <div
        id={panelId}
        className={`${open ? "flex" : "hidden"} md:flex flex-wrap gap-2`}
      >
        <button
          type="button"
          onClick={onClear}
          className={chipCls(selected.size === 0)}
        >
          전체
        </button>
        {tags.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            className={chipCls(selected.has(t.id))}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function chipCls(active: boolean): string {
  return `px-4 py-1.5 rounded-full text-small border transition-colors duration-150 ${
    active
      ? "bg-ink text-paper border-ink"
      : "bg-transparent text-stone border-mist hover:border-stone"
  }`;
}
