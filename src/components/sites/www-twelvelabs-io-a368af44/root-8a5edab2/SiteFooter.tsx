import { footerColumns } from "./content";
import { CookieIcon, FooterBrandMark } from "./FooterBrandMark";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white text-[#111111]">
      <div className="tl-foot-wash" aria-hidden />
      <div className="tl-page relative grid grid-cols-1 gap-10 px-5 pb-6 pt-16 md:px-10 min-[900px]:grid-cols-4 min-[900px]:gap-0 min-[900px]:pb-2 min-[900px]:pt-20">
        {footerColumns.map((col, i) => (
          <div
            key={col.title}
            className={`min-[900px]:px-8 ${i > 0 ? "min-[900px]:border-l min-[900px]:border-[#111111]/10" : ""}`}
          >
            <p className="mb-4 text-[14px] font-[family-name:var(--font-milling-bold)] font-bold">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] leading-[23.24px] tracking-[-0.28px] hover:opacity-70">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="tl-foot-hero relative mt-8 min-[768px]:mt-12">
        <FooterBrandMark className="w-full justify-center whitespace-nowrap text-[clamp(64px,16.5vw,260px)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-8 min-[768px]:px-10 min-[768px]:pb-10">
        <div className="tl-foot-bar">
          <button
            type="button"
            aria-label="Cookie settings"
            className="flex size-11 cursor-pointer items-center justify-center text-[#111111]/55 transition-colors duration-200 hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <CookieIcon className="size-7" />
          </button>
          <p>© 2026 Express Analytics. All rights reserved.</p>
          <p>
            Built by{" "}
            <a href="https://www.expressanalytics.com" target="_blank" rel="noopener noreferrer">
              Express Analytics
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
