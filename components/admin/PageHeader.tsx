import Link from "next/link";

export function PageHeader({
  title,
  back = { href: "/admin", label: "← 대시보드" },
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="flex items-baseline justify-between gap-4">
      <h1 className="text-title font-medium text-ink">{title}</h1>
      <div className="flex items-center gap-6">
        {children}
        <Link
          href={back.href}
          className="text-small text-stone hover:text-ink transition-colors duration-150"
        >
          {back.label}
        </Link>
      </div>
    </header>
  );
}
