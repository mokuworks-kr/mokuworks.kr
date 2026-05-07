import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { TagsManager } from "./TagsManager";

export const metadata: Metadata = {
  title: "태그 관리",
  robots: { index: false, follow: false },
};

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const [{ data: tags }, { data: designs }] = await Promise.all([
    supabase.from("tags").select("*").order("category").order("name"),
    supabase.from("design").select("id, tags"),
  ]);

  const usage: Record<string, number> = {};
  for (const d of designs ?? []) {
    for (const id of d.tags ?? []) {
      usage[id] = (usage[id] ?? 0) + 1;
    }
  }

  const enriched = (tags ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    usage_count: usage[t.id] ?? 0,
  }));

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16">
      <PageHeader title="태그 관리" />
      <p className="mt-2 text-small text-stone">
        Format / Field 태그를 관리하세요. 사용 중인 태그도 강제 삭제 가능 —
        작업의 태그 목록에서 함께 제거됩니다.
      </p>

      <div className="mt-12">
        <TagsManager initialTags={enriched} />
      </div>
    </section>
  );
}
