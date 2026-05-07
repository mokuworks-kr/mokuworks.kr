import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description:
    "1인 메이커 mokuworks의 그래픽 디자인 작업과 자체 웹앱 제품을 한곳에 모은 사이트.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <section className="mx-auto max-w-page px-4 md:px-8 py-16 md:py-24">
      <h1 className="text-heading font-semibold text-ink leading-tight">
        mokuworks 사이트 구축 중이에요.
      </h1>
      <p className="mt-6 text-body text-ink leading-relaxed">
        디자인 작업과 자체 웹앱 제품을 한곳에 모으는 작업을 진행하고 있어요.
        그동안에는 아래에서 둘러보거나 문의해주세요.
      </p>
      <ul className="mt-12 flex flex-col gap-4 text-body text-ink">
        <li>
          <Link
            href="/design"
            className="hover:opacity-60 transition-opacity duration-150"
          >
            → Design 작업 보러가기
          </Link>
        </li>
        <li>
          <Link
            href="/products"
            className="hover:opacity-60 transition-opacity duration-150"
          >
            → Products 보러가기
          </Link>
        </li>
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
