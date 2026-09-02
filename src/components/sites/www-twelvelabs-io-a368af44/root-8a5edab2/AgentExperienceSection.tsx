"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDownIcon, SparkleIcon } from "../shared/icons";
import { ASSET } from "./content";

const PROMPT = "Build a kitchen renovation campaign for Manchester.";
const REPLY =
  "Two ads are in your accounts, paused. Search covers quote intent, Meta covers homeowners already looking. Review, edit, then launch.";

const ADS = [
  {
    src: `${ASSET}/images/ai-orchestration.jpg`,
    title: "Kitchen renovation quotes",
    meta: "Google Search · Manchester",
  },
  {
    src: `${ASSET}/images/cta-hub-operator.jpg`,
    title: "Your kitchen, planned first",
    meta: "Meta Ads · 8km radius",
  },
  {
    src: `${ASSET}/images/workflow-a.png`,
    title: "Fitted in three weeks",
    meta: "Performance Max · retarget",
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
  const progress = useTransform(scrollYProgress, [0, 0.88], [0, 0.99], { clamp: true });

  // Beat 1 — the hero holds, then lifts away as the chat card climbs into frame.
  const heroOpacity = useTransform(progress, [0, 0.1, 0.19], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.19], [0, -110]);

  // Beat 2 — the card rides up from the fold, parks centre stage, then drops out.
  const chatY = useTransform(progress, [0, 0.2, 0.58, 0.65], [320, 0, 0, -60]);
  const chatScale = useTransform(progress, [0, 0.2, 0.58, 0.65], [0.97, 1, 1, 0.96]);
  const chatOpacity = useTransform(progress, [0.58, 0.65], [1, 0]);

  // The workspace behind it only surfaces once the card has settled.
  const ghostOpacity = useTransform(progress, [0.22, 0.42, 0.56, 0.63], [0, 0.62, 0.62, 0]);
  const ghostY = useTransform(progress, [0.22, 0.6], [26, -18]);

  // Beat 3 — code card and the API copy arrive as one block and settle together.
  const finalOpacity = useTransform(progress, [0.63, 0.86], [0, 1]);
  const finalY = useTransform(progress, [0.63, 0.92], [56, 0]);
  const finalScale = useTransform(progress, [0.63, 0.86], [0.97, 1]);

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
          style={reduce ? undefined : { opacity: ghostOpacity, y: ghostY }}
          aria-hidden
        >
          <WorkspaceBackground />
        </motion.div>

        <motion.div
          className="tl-agent-hero"
          style={reduce ? undefined : { opacity: heroOpacity, y: heroY, x: "-50%" }}
        >
          <p className="tl-agent-pill">Integration</p>
          <h2 id="tl-agent-title" className="tl-agent-h">
            Connect your accounts.
            <br />
            Keep everything else.
          </h2>
          <p className="tl-agent-sub">
            kAInet builds inside your own Google and Meta accounts. Campaigns, keywords and creative stay
            under your login. Cancel tomorrow and they are still there, still yours.
          </p>
          <p className="tl-agent-url">Paused in your own ad accounts</p>
        </motion.div>

        <motion.div
          className="tl-agent-fg"
          style={reduce ? undefined : { y: chatY, scale: chatScale, opacity: chatOpacity, x: "-50%" }}
        >
          <ChatCard progress={progress} reduce={reduce} />
        </motion.div>

        <motion.div
          className="tl-agent-final"
          style={reduce ? undefined : { y: finalY, scale: finalScale, opacity: finalOpacity, x: "-50%" }}
        >
          <CodeCard />
          <p className="tl-agent-pill">API &amp; SDK</p>
          <h2 className="tl-agent-h">
            Bring kAInet into
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
      </div>
    </section>
  );
}

