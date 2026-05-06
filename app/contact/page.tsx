import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "mokuworks에 디자인 외주를 의뢰하거나 안부를 전해주세요.",
};

const ADMIN_EMAIL = "mokuworks.kr@gmail.com";

export default function ContactPage() {
  return (
    <section className="px-4 md:px-8 py-24 md:py-32 max-w-2xl">
      <h1 className="text-heading font-semibold text-ink leading-tight">
        프로젝트 의뢰하기
      </h1>
      <p className="mt-6 text-body text-ink leading-relaxed">
        브로슈어, 회사소개서, 패키지 등 다양한 그래픽 디자인 작업을 받습니다.
        보통 1-2일 안에 회신드려요.
      </p>
      <p className="mt-12 text-small text-stone">
        문의 폼은 곧 열어드릴게요. 그동안에는 아래 메일로 연락주세요.
      </p>
      <ul className="mt-4 flex flex-col gap-2 text-body text-ink">
        <li>
          <a
            href={`mailto:${ADMIN_EMAIL}`}
            className="hover:opacity-60 transition-opacity duration-150"
          >
            {ADMIN_EMAIL}
          </a>
        </li>
      </ul>
    </section>
  );
}
