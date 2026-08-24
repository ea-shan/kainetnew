import { ASSET, footerColumns } from "./content";
import { CookieIcon } from "./FooterBrandMark";
import { FooterAura } from "./FooterAura";

const brandTitles = ["Capabilities", "Solutions", "Company", "Social"];

export function SiteFooter() {
  const brandCols = footerColumns.filter((col) => brandTitles.includes(col.title));

  return (
    <footer className="relative overflow-hidden text-[#111111]">
      <FooterAura />
      <div className="tl-page relative grid grid-cols-1 gap-0 px-5 pt-16 pb-8 md:px-10 min-[900px]:grid-cols-4">
        {brandCols.map((col, i) => (
          <div
            key={col.title}
            className={`py-2 min-[900px]:px-8 ${i > 0 ? "min-[900px]:border-l min-[900px]:border-[#000000]/12" : ""}`}
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
            {col.title === "Social" ? (
              <div className="mt-6 flex items-center gap-3">
                <img src={`${ASSET}/images/model-marengo.png`} alt="AICPA SOC" className="h-10 w-10 rounded-full object-cover" />
                <img src={`${ASSET}/images/model-pegasus.png`} alt="GDPR" className="h-10 w-10 rounded-full object-cover" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="tl-footer-lockup pointer-events-none relative mx-auto flex items-center justify-center gap-[0.12em] px-4 text-[clamp(72px,18vw,240px)]"
      >
        <img
          src="/sites/www-twelvelabs-io-a368af44/shared/kainet.webp"
          alt=""
          className="tl-footer-icon h-[0.58em] w-[0.58em] shrink-0 rounded-[20%] object-cover"
        />
        <span className="tl-footer-mark select-none font-[family-name:var(--font-milling-bold)] leading-none tracking-[-0.06em]">
          kAInet
        </span>
      </div>

      <div className="relative flex items-center justify-between px-5 py-5 min-[768px]:px-10">
        <p className="text-[12px] leading-[23.24px] tracking-[-0.28px] text-[#111111]/45">
          © 2026 kAInet. All Rights Reserved
        </p>
        <button
          type="button"
          aria-label="Cookie settings"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#111111]/45 transition-colors duration-200 hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
        >
          <CookieIcon className="size-6" />
        </button>
      </div>
    </footer>
  );
}
