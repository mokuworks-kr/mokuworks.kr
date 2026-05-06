import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="px-4 md:px-8 py-24 max-w-md">
      <h1 className="text-title font-medium text-ink">관리자 로그인</h1>
      <p className="mt-2 text-small text-stone">
        moku 본인만 사용해요.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </section>
  );
}
