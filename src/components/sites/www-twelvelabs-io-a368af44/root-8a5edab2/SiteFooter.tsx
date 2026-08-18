import { ASSET, footerColumns } from "./content";
import { CookieIcon, FooterBrandMark } from "./FooterBrandMark";

const brandTitles = ["Capabilities", "Solutions", "Company", "Social"];

export function SiteFooter() {
  const brandCols = footerColumns.filter((col) => brandTitles.includes(col.title));

  return (
    <footer className="bg-[#F4F3F3] text-[#1D1C1B]">
      <div className="tl-page grid grid-cols-1 gap-0 px-5 py-16 md:px-10 min-[900px]:grid-cols-4">
        {brandCols.map((col, i) => (
          <div
            key={col.title}
            className={`py-2 min-[900px]:px-8 ${i > 0 ? "min-[900px]:border-l min-[900px]:border-[#1D1C1B]/12" : ""}`}
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

      <div className="relative overflow-hidden px-6 pb-10 pt-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #d4ed9a 0%, #f3f1eb 48%, #f6e0c8 100%)",
          }}
        />
        <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-16 py-16 md:min-h-[340px] md:gap-20">
          <FooterBrandMark className="h-12 w-auto text-[#1D1C1B] md:h-16 lg:h-20" />
          <p className="text-[13px] leading-[23.24px] tracking-[-0.28px] text-[#1D1C1B]/45">
            © 2026 TwelveLabs, Inc. All Rights Reserved
          </p>
        </div>
        <button
          type="button"
          aria-label="Cookie settings"
          className="absolute bottom-6 right-6 flex size-11 cursor-pointer items-center justify-center rounded-full text-[#1D1C1B]/55 transition-colors duration-200 hover:text-[#1D1C1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1C1B]"
        >
          <CookieIcon className="size-6" />
        </button>
      </div>
    </footer>
  );
}
