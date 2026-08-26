import { footerColumns } from "./content";
import { CookieIcon, FooterBrandMark } from "./FooterBrandMark";

const FOOTER_MESH = [
  "linear-gradient(90deg, #DCC8F2 0%, #F3C9D8 36%, #FAD4C4 58%, #F8E7B0 82%, #FFF3C4 100%)",
  "radial-gradient(ellipse 85% 110% at 2% 88%, #C9B4EC 0%, transparent 60%)",
  "radial-gradient(ellipse 62% 80% at 46% 55%, #F7C4C0 0%, transparent 54%)",
  "radial-gradient(ellipse 70% 90% at 100% 50%, #FFE08A 0%, #FFF3C4 42%, transparent 64%)",
].join(",");

const FOOTER_MASK = "linear-gradient(to bottom, transparent 0%, transparent 18%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.35) 58%, #000 88%)";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white text-[#000000]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ WebkitMaskImage: FOOTER_MASK, maskImage: FOOTER_MASK }}
      >
        <div
          className="absolute -inset-x-[16%] -bottom-[30%] top-[8%]"
          style={{ backgroundImage: FOOTER_MESH, filter: "blur(88px)" }}
        />
      </div>
      <div className="tl-page relative grid grid-cols-1 gap-0 px-5 pb-0 pt-16 md:px-10 min-[900px]:grid-cols-4">
        {footerColumns.map((col, i) => (
          <div
            key={col.title}
            className={`py-2 min-[900px]:px-8 ${i > 0 ? "min-[900px]:border-l min-[900px]:border-solid min-[900px]:[border-image:linear-gradient(to_bottom,rgba(0,0,0,0.12)_55%,transparent)_1]" : ""}`}
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

      <div className="relative">
        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-8 pt-4 min-[768px]:px-10 min-[768px]:pb-10 min-[768px]:pt-6">
          <FooterBrandMark className="w-full justify-center whitespace-nowrap text-[clamp(64px,16.5vw,260px)]" />
          <div className="mt-6 pr-14 text-[13px] leading-[23.24px] tracking-[-0.28px] text-[#111111]/45 min-[768px]:mt-8">
            <div className="flex flex-col gap-1 min-[768px]:flex-row min-[768px]:items-baseline min-[768px]:justify-between">
              <p className="font-[family-name:var(--font-milling-bold)] text-[#111111]/70">kAInet</p>
              <p className="mt-1 text-center">© 2026 Express Analytics. All rights reserved.</p>
              <p>
                Built by{" "}
                <a href="https://www.expressanalytics.com" target="_blank" rel="noopener noreferrer">
                  Express Analytics
                </a>
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="Cookie settings"
          className="absolute bottom-6 right-6 flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#111111]/10 text-[#111111] transition-colors duration-200 hover:bg-[#111111]/16 hover:text-[#000000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000]"
        >
          <CookieIcon className="size-7" />
        </button>
      </div>
    </footer>
  );
}