function ChatCard({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean | null }) {
  // The card is parked between 0.20 and 0.58, so the whole exchange plays inside that window.
  const askOpacity = useTransform(progress, [0.17, 0.22], [0, 1]);
  const askScale = useTransform(progress, [0.17, 0.22], [0.96, 1]);
  const thinkOpacity = useTransform(progress, [0.29, 0.32, 0.35, 0.37], [0, 1, 1, 0]);

  const toolsOpacity = useTransform(progress, [0.5, 0.53], [0, 1]);
  const toolsY = useTransform(progress, [0.5, 0.53], [8, 0]);

  const composerOpacity = useTransform(progress, [0.52, 0.56], [0, 1]);
  const composerY = useTransform(progress, [0.52, 0.56], [14, 0]);

  const asked = useTyped(progress, PROMPT, 0.22, 0.29, reduce);
  const said = useTyped(progress, REPLY, 0.36, 0.46, reduce);

  return (
    <article className="tl-agent-card">
      <header className="tl-agent-card-bar">
        <p>
          kAInet
          <ChevronDownIcon className="size-3.5" />
        </p>
        <span>Share</span>
      </header>

      <motion.p
        className="tl-agent-ask"
        style={reduce ? undefined : { opacity: askOpacity, scale: askScale }}
      >
        {asked}
        <span className="tl-agent-untyped">{PROMPT.slice(asked.length)}</span>
      </motion.p>

      <div className="tl-agent-stream">
        <motion.span
          className="tl-agent-think"
          style={reduce ? undefined : { opacity: thinkOpacity }}
          aria-hidden
        >
          <i />
          <i />
          <i />
        </motion.span>
        <p className="tl-agent-say">
          {said}
          <span className="tl-agent-untyped">{REPLY.slice(said.length)}</span>
        </p>
      </div>

      <div className="tl-agent-rail">
        <ul>
          {ADS.map((ad, i) => (
            <RailItem key={ad.title} ad={ad} start={0.44 + i * 0.02} reduce={reduce} progress={progress} />
          ))}
        </ul>
        <button type="button" aria-label="Next ad">
          <ChevronRight />
        </button>
      </div>

      <motion.div
        className="tl-agent-tools"
        style={reduce ? undefined : { opacity: toolsOpacity, y: toolsY }}
        aria-hidden
      >
        <ThumbGlyph />
        <ThumbGlyph down />
        <CopyGlyph />
        <RefreshGlyph />
      </motion.div>
      <motion.span
        className="tl-agent-sparkle"
        style={reduce ? undefined : { opacity: toolsOpacity }}
        aria-hidden
      >
        <SparkleIcon />
      </motion.span>

      <motion.div
        className="tl-agent-reply"
        style={reduce ? undefined : { opacity: composerOpacity, y: composerY }}
      >
        <p>Reply to kAInet</p>
        <div>
          <span aria-hidden>+</span>
          <em>Planner 1.0</em>
          <button type="button" aria-label="Send">
            <ArrowUpGlyph />
          </button>
        </div>
      </motion.div>
    </article>
  );
}

/**
 * Reveals `text` character by character across a scroll window. The caller keeps the untyped
 * remainder in the DOM (transparent) so the line box never reflows and the full sentence stays
 * available to screen readers and the server render.
 */
function useTyped(
  progress: MotionValue<number>,
  text: string,
  from: number,
  to: number,
  reduce: boolean | null,
) {
  const count = useTransform(progress, [from, to], [0, text.length], { clamp: true });
  const [typed, setTyped] = useState(0);

  useMotionValueEvent(count, "change", (v) => setTyped(Math.round(v)));

  return reduce ? text : text.slice(0, typed);
}

