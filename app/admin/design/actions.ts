"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { pathFromPublicUrl } from "@/lib/supabase/storage";

const BUCKET = "design-images";

type DesignInput = {
  title: string;
  slug: string;
  client: string;
  description: string;
  date: string;
  tags: string[];
  image_url: string | null;
  gallery: string[];
  published: boolean;
};

function parseStringArray(raw: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function parseForm(formData: FormData): DesignInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    client: String(formData.get("client") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    tags: parseStringArray(formData.get("tags")),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    gallery: parseStringArray(formData.get("gallery")),
    published: formData.get("published") === "on",
  };
}

function validate(input: DesignInput): string | null {
  if (!input.title) return "제목은 필수입니다.";
  if (!input.slug) return "slug는 필수입니다.";
  if (!/^[a-z0-9-]+$/.test(input.slug))
    return "slug는 소문자, 숫자, 하이픈만 사용할 수 있습니다.";
  if (!input.client) return "클라이언트는 필수입니다.";
  if (!input.date) return "작업 시기는 필수입니다.";
  if (!/^\d{4}-\d{2}$/.test(input.date))
    return "작업 시기 형식은 YYYY-MM 입니다.";
  return null;
}

function diffOrphans(
  prev: { image_url: string | null; gallery: string[] },
  next: { image_url: string | null; gallery: string[] },
): string[] {
  const prevUrls = new Set<string>();
  if (prev.image_url) prevUrls.add(prev.image_url);
  for (const u of prev.gallery ?? []) prevUrls.add(u);

  const nextUrls = new Set<string>();
  if (next.image_url) nextUrls.add(next.image_url);
  for (const u of next.gallery) nextUrls.add(u);

  const paths: string[] = [];
  for (const url of prevUrls) {
    if (nextUrls.has(url)) continue;
    const p = pathFromPublicUrl(url, BUCKET);
    if (p) paths.push(p);
  }
  return paths;
}

export async function createDesign(formData: FormData) {
  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("design").insert(input);
  if (error) {
    if (error.code === "23505") return { error: "이미 사용 중인 slug입니다." };
    return { error: "작업 생성에 실패했습니다." };
  }

  revalidatePath("/admin/design");
  revalidatePath("/design");
  redirect("/admin/design");
}

export async function updateDesign(id: string, formData: FormData) {
  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("design")
    .select("image_url, gallery, slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("design").update(input).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "이미 사용 중인 slug입니다." };
    return { error: "작업 수정에 실패했습니다." };
  }

  if (prev) {
    const orphans = diffOrphans(prev, input);
    if (orphans.length > 0) {
      await supabase.storage.from(BUCKET).remove(orphans);
    }
  }

  revalidatePath("/admin/design");
  revalidatePath("/design");
  if (prev?.slug) revalidatePath(`/design/${prev.slug}`);
  if (input.slug !== prev?.slug) revalidatePath(`/design/${input.slug}`);
  redirect("/admin/design");
}

export async function deleteDesign(id: string) {
  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("design")
    .select("image_url, gallery, slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("design").delete().eq("id", id);
  if (error) return { error: "작업 삭제에 실패했습니다." };

  if (prev) {
    const orphans = diffOrphans(prev, {
      image_url: null,
      gallery: [],
    });
    if (orphans.length > 0) {
      await supabase.storage.from(BUCKET).remove(orphans);
    }
  }

  revalidatePath("/admin/design");
  revalidatePath("/design");
  if (prev?.slug) revalidatePath(`/design/${prev.slug}`);
  return { ok: true as const };
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("design")
    .select("slug")
    .eq("id", id)
    .single();

  await supabase.from("design").update({ published }).eq("id", id);

  revalidatePath("/admin/design");
  revalidatePath("/design");
  if (prev?.slug) revalidatePath(`/design/${prev.slug}`);
}
