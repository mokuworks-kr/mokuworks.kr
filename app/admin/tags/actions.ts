"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { error: string };

export async function createTag(
  name: string,
  category: "type" | "industry",
): Promise<Result> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "이름을 입력해주세요." };
  if (!["type", "industry"].includes(category)) {
    return { error: "카테고리가 올바르지 않습니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tags")
    .insert({ name: trimmed, category });
  if (error) return { error: "태그 생성에 실패했습니다." };

  revalidatePath("/admin/tags");
  revalidatePath("/contact");
  return { ok: true };
}

export async function updateTagName(
  id: string,
  name: string,
): Promise<Result> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "이름은 비워둘 수 없습니다." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tags")
    .update({ name: trimmed })
    .eq("id", id);
  if (error) return { error: "태그 수정에 실패했습니다." };

  revalidatePath("/admin/tags");
  revalidatePath("/contact");
  revalidatePath("/design");
  return { ok: true };
}

export async function deleteTag(id: string): Promise<Result> {
  const supabase = await createClient();

  const { data: usingDesigns } = await supabase
    .from("designs")
    .select("id, tags")
    .contains("tags", [id]);

  if (usingDesigns && usingDesigns.length > 0) {
    for (const d of usingDesigns) {
      const next = (d.tags ?? []).filter((t) => t !== id);
      await supabase.from("designs").update({ tags: next }).eq("id", d.id);
    }
  }

  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) return { error: "태그 삭제에 실패했습니다." };

  revalidatePath("/admin/tags");
  revalidatePath("/contact");
  revalidatePath("/design");
  return { ok: true };
}
