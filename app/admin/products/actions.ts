"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { pathFromPublicUrl } from "@/lib/supabase/storage";

const BUCKET = "product-images";

type ProductInput = {
  name: string;
  slug: string;
  tagline: string;
  image_url: string | null;
  external_domain: string | null;
  launch_date: string | null;
  published: boolean;
};

function parseForm(formData: FormData): ProductInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    external_domain:
      String(formData.get("external_domain") ?? "").trim() || null,
    launch_date: String(formData.get("launch_date") ?? "").trim() || null,
    published: formData.get("published") === "on",
  };
}

function validate(input: ProductInput): string | null {
  if (!input.name) return "이름은 필수입니다.";
  if (!input.slug) return "slug는 필수입니다.";
  if (!/^[a-z0-9-]+$/.test(input.slug))
    return "slug는 소문자, 숫자, 하이픈만 사용할 수 있습니다.";
  if (input.launch_date && !/^\d{4}-\d{2}$/.test(input.launch_date))
    return "출시일 형식은 YYYY-MM 입니다.";
  return null;
}

export async function createProduct(formData: FormData) {
  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(input);

  if (error) {
    if (error.code === "23505")
      return { error: "이미 사용 중인 slug입니다." };
    return { error: "제품 생성에 실패했습니다." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const input = parseForm(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();

  const { data: prev } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) {
    if (error.code === "23505")
      return { error: "이미 사용 중인 slug입니다." };
    return { error: "제품 수정에 실패했습니다." };
  }

  if (prev?.image_url && prev.image_url !== input.image_url) {
    const oldPath = pathFromPublicUrl(prev.image_url, BUCKET);
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/product/${input.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("products")
    .select("image_url, slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "제품 삭제에 실패했습니다." };

  if (prev?.image_url) {
    const oldPath = pathFromPublicUrl(prev.image_url, BUCKET);
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  if (prev?.slug) revalidatePath(`/product/${prev.slug}`);
  return { ok: true as const };
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("products").update({ published }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
