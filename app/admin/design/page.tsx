import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { AdminDesignCatalog } from "./AdminDesignCatalog";

export const metadata: Metadata = {
  title: "디자인 작업 관리",
  robots: { index: false, follow: false },
};

type SearchParams = { q?: string; format?: string; field?: string };

export default async function AdminDesignPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const [{ data: designs }, { data: tags }] = await Promise.all([
    supabase
      .from("design")
      .select(
        "id, title, slug, client, description, date, image_url, tags, published",
      )
      .order("date", { ascending: false }),
    supabase.from("tags").select("id, name, category").order("name"),
  ]);

  return (
    <section className="mx-auto max-w-form px-4 md:px-8 py-16">
      <PageHeader title="디자인 작업 관리">
        <Link
          href="/admin/design/new"
          className="text-small text-ink hover:opacity-60 transition-opacity duration-150"
        >
          + 새 작업
        </Link>
      </PageHeader>

      <AdminDesignCatalog
        designs={designs ?? []}
        tags={tags ?? []}
        initialQ={sp.q?.trim() ?? ""}
        initialFormats={(sp.format ?? "").split(",").filter(Boolean)}
        initialFields={(sp.field ?? "").split(",").filter(Boolean)}
      />
    </section>
  );
}
