import { footerColumns } from "./content";
import { CookieIcon, FooterBrandMark } from "./FooterBrandMark";

const FOOTER_MESH = [
  "linear-gradient(180deg, #D8BCEB 0%, transparent 36%)",
  "linear-gradient(180deg, transparent 58%, #E6BEC6 100%)",
  "linear-gradient(165deg, #7F7BC1 0%, transparent 42%)",
  "radial-gradient(ellipse 90% 100% at 6% 78%, #CECFF7 0%, transparent 62%)",
  "radial-gradient(ellipse 70% 85% at 28% 12%, #D8BCEB 0%, transparent 56%)",
  "radial-gradient(ellipse 50% 70% at 48% 42%, #FFFFFF 0%, transparent 48%)",
  "radial-gradient(ellipse 80% 95% at 94% 28%, #E6BEC6 0%, transparent 60%)",
  "radial-gradient(ellipse 55% 70% at 74% 96%, #CAC1CD 0%, transparent 52%)",
  "radial-gradient(ellipse 52% 68% at 62% 68%, #7F7BC1 0%, transparent 50%)",
].join(",");

const FOOTER_FADE =
  "linear-gradient(to bottom, #EEEEEE 0%, rgba(238,238,238,0.62) 8%, transparent 22%, transparent 78%, rgba(238,238,238,0.28) 92%, #EEEEEE 100%)";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#EEEEEE] text-[#000000]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -inset-[20%]"
          style={{ backgroundImage: FOOTER_MESH, filter: "blur(64px)" }}
        />
        <div className="absolute inset-0" style={{ background: FOOTER_FADE }} />
      </div>
      <div className="tl-page relative grid grid-cols-1 gap-0 px-5 py-16 md:px-10 min-[900px]:grid-cols-4">
        {footerColumns.map((col, i) => (
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
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-6 pt-10 min-[768px]:px-10 min-[768px]:pt-14">
          <FooterBrandMark className="w-full justify-center whitespace-nowrap text-[clamp(64px,16.5vw,260px)]" />
          <div className="mt-6 pr-14 text-[13px] leading-[23.24px] tracking-[-0.28px] text-[#111111]/45 min-[768px]:mt-8">
            <div className="flex flex-col gap-1 min-[768px]:flex-row min-[768px]:items-baseline min-[768px]:justify-between">
              <p className="font-[family-name:var(--font-milling-bold)] text-[#111111]/70">kAInet</p>
              <p className="mt-1 text-center">© 2026 Express Analytics. All rights reserved.</p>
              <p>Built by <a href="https://www.expressanalytics.com" target="_blank" rel="noopener noreferrer">Express Analytics</a></p>
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
