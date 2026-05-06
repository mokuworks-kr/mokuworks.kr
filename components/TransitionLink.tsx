"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  pendingClassName?: string;
  children: ReactNode;
  prefetch?: ComponentProps<typeof Link>["prefetch"];
};

function StyledInner({
  className,
  pendingClassName = "opacity-50",
  children,
}: {
  className?: string;
  pendingClassName?: string;
  children: ReactNode;
}) {
  const { pending } = useLinkStatus();
  const cls = [className, pending ? pendingClassName : ""]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}

export function TransitionLink({
  href,
  className,
  pendingClassName,
  children,
  prefetch,
}: Props) {
  return (
    <Link href={href} prefetch={prefetch}>
      <StyledInner className={className} pendingClassName={pendingClassName}>
        {children}
      </StyledInner>
    </Link>
  );
}
