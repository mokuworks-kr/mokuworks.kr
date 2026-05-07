"use client";

type Tag = { id: string; name: string };

type TriggerProps = {
  label: string;
  count: number;
  open: boolean;
  onClick: () => void;
};

export function ChipTrigger({ label, count, open, onClick }: TriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`flex items-center gap-1.5 py-3 text-small transition-colors duration-150 ${
        count > 0 ? "text-ink" : "text-stone hover:text-ink"
      }`}
    >
      <span>{label}</span>
      {count > 0 && <span className="text-caption">({count})</span>}
      <svg
        className={`transition-transform duration-150 ${
          open ? "rotate-180" : ""
        }`}
        width="12"
        height="12"
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
  );
}

type PanelProps = {
  tags: Tag[];
  selected: Set<string>;
  onClear: () => void;
  onToggle: (id: string) => void;
};

export function ChipPanel({ tags, selected, onClear, onToggle }: PanelProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
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
  );
}

function chipCls(active: boolean): string {
  return `px-4 py-1.5 rounded-full text-small border transition-colors duration-150 ${
    active
      ? "bg-ink text-paper border-ink"
      : "bg-transparent text-stone border-mist hover:border-stone"
  }`;
}
