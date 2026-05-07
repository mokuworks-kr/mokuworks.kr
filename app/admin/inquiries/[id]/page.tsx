import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";

import { StatusActions } from "../StatusActions";

export const metadata: Metadata = {
  title: "문의 상세",
  robots: { index: false, follow: false },
};

type Status = "new" | "replied" | "archived";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (!inquiry) notFound();

  const { data: typeTags } = await supabase
    .from("tags")
    .select("id, name")
    .eq("category", "type");
  const tagMap = new Map((typeTags ?? []).map((t) => [t.id, t.name]));

  const workNames = (inquiry.work_types ?? []).map((t) =>
    t === "other" ? "기타" : (tagMap.get(t) ?? "—"),
  );

  const mailtoSubject = encodeURIComponent(
    `[mokuworks] ${inquiry.name}님의 문의에 대한 회신`,
  );

  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16">
      <PageHeader
        title="문의 상세"
        back={{ href: "/admin/inquiries", label: "← 목록" }}
      />

      <div className="mt-8">
        <StatusActions id={inquiry.id} current={inquiry.status as Status} />
      </div>

      <dl className="mt-12 flex flex-col gap-6">
        <Row label="이름">{inquiry.name}</Row>
        <Row label="이메일">
          <a
            href={`mailto:${inquiry.email}?subject=${mailtoSubject}`}
            className="text-ink hover:opacity-60 transition-opacity duration-150"
          >
            {inquiry.email}
          </a>
        </Row>
        {inquiry.company && <Row label="회사 / 소속">{inquiry.company}</Row>}
        {workNames.length > 0 && (
          <Row label="작업 종류">{workNames.join(", ")}</Row>
        )}
        {inquiry.work_other && <Row label="기타 작업">{inquiry.work_other}</Row>}
        {inquiry.budget_range && <Row label="예산">{inquiry.budget_range}</Row>}
        {inquiry.timeline && <Row label="일정">{inquiry.timeline}</Row>}
        <Row label="받은 시각">
          {new Date(inquiry.created_at).toLocaleString("ko-KR")}
        </Row>
        <Row label="메시지">
          <p className="text-body text-ink leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </p>
        </Row>
      </dl>

      <div className="mt-12">
        <a
          href={`mailto:${inquiry.email}?subject=${mailtoSubject}`}
          className="inline-block bg-ink text-paper rounded-sm px-8 py-4 text-body font-medium hover:opacity-85 transition-opacity duration-150"
        >
          메일로 답장
        </a>
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-small text-stone">{label}</dt>
      <dd className="text-body text-ink">{children}</dd>
    </div>
  );
}
