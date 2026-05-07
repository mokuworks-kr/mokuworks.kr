"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/design", label: "Design" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="모바일 메뉴"
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-32px)] bg-paper border border-mist rounded-md"
    >
      <ul className="flex items-center justify-around px-4 py-3 text-body text-ink">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:opacity-60 transition-opacity duration-150 ${
                  isActive ? "opacity-60" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
