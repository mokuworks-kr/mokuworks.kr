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

  const [
    { count: newInquiriesCount },
    { count: productsCount },
    { count: designCount },
  ] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("design").select("*", { count: "exact", head: true }),
  ]);

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16">
      <header className="flex items-baseline justify-between">
        <h1 className="text-title font-medium text-ink">관리자</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-small text-stone hover:text-ink transition-colors duration-150"
          >
            로그아웃
          </button>
        </form>
      </header>

      <p className="mt-2 text-small text-stone">{user?.email}</p>

      <nav className="mt-12 grid gap-6 md:grid-cols-2">
        <DashboardCard
          label="미답변 문의"
          value={`${newInquiriesCount ?? 0}건`}
          href="/admin/inquiries"
        />
        <DashboardCard
          label="제품"
          value={`${productsCount ?? 0}개`}
          href="/admin/products"
        />
        <DashboardCard
          label="태그"
          value="관리"
          href="/admin/tags"
        />
        <DashboardCard
          label="디자인 작업"
          value={`${designCount ?? 0}개`}
          href="/admin/design"
        />
      </nav>
    </section>
  );
}

function DashboardCard({
  label,
  value,
  href,
  disabled,
}: {
  label: string;
  value: string;
  href?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="block bg-canvas p-6 rounded-sm opacity-50 cursor-not-allowed">
        <p className="text-small text-stone">{label}</p>
        <p className="mt-2 text-title font-medium text-stone">{value}</p>
      </div>
    );
  }
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
