"use client";

import { useActionState } from "react";

import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-small text-stone">이메일</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="bg-cloud text-ink rounded-sm px-4 py-3 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-small text-stone">비밀번호</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="bg-cloud text-ink rounded-sm px-4 py-3 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
        />
      </label>

      {state?.error && (
        <p className="text-small text-ink" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-paper rounded-sm px-8 py-4 text-body font-medium hover:opacity-85 transition-opacity duration-150 disabled:opacity-50"
      >
        {pending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
