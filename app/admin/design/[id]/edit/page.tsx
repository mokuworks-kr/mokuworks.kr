import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { DesignForm, type TagOption } from "../../DesignForm";

export const metadata: Metadata = {
  title: "작업 편집",
  robots: { index: false, follow: false },
};

export default async function EditDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: design }, { data: tags }] = await Promise.all([
    supabase.from("design").select("*").eq("id", id).single(),
    supabase
      .from("tags")
      .select("id, name, category")
      .order("category")
      .order("name"),
  ]);

  if (!design) notFound();

  const tagOptions: TagOption[] = (tags ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category as "type" | "industry",
  }));

  return (
    <section className="px-4 md:px-8 py-16 max-w-2xl">
      <PageHeader
        title={`편집: ${design.title}`}
        back={{ href: "/admin/design", label: "← 목록" }}
      />
      <div className="mt-12">
        <DesignForm
          tags={tagOptions}
          initial={{
            id: design.id,
            title: design.title,
            slug: design.slug,
            client: design.client,
            description: design.description,
            date: design.date,
            tags: design.tags,
            image_url: design.image_url,
            gallery: design.gallery,
            published: design.published,
          }}
        />
      </div>
    </section>
  );
}
