import { SiteButton } from "../shared/SiteButton";
import { ASSET } from "./content";

const PLATFORMS = [
  { name: "Google Ads", sub: "Sync campaigns, keywords, conversions and more.", mark: <GoogleAdsMark /> },
  { name: "Instagram Ads", sub: "Track performance, audiences and creative insights.", mark: <InstagramMark /> },
  { name: "Meta Ads", sub: "All your Meta campaigns in perfect sync.", mark: <MetaMark /> },
] as const;

export function CtaSection() {
  return (
    <section className="bg-[#0c0a10] px-5 py-8 text-[#f4f1ea] min-[768px]:px-10 min-[768px]:py-10">
      <div className="tl-page tl-cta-plate relative overflow-hidden rounded-[28px] px-6 pt-7 pb-0 min-[768px]:rounded-[36px] min-[768px]:px-12 min-[768px]:pt-8 min-[1100px]:px-16">
        <div className="tl-cta-glow" aria-hidden />
        <div className="tl-cta-dots" aria-hidden />

        <div className="tl-cta-row">
        <div className="tl-cta-copy">
          <p className="tl-cta-badge">Connect. Sync. Scale.</p>
          <h2 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.035em] min-[768px]:text-[50px] min-[768px]:leading-[1.06]">
            Connect your
            <br />
            ad platforms.
            <br /><br />
            <span className="tl-hero-grad">Unify your data.</span>
          </h2>
          <p className="tl-cta-lede">
            Bring your ad data together in one place, get real-time insights and scale what works.
          </p>
          <div className="tl-cta-actions">
            <SiteButton href="https://auth.twelvelabs.io/u/login" variant="primary" size="s" theme="dark">
              Connect Platforms
            </SiteButton>
            <p className="tl-cta-trust">
              <ShieldMark />
              Secure. Private. Built for growth.
            </p>
          </div>
        </div>

        <div className="tl-cta-board relative">
            <svg className="tl-cta-paths" viewBox="0 0 720 480" preserveAspectRatio="none" aria-hidden>
              <path d="M210 240 C 320 240, 400 78, 548 86" />
              <path d="M210 240 C 340 240, 420 240, 548 240" />
              <path d="M210 240 C 320 240, 400 400, 548 394" />
              <circle className="tl-cta-node" cx="210" cy="240" r="4.2" />
              <circle className="tl-cta-node" cx="548" cy="86" r="3.4" />
              <circle className="tl-cta-node" cx="548" cy="240" r="3.4" />
              <circle className="tl-cta-node" cx="548" cy="394" r="3.4" />
            </svg>

            <div className="tl-cta-figure">
              <span className="tl-cta-figure-glow" aria-hidden />
              <img
                src={`${ASSET}/images/girl_cta.webp`}
                alt="Marketer reviewing live ad-platform data on a laptop"
                className="tl-cta-portrait"
                width={720}
                height={900}
              />
              <span className="tl-cta-chip tl-cta-chip-a" aria-hidden>
                <BarChip />
              </span>
              <span className="tl-cta-chip tl-cta-chip-b" aria-hidden>
                <DonutChip />
              </span>
            </div>

            <ul className="tl-cta-cards">
              {PLATFORMS.map((p) => (
                <li key={p.name} className="tl-cta-card">
                  <span className="tl-cta-card-mark">{p.mark}</span>
                  <span>
                    <strong>{p.name}</strong>
                    <em>{p.sub}</em>
                  </span>
                  <span className="tl-cta-live">
                    <i />
                    Connected
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
      <path
        d="M10 2.2 16.4 4.6v5.2c0 4-2.7 6.8-6.4 8-3.7-1.2-6.4-4-6.4-8V4.6L10 2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M7.2 10.1 9.1 12l3.8-4.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChip() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <rect x="4" y="13" width="3.2" height="7" rx="1" fill="#c084fc" />
      <rect x="10.4" y="8" width="3.2" height="12" rx="1" fill="#e9d5ff" />
      <rect x="16.8" y="4" width="3.2" height="16" rx="1" fill="#a855f7" />
    </svg>
  );
}

function DonutChip() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="#6b21a8" strokeWidth="3.4" />
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="#c084fc" strokeWidth="3.4" strokeDasharray="18 28" strokeLinecap="round" />
    </svg>
  );
}

function GoogleAdsMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-6" aria-hidden>
      <path fill="#4285F4" d="M36.3 6 18.4 37.1a4.8 4.8 0 1 1-8.3-4.8L28 1.2A4.8 4.8 0 1 1 36.3 6Z" />
      <path fill="#FBBC04" d="M11.7 6 29.6 37.1a4.8 4.8 0 1 0 8.3-4.8L20 1.2A4.8 4.8 0 1 0 11.7 6Z" />
      <circle cx="8.4" cy="39.6" r="6.3" fill="#34A853" />
    </svg>
  );
}

function MetaMark() {
  return (
    <svg viewBox="0 0 36 24" className="h-4 w-6" aria-hidden>
      <path
        fill="#0081FB"
        d="M13.58 8.26c.8-1.6 1.99-2.6 3.48-2.6 2.39 0 3.89 2.6 3.89 6.7 0 4.59-1.79 7.28-4.18 7.28-1.3 0-2.39-1-3.38-2.79l-.7-1.2-.8 1.3c-1.09 1.79-2.19 2.69-3.58 2.69-2.29 0-4.08-2.69-4.08-7.28 0-4.19 1.59-6.7 3.98-6.7 1.5 0 2.69 1 3.49 2.6l.88 1.6.8-1.6Zm-2.19 1.5c-.8-1.5-1.6-2.3-2.59-2.3-1.4 0-2.3 1.8-2.3 5.1 0 3.19.8 4.99 2.2 4.99 1 0 1.79-.8 2.69-2.3l1.19-1.99-1.19-2.5Zm5.48 5.29c.9 1.5 1.7 2.3 2.59 2.3 1.4 0 2.3-1.8 2.3-4.99 0-3.3-.9-5.1-2.3-5.1-1 0-1.79.8-2.59 2.3l-1.1 1.99 1.1 3.5Z"
      />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <rect width="22" height="22" x="1" y="1" rx="6" fill="url(#tl-cta-ig)" />
      <rect width="14" height="14" x="5" y="5" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.6" cy="7.4" r="1" fill="#fff" />
      <defs>
        <linearGradient id="tl-cta-ig" x1="4" y1="20" x2="20" y2="4">
          <stop stopColor="#F58529" />
          <stop offset=".45" stopColor="#DD2A7B" />
          <stop offset="1" stopColor="#8134AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
