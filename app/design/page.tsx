import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { DesignCatalog } from "./DesignCatalog";

export const metadata: Metadata = {
  title: "Design",
  description: "mokuworks의 그래픽 디자인 외주 작업물 카탈로그.",
};

type SearchParams = { q?: string; format?: string; field?: string };

export default async function DesignIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const [{ data: designs }, { data: tags }] = await Promise.all([
    supabase
      .from("design")
      .select("id, title, slug, client, description, image_url, tags")
      .eq("published", true)
      .order("date", { ascending: false }),
    supabase.from("tags").select("id, name, category").order("name"),
  ]);

  return (
    <DesignCatalog
      designs={designs ?? []}
      tags={tags ?? []}
      initialQ={sp.q?.trim() ?? ""}
      initialFormats={(sp.format ?? "").split(",").filter(Boolean)}
      initialFields={(sp.field ?? "").split(",").filter(Boolean)}
    />
  );
}
