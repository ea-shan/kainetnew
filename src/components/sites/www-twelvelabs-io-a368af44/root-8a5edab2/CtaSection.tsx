import { SiteButton } from "../shared/SiteButton";

const VIDEO = "/sites/www-twelvelabs-io-a368af44/root-8a5edab2/videos/horse-cta.mp4";
const POSTER = "/sites/www-twelvelabs-io-a368af44/root-8a5edab2/images/cta-still.png";

export function CtaSection() {
  return (
    <section className="bg-white px-5 py-8 text-[var(--kai-white)] min-[768px]:px-10 min-[768px]:py-10">
      <div className="tl-page tl-cta-plate relative flex min-h-[36rem] items-center justify-center overflow-hidden rounded-[40px] px-6 py-14 min-[768px]:rounded-[64px] min-[768px]:px-12 min-[768px]:py-16 min-[1100px]:px-16">
        <video
          className="tl-cta-video"
          src={VIDEO}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="tl-cta-glow" aria-hidden />
        <div className="tl-cta-veil" aria-hidden />
        <div className="tl-cta-copy">
          <p className="tl-cta-kicker inline-flex max-w-full items-center justify-center gap-2 text-[12px] uppercase tracking-[0.14em]">
            <span className="font-mono text-[13px] leading-none text-[var(--kai-lavender)]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">
            Your campaigns, built by AI. Launched by you.
            </span>
          </p>
          <h2 className="text-[32px] leading-[1.12] font-semibold tracking-[-0.03em] min-[768px]:text-[50px] min-[768px]:leading-[1.06] min-[768px]:tracking-[-0.04em]">
            For performance agencies and the in-house teams running <span className="tl-hero-grad"> $1M+ in Google and Meta spend</span>
          </h2>
          <p className="tl-cta-lede">
            Bring your next campaign. See what six agents and one approval get you. It&apos;s built
            paused, so there&apos;s nothing to undo.
          </p>
          <div className="tl-cta-actions">
            <SiteButton href="#" variant="primary" size="s" theme="dark">
              Request Early Access
            </SiteButton>
            <SiteButton href="#" size="s" theme="dark">
              Talk to us first
            </SiteButton>
          </div>
          <p className="tl-cta-note">
            14 days free. No credit card. We set you up within 1–2 business days — your 14 days
            start when you get in, not when you ask.
          </p>
        </div>
      </div>
    </section>
  );
}
