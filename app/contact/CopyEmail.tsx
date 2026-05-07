"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 막힌 환경에선 아무 것도 하지 않는다.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 inline-block text-left text-body text-ink hover:opacity-60 transition-opacity duration-150"
      >
        {email}
      </button>
      <p className="mt-1 text-caption text-stone" aria-live="polite">
        {copied ? "주소가 복사됐어요" : "클릭하면 주소가 복사돼요"}
      </p>
    </>
  );
}
