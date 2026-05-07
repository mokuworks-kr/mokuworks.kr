import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { TransitionLink } from "@/components/TransitionLink";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "문의 인박스",
  robots: { index: false, follow: false },
};

const STATUS_TABS = [
  { value: "all", label: "전체" },
  { value: "new", label: "새 문의" },
  { value: "replied", label: "답장함" },
  { value: "archived", label: "보관함" },
] as const;

type Status = "new" | "replied" | "archived";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: rawStatus, q: rawQ } = await searchParams;
  const status = (
    ["new", "replied", "archived"] as const
  ).includes(rawStatus as Status)
    ? (rawStatus as Status)
    : null;
  const q = rawQ?.trim() || "";

  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (q) {
    const safe = q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `name.ilike.%${safe}%,company.ilike.%${safe}%,message.ilike.%${safe}%`,
    );
  }

  const [{ data: inquiries }, { data: typeTags }] = await Promise.all([
    query,
    supabase.from("tags").select("id, name").eq("category", "type"),
  ]);

  const tagMap = new Map((typeTags ?? []).map((t) => [t.id, t.name]));

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16">
      <PageHeader title="문의 인박스" />

      <nav className="mt-8 flex flex-wrap gap-4 text-small">
        {STATUS_TABS.map((tab) => {
          const isActive =
            (tab.value === "all" && !status) || tab.value === status;
          const href =
            tab.value === "all"
              ? buildSearchUrl({ q })
              : buildSearchUrl({ status: tab.value, q });
          return (
            <TransitionLink
              key={tab.value}
              href={href}
              className={
                isActive
                  ? "text-ink"
                  : "text-stone hover:text-ink transition-colors duration-150"
              }
            >
              {tab.label}
            </TransitionLink>
          );
        })}
      </nav>

      <form className="mt-6 flex gap-2" action="/admin/inquiries">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="이름·회사·메시지 검색"
          className="flex-1 bg-cloud text-ink rounded-sm px-4 py-2 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <button
          type="submit"
          className="text-small text-stone hover:text-ink transition-colors duration-150 px-2"
        >
          검색
        </button>
      </form>

      <ul className="mt-8 flex flex-col">
        {(inquiries ?? []).length === 0 && (
          <li className="text-small text-stone py-8">
            조건에 맞는 문의가 없어요.
          </li>
        )}
        {inquiries?.map((iq) => {
          const workNames = (iq.work_types ?? []).map((t) =>
            t === "other" ? "기타" : (tagMap.get(t) ?? "—"),
          );
          return (
            <li
              key={iq.id}
              className="border-b border-mist hover:bg-canvas transition-colors duration-150"
            >
              <Link
                href={`/admin/inquiries/${iq.id}`}
                className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-body text-ink truncate">
                    {iq.name}
                    {iq.company ? (
                      <span className="text-stone"> · {iq.company}</span>
                    ) : null}
                  </p>
                  <p className="text-small text-stone truncate">
                    {workNames.length > 0 ? workNames.join(", ") : "작업 미선택"}
                    {iq.budget_range ? ` · ${iq.budget_range}` : ""}
                    {iq.timeline ? ` · ${iq.timeline}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-small">
                  <StatusBadge status={iq.status as Status} />
                  <time
                    dateTime={iq.created_at}
                    className="text-fog text-caption"
                  >
                    {formatDate(iq.created_at)}
                  </time>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const classes =
    status === "new"
      ? "bg-ink text-paper"
      : "bg-cloud text-stone";
  const label =
    status === "new" ? "새 문의" : status === "replied" ? "답장함" : "보관함";
  return (
    <span className={`${classes} px-2 py-0.5 rounded-sm text-caption`}>
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildSearchUrl(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `/admin/inquiries?${qs}` : "/admin/inquiries";
}
