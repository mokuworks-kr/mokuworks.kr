import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-sm px-4 md:px-8 py-24">
      <h1 className="text-title font-medium text-ink">관리자 로그인</h1>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
