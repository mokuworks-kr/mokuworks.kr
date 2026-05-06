import { TransitionLink } from "@/components/TransitionLink";

type Props = {
  label: string;
  paramName: string;
  tags: { id: string; name: string }[];
  selected: Set<string>;
  baseHref: string;
  searchParams: Record<string, string | undefined>;
};

export function FilterChips({
  label,
  paramName,
  tags,
  selected,
  baseHref,
  searchParams,
}: Props) {
  if (tags.length === 0) return null;

  function buildHref(next: Set<string>): string {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === paramName) continue;
      if (v) sp.set(k, v);
    }
    const value = [...next].join(",");
    if (value) sp.set(paramName, value);
    const qs = sp.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      <p className="text-caption text-stone">{label}</p>
      <div className="flex flex-wrap gap-2">
        <TransitionLink
          href={buildHref(new Set())}
          className={chipCls(selected.size === 0)}
        >
          전체
        </TransitionLink>
        {tags.map((t) => {
          const active = selected.has(t.id);
          const next = new Set(selected);
          if (active) next.delete(t.id);
          else next.add(t.id);
          return (
            <TransitionLink
              key={t.id}
              href={buildHref(next)}
              className={chipCls(active)}
            >
              {t.name}
            </TransitionLink>
          );
        })}
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
