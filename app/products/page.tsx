import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "mokuworks가 직접 만들어 운영하는 웹앱 제품들.",
};

export default function ProductsIndexPage() {
  return (
    <section className="px-4 md:px-8 py-24 md:py-32 max-w-2xl">
      <h1 className="text-heading font-semibold text-ink leading-tight">
        Products 인덱스 준비 중이에요.
      </h1>
      <p className="mt-6 text-body text-ink leading-relaxed">
        moku가 직접 만든 웹앱들을 곧 모아 보여드릴게요.
      </p>
      <ul className="mt-12 flex flex-col gap-4 text-body text-ink">
        <li>
          <Link
            href="/"
            className="hover:opacity-60 transition-opacity duration-150"
          >
            → 홈으로
          </Link>
        </li>
      </ul>
    </section>
  );
}
