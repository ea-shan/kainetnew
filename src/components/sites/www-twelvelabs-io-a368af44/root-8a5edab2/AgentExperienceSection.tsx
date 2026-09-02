"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { ChevronDownIcon, SparkleIcon } from "../shared/icons";
import { ASSET } from "./content";

const PROMPT = "Build a kitchen renovation campaign for Manchester.";
const REPLY =
  "Two ads are in your accounts, paused. Search covers quote intent; Meta covers homeowners already looking. Review, edit, then launch.";

const ADS = [
  {
    src: `${ASSET}/images/ai-orchestration.jpg`,
    platform: "Google Search",
    headline: "Kitchen renovation quotes, Manchester",
    desc: "Units, labour, and a start date — built paused in your account.",
    cta: "Get a quote",
  },
  {
    src: `${ASSET}/images/cta-hub-operator.jpg`,
    platform: "Meta Ads",
    headline: "Your kitchen, planned before you call",
    desc: "Home improvers 8km out. One continuous take. No studio light.",
    cta: "See the plan",
  },
] as const;

export function AgentExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // ponytail: useTransform snaps opacity at progress === 1; finish the CTA frame before the pin ends.
  const progress = useTransform(scrollYProgress, [0, 0.82], [0, 0.99], { clamp: true });

  const heroOpacity = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.14], [0, -80]);

  const chatY = useTransform(progress, [0, 0.06, 0.14, 0.48, 0.56], [260, 80, 0, 0, -40]);
  const chatScale = useTransform(progress, [0, 0.1, 0.48, 0.56], [0.94, 1, 1, 0.96]);
  const chatOpacity = useTransform(progress, [0, 0.04, 0.48, 0.56], [0.25, 1, 1, 0]);

  const backgroundOpacity = useTransform(progress, [0.18, 0.3, 0.48, 0.58], [0, 0.42, 0.42, 0.05]);
  const backgroundY = useTransform(progress, [0.18, 0.5], [28, -20]);

  const codeY = useTransform(progress, [0.5, 0.58], [72, 0]);
  const codeOpacity = useTransform(progress, [0.5, 0.58], [0, 1]);
  const codeScale = useTransform(progress, [0.5, 0.58], [0.96, 1]);

  const apiHeadingY = useTransform(progress, [0.52, 0.6], [48, 0]);
  const apiHeadingOpacity = useTransform(progress, [0.52, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={`tl-agent${reduce ? " is-static" : ""}`}
      aria-labelledby="tl-agent-title"
    >
      <div className="tl-agent-pin">
        <div className="tl-agent-dots" aria-hidden />

        <motion.div
          className="tl-agent-ghost"
          style={reduce ? undefined : { opacity: backgroundOpacity, y: backgroundY }}
          aria-hidden
        >
          <AnalyticsBackground />
        </motion.div>

        <motion.div
          className="tl-agent-hero"
          style={reduce ? undefined : { opacity: heroOpacity, y: heroY, x: "-50%" }}
        >
          <p className="tl-agent-pill">Integration</p>
          <h2 id="tl-agent-title" className="tl-agent-h">
          Connect your accounts. Keep everything else.
          </h2>
          <p className="tl-agent-sub">
          You've had the renewal call where you realise leaving means rebuilding everything from scratch. That can't happen here.</p>
          <p>kAInet connects to your own Google and Meta accounts and builds directly in them. Your campaigns, keywords, and creative sit where they always did, under your login. Cancel tomorrow and they're still there, still running, still yours.</p>

          <p>Nothing to migrate. Nothing to export. Nothing anyone can hold over you at renewal.
          </p>
          <p className="tl-agent-url">Paused in your own ad accounts</p>
        </motion.div>

        <motion.div
          className="tl-agent-fg"
          style={reduce ? undefined : { y: chatY, scale: chatScale, opacity: chatOpacity, x: "-50%" }}
        >
          <ChatCard progress={progress} reduce={!!reduce} />
        </motion.div>

        {reduce ? null : (
          <>
            <motion.div className="tl-agent-fg tl-agent-code-fg" style={{ y: codeY, opacity: codeOpacity, scale: codeScale, x: "-50%" }}>
              <CodeCard />
            </motion.div>

            <motion.div className="tl-agent-api" style={{ y: apiHeadingY, opacity: apiHeadingOpacity, x: "-50%" }}>
              <p className="tl-agent-pill">API &amp; SDK</p>
              <h2 className="tl-agent-h">
                Bring kAlnet into
                <br />
                your own product.
              </h2>
              <div className="tl-agent-actions">
                <a className="tl-agent-btn tl-agent-btn-solid" href="#">
                  Get an API key
                  <ArrowOut />
                </a>
                <a className="tl-agent-btn" href="#">
                  SDK Reference
                  <ArrowOut />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function ChatCard({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const typeW = useTransform(progress, [0.05, 0.13], ["0%", "100%"]);
  const draftO = useTransform(progress, [0.05, 0.07, 0.14, 0.17], [0, 1, 1, 0]);
  const phO = useTransform(progress, [0.05, 0.07, 0.16, 0.19], [1, 0, 0, 1]);
  const sendScale = useTransform(progress, [0.135, 0.155, 0.18], [1, 1.16, 1]);
  const askO = useTransform(progress, [0.15, 0.19], [0, 1]);
  const askY = useTransform(progress, [0.15, 0.19], [10, 0]);
  const askMax = useTransform(progress, [0.15, 0.19], [0, 88]);
  const thinkO = useTransform(progress, [0.18, 0.22, 0.26], [0, 1, 0]);
  const sayO = useTransform(progress, [0.24, 0.3], [0, 1]);
  const sayClip = useTransform(progress, [0.24, 0.34], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
  const sayMax = useTransform(progress, [0.24, 0.3], [0, 120]);
  const adsO = useTransform(progress, [0.32, 0.4], [0, 1]);
  const adsY = useTransform(progress, [0.32, 0.4], [14, 0]);
  const adsMax = useTransform(progress, [0.32, 0.4], [0, 260]);
  const toolsO = useTransform(progress, [0.38, 0.44], [0, 1]);

  return (
    <article className="tl-agent-card">
      <header className="tl-agent-card-bar">
        <p>
          kAlnet
          <ChevronDownIcon className="size-3.5" />
        </p>
        <span>Share</span>
      </header>
      <div className="tl-agent-thread">
        <motion.p
          className="tl-agent-ask"
          style={reduce ? undefined : { opacity: askO, y: askY, maxHeight: askMax, overflow: "hidden" }}
        >
          {PROMPT}
        </motion.p>
        <motion.span className="tl-agent-think" style={reduce ? { opacity: 0 } : { opacity: thinkO }} aria-hidden>
          <ThinkGlyph />
        </motion.span>
        <motion.p
          className="tl-agent-say"
          style={reduce ? undefined : { opacity: sayO, clipPath: sayClip, maxHeight: sayMax }}
        >
          {REPLY}
        </motion.p>
        <motion.div className="tl-agent-ads" style={reduce ? undefined : { opacity: adsO, y: adsY, maxHeight: adsMax, overflow: "hidden" }}>
          {ADS.map((ad) => (
            <figure key={ad.headline} className="tl-agent-ad">
              <img src={ad.src} alt="" />
              <figcaption>
                <em>{ad.platform}</em>
                <strong>{ad.headline}</strong>
                <span>{ad.desc}</span>
                <b>{ad.cta}</b>
              </figcaption>
            </figure>
          ))}
        </motion.div>
        <motion.div className="tl-agent-tools" aria-hidden style={reduce ? undefined : { opacity: toolsO }}>
          <HeartIcon />
          <ShareGlyph />
          <CopyGlyph />
          <RefreshGlyph />
        </motion.div>
        <motion.span className="tl-agent-sparkle" aria-hidden style={reduce ? undefined : { opacity: toolsO }}>
          <SparkleIcon />
        </motion.span>
      </div>
      <div className="tl-agent-reply">
        <span>+</span>
        <p>
          <motion.span style={reduce ? { opacity: 1 } : { opacity: phO }}>Reply to kAlnet</motion.span>
          {reduce ? null : (
            <motion.span className="tl-agent-type" style={{ width: typeW, opacity: draftO }}>
              {PROMPT}
            </motion.span>
          )}
        </p>
        <em>Research 1.0</em>
        <motion.button type="button" aria-label="Send" style={reduce ? undefined : { scale: sendScale }}>
          ↑
        </motion.button>
      </div>
    </article>
  );
}

function CodeCard() {
  return (
    <article className="tl-agent-card tl-agent-code">
      <header className="tl-agent-card-bar">
        <p>
          <SparkleIcon className="size-3.5" />
          kAlnet
        </p>
        <span>Copy</span>
      </header>
      <pre className="tl-agent-pre">
        <span className="c-p">from</span> kainet <span className="c-p">import</span> Client{"\n\n"}
        client = Client(key=<span className="c-y">&quot;kn_live_…&quot;</span>){"\n"}
        brief = client.briefs.create({"\n"}
        {"  "}query=<span className="c-y">&quot;kitchen renovation, Manchester&quot;</span>,{"\n"}
        {"  "}accounts=[<span className="c-y">&quot;google&quot;</span>, <span className="c-y">&quot;meta&quot;</span>],{"\n"}
        {"  "}paused=<span className="c-l">True</span>,{"\n"}
        ){"\n"}
        print(brief.segments)
      </pre>
    </article>
  );
}

function AnalyticsBackground() {
  return (
    <div className="tl-agent-ghost-grid">
      <aside>
        <p className="tl-agent-kicker">Structure</p>
        <ul>
          <li>
            Opening 0–3s
            <br />
            Brief lands in the accounts.
          </li>
          <li>
            Product moment 3–15s
            <br />
            Search demand and bids.
          </li>
          <li>
            CTA 15–30s
            <br />
            Two ads, still paused.
          </li>
        </ul>
        <div className="tl-agent-ghost-card">
          <strong>Campaign_kitchen_v3</strong>
          <span>2 ads · paused · Manchester</span>
        </div>
        <p className="tl-agent-kicker">Connected</p>
        <p className="tl-agent-ok">
          <i />
          Google Ads · live
        </p>
        <p className="tl-agent-ok">
          <i />
          Meta Ads · live
        </p>
      </aside>
      <aside>
        <p className="tl-agent-kicker tl-agent-live">Analyzing with kAlnet</p>
        <ul>
          <li>Reading across your accounts</li>
          <li>Summarizing demand</li>
          <li className="tl-agent-ok">Ads ready, paused</li>
        </ul>
        <div className="tl-agent-ghost-card">
          <p className="tl-agent-kicker">Next campaign ad</p>
          <strong>Kitchen renovation · quote intent</strong>
          <span>Objective · Search + Meta · Paused</span>
        </div>
        <div className="tl-agent-thumbs">
          {ADS.map((ad) => (
            <img key={ad.headline} src={ad.src} alt="" />
          ))}
        </div>
      </aside>
      <div className="tl-agent-plot">
        <p>
          <span>Emotional sentiment across the brief</span>
          <span>Timeline</span>
        </p>
        <svg viewBox="0 0 800 50" preserveAspectRatio="none" aria-hidden>
          <path d="M0 28 C80 10 120 35 180 24 C250 10 290 42 360 25 C430 8 500 36 560 22 C630 8 690 36 800 20" />
        </svg>
      </div>
    </div>
  );
}

function ArrowOut() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
      <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ThinkGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1.4v2.2M8 12.4v2.2M1.4 8h2.2M12.4 8h2.2M3.2 3.2l1.6 1.6M11.2 11.2l1.6 1.6M3.2 12.8l1.6-1.6M11.2 4.8l1.6-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M8 13.2s-5.2-3.2-5.2-6.2A2.7 2.7 0 0 1 8 5.2a2.7 2.7 0 0 1 5.2 1.8c0 3-5.2 6.2-5.2 6.2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ShareGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M4 8h8M9 5l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <rect x="5" y="5" width="7" height="8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 11V4.8A1.2 1.2 0 0 1 5.2 3.6H11" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M13 8a5 5 0 1 1-1.4-3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13 3.2V6H10.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
