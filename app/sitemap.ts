import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://mokuworks.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/design",
    "/products",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const supabase = await createClient();
  const [{ data: designs }, { data: products }] = await Promise.all([
    supabase
      .from("design")
      .select("slug, created_at")
      .eq("published", true),
    supabase
      .from("products")
      .select("slug, created_at")
      .eq("published", true),
  ]);

  const designRoutes: MetadataRoute.Sitemap = (designs ?? []).map((d) => ({
    url: `${BASE_URL}/design/${d.slug}`,
    lastModified: d.created_at ? new Date(d.created_at) : undefined,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : undefined,
  }));

  return [...staticRoutes, ...designRoutes, ...productRoutes];
}