function RailItem({
  ad,
  start,
  reduce,
  progress,
}: {
  ad: (typeof ADS)[number];
  start: number;
  reduce: boolean | null;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const y = useTransform(progress, [start, start + 0.05], [18, 0]);

  return (
    <motion.li style={reduce ? undefined : { opacity, y }}>
      <img src={ad.src} alt="" />
      <strong>{ad.title}</strong>
      <span>{ad.meta}</span>
    </motion.li>
  );
}

function CodeCard() {
  return (
    <article className="tl-agent-card tl-agent-code">
      <header className="tl-agent-card-bar">
        <p>
          <SparkleIcon className="size-3.5" />
          kAInet
        </p>
        <span>Copy</span>
      </header>
      <pre className="tl-agent-pre">
        <span className="c-p">from</span> kainet <span className="c-p">import</span> Kainet, BriefItem
        {"\n\n"}
        client = Kainet(api_key=<span className="c-y">&quot;&lt;YOUR_API_KEY&gt;&quot;</span>){"\n\n"}
        campaign = client.campaigns.create({"\n"}
        {"    "}model=<span className="c-y">&quot;planner-1.0&quot;</span>,{"\n"}
        {"    "}account_id=<span className="c-y">&quot;&lt;YOUR_ACCOUNT_ID&gt;&quot;</span>,{"\n"}
        {"    "}channels=[<span className="c-y">&quot;google&quot;</span>, <span className="c-y">&quot;meta&quot;</span>],{"\n"}
        {"    "}paused=<span className="c-l">True</span>,{"\n"}
        {"    "}brief=[{"\n"}
        {"        "}BriefItem({"\n"}
        {"            "}type=<span className="c-y">&quot;service&quot;</span>,{"\n"}
        {"            "}region=<span className="c-y">&quot;Manchester&quot;</span>,{"\n"}
        {"            "}content=<span className="c-y">&quot;Kitchen renovation, quote intent.&quot;</span>,{"\n"}
        {"        "}){"\n"}
        {"    "}],{"\n"}
        ){"\n"}
      </pre>
    </article>
  );
}

const STRUCTURE = [
  ["Opening (0–3s)", "Brief lands in the accounts."],
  ["Product moment (3–15s)", "Search demand, bids and audiences."],
  ["CTA (15–30s)", "Two ads, still paused."],
] as const;

const SOURCES = [
  ["Google Ads", "Manchester account"],
  ["Meta Ads", "Business Suite"],
] as const;

const BRIEF = [
  ["Objective", ["Quote requests"]],
  ["Format", ["Single continuous take", "Handheld", "No studio lighting"]],
  ["Length", ["15–30 seconds max"]],
] as const;

const CLIPS = [
  ["0:00 – 0:12", "Fitters on site", "Vibe: unhurried", "Setting: real kitchen"],
  ["0:12 – 0:24", "Plan on the table", "Vibe: measured", "Expression: quietly certain"],
] as const;

function WorkspaceBackground() {
  return (
    <div className="tl-agent-ghost-grid">
      <aside>
        <p className="tl-agent-kicker">Structure</p>
        <ul className="tl-agent-rail-list">
          {STRUCTURE.map(([title, note]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{note}</span>
            </li>
          ))}
        </ul>

        <p className="tl-agent-kicker">Campaign build</p>
        <div className="tl-agent-file">
          <ClipThumb label="0:00 – 0:15" />
          <p>
            <strong>campaign_kitchen_v3.mp4</strong>
            <span>2 ads · paused · Manchester</span>
          </p>
        </div>

        {SOURCES.map(([name, note]) => (
          <div key={name} className="tl-agent-source">
            <i />
            <p>
              <strong>{name}</strong>
              <span>{note}</span>
            </p>
            <em className="tl-agent-ok">Connected</em>
          </div>
        ))}
      </aside>

      <aside>
        <p className="tl-agent-kicker tl-agent-live">Analyzing with kAInet…</p>
        <ul className="tl-agent-steps">
          <li>Reading across your accounts</li>
          <li>Summarizing demand</li>
          <li className="tl-agent-ok">Done</li>
        </ul>

        <div className="tl-agent-thumbs">
          {["0:00 – 0:12", "0:12 – 0:24", "0:24 – 0:31", "0:31 – 0:44"].map((label) => (
            <ClipThumb key={label} label={label} />
          ))}
        </div>

        <p className="tl-agent-kicker">Next campaign ad</p>
        <p className="tl-agent-note">Based on pattern analysis across 3 ads</p>

        <p className="tl-agent-kicker">Brief</p>
        <dl className="tl-agent-brief">
          {BRIEF.map(([term, values]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>
                {values.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <div className="tl-agent-strip">
        {CLIPS.map(([time, name, ...tags]) => (
          <p key={time}>
            <b>{time}</b>
            <strong>{name}</strong>
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        ))}
      </div>

      <div className="tl-agent-plot">
        <p>Spend efficiency across the brief</p>
        <svg viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0 38 C80 18 120 45 180 32 C250 16 290 50 360 33 C430 14 500 46 560 30 C630 14 690 44 800 26" />
        </svg>
        <p className="tl-agent-plot-axis">
          <span>00:00</span>
          <span>01:00</span>
          <span>02:00</span>
          <span>03:00</span>
        </p>
      </div>
    </div>
  );
}

function ClipThumb({ label }: { label: string }) {
  return (
    <span className="tl-agent-clip">
      <svg viewBox="0 0 16 16" aria-hidden>
        <path d="M6 4.5l5 3.5-5 3.5z" fill="currentColor" />
      </svg>
      <b>{label}</b>
    </span>
  );
}

function ArrowOut() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
      <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowUpGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M6.5 3.5L11 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbGlyph({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden style={down ? { transform: "rotate(180deg)" } : undefined}>
      <path
        d="M5.5 13.5V6.8l3-4.3c.9 0 1.5.7 1.4 1.6l-.3 2h2.6c.9 0 1.5.8 1.3 1.6l-1 4.3c-.1.7-.7 1.2-1.4 1.2H5.5zM2.5 6.8h3v6.7h-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <rect x="5" y="5" width="7" height="8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 11V4.8A1.2 1.2 0 0 1 5.2 3.6H11" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M13 8a5 5 0 1 1-1.4-3.4" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M13 3.2V6H10.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
