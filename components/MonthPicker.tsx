"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  name: string;
  defaultValue?: string; // 'YYYY-MM'
  required?: boolean;
};

const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

function parseYearMonth(v: string): { year: number; month: number } | null {
  if (!/^\d{4}-\d{2}$/.test(v)) return null;
  const year = parseInt(v.slice(0, 4), 10);
  const month = parseInt(v.slice(5, 7), 10);
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function formatDisplay(v: string): string {
  const ym = parseYearMonth(v);
  if (!ym) return "";
  return `${ym.year}년 ${ym.month}월`;
}

export function MonthPicker({ name, defaultValue, required }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [displayedYear, setDisplayedYear] = useState(() => {
    const parsed = parseYearMonth(defaultValue ?? "");
    return parsed?.year ?? new Date().getFullYear();
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectMonth(monthIdx: number) {
    const ym = `${displayedYear}-${String(monthIdx + 1).padStart(2, "0")}`;
    setValue(ym);
    setOpen(false);
  }

  const selected = parseYearMonth(value);
  const display = formatDisplay(value);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full bg-cloud text-ink rounded-sm px-4 py-3 text-body text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-1 focus:ring-ink"
      >
        <span className={display ? "text-ink" : "text-fog"}>
          {display || "선택"}
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
      {open && (
        <div
          id={panelId}
          role="dialog"
          className="absolute left-0 right-0 z-20 mt-1 bg-paper border border-mist rounded-sm p-3"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setDisplayedYear((y) => y - 1)}
              aria-label="이전 해"
              className="w-8 h-8 flex items-center justify-center rounded-sm text-stone hover:text-ink hover:bg-cloud transition-colors duration-150"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8.75 3.5L5.25 7l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="text-body text-ink font-medium">
              {displayedYear}
            </span>
            <button
              type="button"
              onClick={() => setDisplayedYear((y) => y + 1)}
              aria-label="다음 해"
              className="w-8 h-8 flex items-center justify-center rounded-sm text-stone hover:text-ink hover:bg-cloud transition-colors duration-150"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5.25 3.5L8.75 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m, i) => {
              const isSelected =
                selected?.year === displayedYear && selected?.month === i + 1;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => selectMonth(i)}
                  className={`px-2 py-2 rounded-sm text-small transition-colors duration-150 ${
                    isSelected
                      ? "bg-ink text-paper"
                      : "text-stone hover:bg-cloud hover:text-ink"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
