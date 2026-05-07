import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "mokuworks와 1인 메이커 moku에 대해.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16 md:py-24">
      <h1 className="text-heading font-semibold text-ink leading-tight">
        About 페이지 준비 중이에요.
      </h1>
      <p className="mt-6 text-body text-ink leading-relaxed">
        moku에 대한 이야기는 곧 정리해서 올릴게요.
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
