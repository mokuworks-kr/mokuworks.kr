import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { DesignForm, type TagOption } from "../DesignForm";

export const metadata: Metadata = {
  title: "새 작업",
  robots: { index: false, follow: false },
};

export default async function NewDesignPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, category")
    .order("category")
    .order("name");

  const tagOptions: TagOption[] = (tags ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category as "type" | "industry",
  }));

  return (
    <section className="px-4 md:px-8 py-16 max-w-2xl">
      <PageHeader
        title="새 작업"
        back={{ href: "/admin/design", label: "← 목록" }}
      />
      <div className="mt-12">
        <DesignForm tags={tagOptions} />
      </div>
    </section>
  );
}
