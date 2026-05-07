import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "mokuworks에 디자인 외주를 의뢰하거나 안부를 전해주세요.",
};

const ADMIN_EMAIL = "mokuworks.kr@gmail.com";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: formatTags } = await supabase
    .from("tags")
    .select("id, name")
    .eq("category", "format")
    .order("name");

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-24 md:py-32">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        <div className="lg:sticky lg:top-48 lg:self-start">
          <h1 className="text-heading font-semibold text-ink leading-tight">
            프로젝트 의뢰하기
          </h1>
          <p className="mt-6 text-body text-ink leading-relaxed">
            브로슈어, 회사소개서, 패키지 등 다양한 그래픽 디자인 작업을 받습니다.
            보통 1-2일 안에 회신드려요.
          </p>

          <div className="mt-12 border-t border-mist pt-8">
            <p className="text-small text-stone">직접 연락하고 싶으시다면</p>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="mt-2 inline-block text-body text-ink hover:opacity-60 transition-opacity duration-150"
            >
              {ADMIN_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-12 lg:mt-0 lg:col-span-2">
          <ContactForm formatTags={formatTags ?? []} />
        </div>
      </div>
    </section>
  );
}
