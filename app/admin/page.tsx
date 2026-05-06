import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { logout } from "./actions";

export const metadata: Metadata = {
  title: "관리자 대시보드",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: newInquiriesCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <section className="px-4 md:px-8 py-16 max-w-3xl">
      <header className="flex items-baseline justify-between">
        <h1 className="text-title font-medium text-ink">관리자</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-small text-stone hover:text-ink hover:opacity-100 transition-colors duration-150"
          >
            로그아웃
          </button>
        </form>
      </header>

      <p className="mt-2 text-small text-stone">{user?.email}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <DashboardStat
          label="미답변 문의"
          value={`${newInquiriesCount ?? 0}건`}
          href="/admin/inquiries"
        />
        <DashboardStat label="디자인 작업" value="관리" href="/admin/designs" />
        <DashboardStat label="제품" value="관리" href="/admin/products" />
      </div>

      <p className="mt-16 text-small text-stone">
        디자인/제품/태그/문의 페이지는 v1 다음 단계에서 추가됩니다.
      </p>
    </section>
  );
}

function DashboardStat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block bg-canvas p-6 rounded-sm hover:opacity-85 transition-opacity duration-150"
    >
      <p className="text-small text-stone">{label}</p>
      <p className="mt-2 text-title font-medium text-ink">{value}</p>
    </a>
  );
}
