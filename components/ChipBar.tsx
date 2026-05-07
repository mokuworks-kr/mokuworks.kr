"use client";

type Tag = { id: string; name: string };

type Props = {
  label: string;
  tags: Tag[];
  selected: Set<string>;
  onClear: () => void;
  onToggle: (id: string) => void;
};

export function ChipBar({ label, tags, selected, onClear, onToggle }: Props) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-stone">{label}</p>
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
