import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design",
  description: "mokuworks의 그래픽 디자인 외주 작업물 카탈로그.",
};

export default function DesignIndexPage() {
  return (
    <section className="px-4 md:px-8 py-24 md:py-32 max-w-2xl">
      <h1 className="text-heading font-semibold text-ink leading-tight">
        Design 작업 인덱스 준비 중이에요.
      </h1>
      <p className="mt-6 text-body text-ink leading-relaxed">
        곧 작업물 카탈로그를 공개할 예정이에요. 의뢰가 필요하시면 아래로
        연락주세요.
      </p>
      <ul className="mt-12 flex flex-col gap-4 text-body text-ink">
        <li>
          <Link
            href="/contact"
            className="hover:opacity-60 transition-opacity duration-150"
          >
            → 프로젝트 의뢰하기
          </Link>
        </li>
      </ul>
    </section>
  );
}
