import type { CSSProperties, ReactNode } from "react";
import { SiteButton } from "../shared/SiteButton";
import { ASSET } from "./content";

const PLATFORMS: { name: string; mark: ReactNode }[] = [
  { name: "Google Ads", mark: <GoogleAdsMark /> },
  { name: "YouTube", mark: <YouTubeMark /> },
  { name: "Meta", mark: <MetaMark /> },
  { name: "Instagram", mark: <InstagramMark /> },
];

export function CtaSection() {
  return (
    <section className="bg-[#EEEEEE] px-5 py-16 text-[#111111] min-[768px]:px-10">
      <div className="tl-page relative min-h-[560px] overflow-hidden rounded-[48px] min-[900px]:min-h-[640px] min-[900px]:rounded-[64px]">
        <CtaStage />
        <div className="relative flex min-h-[560px] flex-col items-center justify-center px-6 text-center min-[900px]:min-h-[640px]">
          <h2 className="max-w-[720px] text-[36px] leading-[1.14] tracking-[-0.02em] min-[768px]:text-[48px] min-[768px]:leading-[54.72px] min-[768px]:tracking-[-0.96px]">
            Ready to see what your archive actually knows?
          </h2>
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px] text-[#111111]/70">
            Try it out in Playground, or talk to our Sales team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SiteButton href="https://playground.twelvelabs.io" variant="primary" theme="dark">
              Start Building
            </SiteButton>
            <SiteButton href="https://www.twelvelabs.io/contact" theme="light">
              Talk to Sales
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaStage() {
  return (
    <div className="tl-cta-stage pointer-events-none absolute inset-0" aria-hidden>
      <div className="tl-cta-mesh" />
      <video
        className="tl-cta-film tl-cta-film-wave"
        src={`${ASSET}/videos/funnel-wave.mp4`}
        muted
        loop
        playsInline
        autoPlay
      />
      <video
        className="tl-cta-film tl-cta-film-dust"
        src={`${ASSET}/videos/funnel-particles.mp4`}
        muted
        loop
        playsInline
        autoPlay
      />
      <div className="tl-cta-mist" />
      <div className="tl-cta-grain" />
      <svg className="tl-cta-rings" viewBox="0 0 100 62" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="50" cy="31" rx="40" ry="24" />
        <ellipse cx="50" cy="31" rx="30" ry="17" />
      </svg>
      <div className="tl-cta-orbit">
        {PLATFORMS.map((p, i) => (
          <div key={p.name} className="tl-cta-slot" style={{ "--i": i } as CSSProperties}>
            <div className="tl-cta-chip">
              {p.mark}
              <span>{p.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoogleAdsMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path fill="#FBBC04" d="M7.4 20.2 16.2 3.8a2.4 2.4 0 0 1 4.2 2.3L11.6 22.5a2.4 2.4 0 1 1-4.2-2.3Z" />
      <path fill="#4285F4" d="M12.6 20.2 3.8 3.8A2.4 2.4 0 0 1 8 1.5l8.8 16.4a2.4 2.4 0 1 1-4.2 2.3Z" />
      <circle cx="6.2" cy="19.4" r="2.6" fill="#34A853" />
    </svg>
  );
}

function YouTubeMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <rect width="22" height="16" x="1" y="4" rx="4" fill="#FF0033" />
      <path fill="#fff" d="M10 9.2v5.6l5.2-2.8Z" />
    </svg>
  );
}

function MetaMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        fill="#0081FB"
        d="M12.8 8.6c.8-1.6 2-2.6 3.5-2.6 2.4 0 3.9 2.6 3.9 6.7 0 4.6-1.8 7.3-4.2 7.3-1.3 0-2.4-1-3.4-2.8l-.7-1.2-.8 1.3c-1.1 1.8-2.2 2.7-3.6 2.7-2.3 0-4.1-2.7-4.1-7.3 0-4.2 1.6-6.7 4-6.7 1.5 0 2.7 1 3.5 2.6l.9 1.6.8-1.6Zm-2.2 1.5C9.8 8.6 9 7.8 8 7.8c-1.4 0-2.3 1.8-2.3 5.1 0 3.2.8 5 2.2 5 1 0 1.8-.8 2.7-2.3l1.2-2-1.2-2.5Zm5.5 5.3c.9 1.5 1.7 2.3 2.6 2.3 1.4 0 2.3-1.8 2.3-5 0-3.3-.9-5.1-2.3-5.1-1 0-1.8.8-2.6 2.3l-1.1 2 1.1 3.5Z"
      />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <rect width="22" height="22" x="1" y="1" rx="6" fill="url(#tl-ig)" />
      <rect width="14" height="14" x="5" y="5" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.6" cy="7.4" r="1" fill="#fff" />
      <defs>
        <linearGradient id="tl-ig" x1="4" y1="20" x2="20" y2="4">
          <stop stopColor="#F58529" />
          <stop offset=".45" stopColor="#DD2A7B" />
          <stop offset="1" stopColor="#8134AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
