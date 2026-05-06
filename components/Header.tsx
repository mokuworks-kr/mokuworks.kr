import Link from "next/link";

const NAV_ITEMS = [
  { href: "/design", label: "Design" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="h-16 bg-paper">
      <div className="h-full flex items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="text-[18px] font-medium text-ink hover:opacity-60 transition-opacity duration-150"
        >
          mokuworks
        </Link>
        <nav>
          <ul className="flex items-center gap-4 md:gap-6 text-sm md:text-body text-ink">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:opacity-60 transition-opacity duration-150"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
