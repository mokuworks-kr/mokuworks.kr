const ADMIN_EMAIL = "mokuworks.kr@gmail.com";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper border-t border-mist">
      <div className="px-4 md:px-8 py-16 flex flex-col gap-6">
        <p className="text-small text-stone max-w-prose">
          mokuworks — 1인 메이커가 디자인하고 만드는 모든 것.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-body text-ink">
          <li>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="hover:opacity-60 transition-opacity duration-150"
            >
              {ADMIN_EMAIL}
            </a>
          </li>
        </ul>
        <p className="text-caption text-fog">
          © {year} mokuworks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
