import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";

import { ProductForm } from "../ProductForm";

export const metadata: Metadata = {
  title: "새 제품",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <section className="px-4 md:px-8 py-16 max-w-2xl">
      <PageHeader
        title="새 제품"
        back={{ href: "/admin/products", label: "← 목록" }}
      />
      <div className="mt-12">
        <ProductForm />
      </div>
    </section>
  );
}
