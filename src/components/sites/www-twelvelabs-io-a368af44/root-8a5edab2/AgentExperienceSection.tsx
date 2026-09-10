"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { SiteButton } from "../shared/SiteButton";
import {
  CheckIcon,
  ChevronDownIcon,
  GlobeIcon,
  IconsaxOutline,
  LockIcon,
  PauseCircleIcon,
  SparkleIcon,
} from "../shared/icons";
import { ASSET, SHARED } from "./content";

const CHIPS = [
  "Launch a Performance Max campaign for a DTC coffee brand, $5K/month, target busy parents in the US.",
  "Run a Google Search campaign for our B2B SaaS at $12K/mo — help me plan paid acquisition for Q2.",
  "Set up a Demand Gen test for our new eco-friendly footwear line across US, CA, UK.",
] as const;

const PROMPT = CHIPS[0];
const REPLY =
  "Two ads are in your accounts, paused. Performance Max covers busy parents across the US. Review, edit, then launch.";

const DETAILS = [
  ["url", "URL"],
  ["budget", "Budget"],
  ["geo", "Geography"],
  ["links", "Sitelinks"],
  ["neg", "Negative Keywords"],
  ["image", "Image"],
] as const;

const ADS = [
  {
    src: `${ASSET}/images/ai-orchestration.jpg`,
    title: "Busy parents, better coffee",
    meta: "Performance Max · US",
  },
  {
    src: `${ASSET}/images/cta-hub-operator.jpg`,
    title: "Paid acquisition for Q2",
    meta: "Google Search · B2B SaaS",
  },
  {
    src: `${ASSET}/images/workflow-a.png`,
    title: "Eco footwear, three markets",
    meta: "Demand Gen · US · CA · UK",
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

  // Beat 3 — ownership copy arrives as one block and settles together.
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
          <p className="inline-flex max-w-full items-center justify-center gap-2 text-[12px] uppercase tracking-[0.14em]">
            <span className="font-mono text-[13px] leading-none text-[var(--kai-purple)]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">Multi-Agent Workflow Automation</span>
          </p>
          <h2 id="tl-agent-title" className="tl-agent-h">
          Connect your accounts. Keep  —{" "}
            <span className="tl-hero-grad">everything else.</span>
          </h2>
          <p className="tl-agent-sub">
          You've had the renewal call where you realise leaving means rebuilding everything from scratch. That can't happen here.
          </p>
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
          <HitlCard progress={progress} reduce={reduce} />
          {/* <h2 className="tl-agent-h">Keep everything else.</h2> */}
          <p className="tl-agent-final-lede">
            kAInet connects to your own Google and Meta accounts and builds directly in them. Your
            campaigns, keywords, and creative sit where they always did, under your login. Cancel
            tomorrow and they&apos;re still there, still running, still yours.
          </p>
          <ul className="tl-agent-points">
            <li>
              <span aria-hidden>
                <GlobeIcon className="size-3.5" />
              </span>
              Nothing to migrate.
            </li>
            <li>
              <span aria-hidden>
                <CheckIcon className="size-3.5" />
              </span>
              Nothing to export.
            </li>
            <li>
              <span aria-hidden>
                <LockIcon className="size-3.5" />
              </span>
              Nothing anyone can hold over you at renewal.
            </li>
          </ul>
          <div className="tl-agent-actions">
            <SiteButton href="#" variant="primary" size="s" theme="light">
            Integrate your ad accounts now!
            </SiteButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChatCard({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean | null }) {
  const [picked, setPicked] = useState(0);
  const [brief, setBrief] = useState(() => progress.get() < 0.36);
  const prompt = CHIPS[picked];

  // The card is parked between 0.20 and 0.58, so the whole exchange plays inside that window.
  const askOpacity = useTransform(progress, [0.17, 0.22], [0, 1]);
  const askScale = useTransform(progress, [0.17, 0.22], [0.96, 1]);
  const thinkOpacity = useTransform(progress, [0.29, 0.32, 0.35, 0.37], [0, 1, 1, 0]);
  useMotionValueEvent(progress, "change", (v) => {
    setBrief(Boolean(reduce) || v < 0.36);
  });

  const toolsOpacity = useTransform(progress, [0.5, 0.53], [0, 1]);
  const toolsY = useTransform(progress, [0.5, 0.53], [8, 0]);

  const asked = useTyped(progress, PROMPT, 0.22, 0.29, reduce);
  const said = useTyped(progress, REPLY, 0.48, 0.56, reduce);
  const shown = picked === 0 ? asked : prompt;
  const rest = picked === 0 ? PROMPT.slice(asked.length) : "";

  return (
    <article className="tl-agent-card">
      <header className="tl-agent-card-bar">
        <p>
          kAInet
          <ChevronDownIcon className="size-3.5" />
        </p>
        <span>Share</span>
      </header>

      {brief ? (
        <motion.ul
          className="tl-agent-chips"
          style={reduce ? undefined : { opacity: askOpacity, scale: askScale }}
        >
          {CHIPS.map((chip, i) => (
            <li key={chip}>
              <button
                type="button"
                className={i === picked ? "is-on" : undefined}
                aria-pressed={i === picked}
                onClick={() => setPicked(i)}
              >
                {chip}
              </button>
            </li>
          ))}
        </motion.ul>
      ) : null}

      <motion.div className="tl-agent-reply" style={reduce ? undefined : { opacity: askOpacity }}>
        <div className="tl-agent-reply-row">
          <p>
            {shown}
            <span className="tl-agent-untyped">{rest}</span>
          </p>
          <button type="button" aria-label="Send">
            <ArrowUpGlyph />
          </button>
        </div>
        {brief ? (
          <>
            <p>Add supporting details (optional):</p>
            <ul className="tl-agent-details">
              {DETAILS.map(([id, label]) => (
                <li key={id}>
                  <DetailGlyph name={id} />
                  {label}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </motion.div>

      {!brief || reduce ? (
        <>
          <div className="tl-agent-rail">
            <ul>
              {ADS.map((ad, i) => (
                <RailItem key={ad.title} ad={ad} start={0.38 + i * 0.02} reduce={reduce} progress={progress} />
              ))}
            </ul>
            <button type="button" aria-label="Next ad">
              <ChevronRight />
            </button>
          </div>

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
        </>
      ) : null}
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

const HITL_NAV = [
  ["campaign", "Campaign", "category"],
  ["creative", "Ad Creative", "gallery"],
  ["groups", "Ad Groups", "hierarchy"],
  ["assets", "Assets", "export"],
] as const;

const HITL_PHASES = [
  "Audience Research",
  "Campaign Strategy",
  "Creative Assets",
  "Campaign Execution",
  "Final Synthesis",
] as const;

const HITL_HEADLINES = [
  "Launch Ads in 15 Mins",
  "Manage Google & Meta Ads",
  "Cut Setup Time, Boost ROI",
  "AI-Driven, Human-Approved",
  "Scale with Data Insights",
] as const;

const HITL_DESCS = [
  "kAInet creates campaigns fast with AI automation. Start your free trial today and grow.",
  "kAInet offers a unified platform for Google and Meta ads. See how it works and succeed.",
  "kAInet helps reduce manual setup and launch quicker. Try it now for efficient ads.",
  "kAInet provides reliable AI workflows approved by experts. Boost your campaign ROI today.",
  "kAInet efficiently scales with data-driven insights. Start your free trial and excel now.",
] as const;

type HitlPane = "report" | (typeof HITL_NAV)[number][0];

function paneAt(v: number): HitlPane {
  // ponytail: final fade starts at 0.63 — hold report until the card is readable.
  if (v < 0.78) return "report";
  if (v < 0.81) return "campaign";
  if (v < 0.84) return "creative";
  if (v < 0.87) return "groups";
  return "assets";
}

function HitlCard({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean | null }) {
  const [pane, setPane] = useState<HitlPane>(() => (reduce ? "campaign" : paneAt(progress.get())));

  useMotionValueEvent(progress, "change", (v) => {
    setPane(reduce ? "campaign" : paneAt(v));
  });

  return (
    <article className="tl-agent-card tl-agent-code tl-agent-hitl" aria-label="Campaign execution approval">
      <header className="tl-agent-card-bar">
        <p>
          <SparkleIcon className="size-3.5" />
          kAInet
        </p>
        <span>Approval</span>
      </header>

      <div className="tl-agent-hitl-frame">
      <header className="tl-agent-hitl-bar">
        {pane === "report" ? (
          <p>
            <CheckIcon className="size-3.5" />
            <strong>Workflow Complete!</strong>
            <span>Your AI workflow has finished running.</span>
          </p>
        ) : (
          <p>
            <strong>Campaign Execution Approval Required</strong>
          </p>
        )}
        {pane === "report" ? (
          <button type="button" className="is-go" onClick={() => setPane("campaign")}>
            + Create AI Workflow
          </button>
        ) : (
          <div className="tl-agent-hitl-acts">
            <button type="button" className="is-mod">
              Modify
            </button>
            <button type="button">Rerun</button>
            <button type="button" className="is-go">
              Approve
            </button>
          </div>
        )}
      </header>

      {pane === "report" ? (
        <div className="tl-agent-hitl-report">
          <p className="tl-agent-hitl-brief">
            <IconsaxOutline name="category" className="size-3" />
            Campaign Brief
            <ChevronDownIcon className="size-3" />
          </p>
          <ol>
            {HITL_PHASES.map((phase, i) => (
              <li key={phase} className={i === HITL_PHASES.length - 1 ? "is-on" : undefined}>
                <CheckIcon className="size-3" />
                {phase}
              </li>
            ))}
          </ol>
          <div className="tl-agent-hitl-synth">
            <p>
              <SparkleIcon className="size-3" />
              Final Synthesis
              <em>Completed</em>
            </p>
            <span>Completed 4 of 4 phases with 0 errors</span>
            <b>Key insights</b>
            <ul>
              <li>Google Ads campaign successfully created and configured</li>
            </ul>
          </div>
          <div className="tl-agent-hitl-foot">
            <button type="button" onClick={() => setPane("campaign")}>
              View Campaign Approval
            </button>
            <button type="button">+ Create AI Workflow</button>
          </div>
        </div>
      ) : (
        <div className="tl-agent-hitl-body">
          <nav className="tl-agent-hitl-nav" aria-label="Approval sections">
            <p>
              <em>Google Ads</em>
              <em>Google Ads</em>
            </p>
            {HITL_NAV.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                className={pane === id ? "is-on" : undefined}
                aria-pressed={pane === id}
                onClick={() => setPane(id)}
              >
                <IconsaxOutline name={icon} className="size-3.5" />
                {label}
              </button>
            ))}
          </nav>
          <div className="tl-agent-hitl-pane">
            {pane === "campaign" ? <HitlCampaign /> : null}
            {pane === "creative" ? <HitlCreative /> : null}
            {pane === "groups" ? <HitlGroups /> : null}
            {pane === "assets" ? <HitlAssets /> : null}
          </div>
        </div>
      )}
      </div>
    </article>
  );
}

function HitlCampaign() {
  const [tab, setTab] = useState<"overview" | "budget" | "targeting">("overview");

  return (
    <>
      <p className="tl-agent-hitl-kicker">
        <IconsaxOutline name="category" className="size-3" />
        Campaign
      </p>
      <p className="tl-agent-hitl-tabs">
        {(
          [
            ["overview", "Overview"],
            ["budget", "Budget & Bidding"],
            ["targeting", "Targeting"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "is-on" : undefined}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </p>
      {tab === "overview" ? (
        <dl className="tl-agent-hitl-grid">
          <div>
            <dt>Campaign Type</dt>
            <dd>SEARCH</dd>
          </div>
          <div>
            <dt>Campaign Name</dt>
            <dd>kAInet Lead Generation Display Campaign — US 20260909-112753</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <i>
                <PauseCircleIcon className="size-3" />
                PAUSED
              </i>
            </dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>kAInet</dd>
          </div>
        </dl>
      ) : null}
      {tab === "budget" ? (
        <dl className="tl-agent-hitl-grid">
          <div>
            <dt>Budget</dt>
            <dd className="is-sum">$20.00</dd>
          </div>
          <div>
            <dt>Bidding Strategy</dt>
            <dd className="is-code">MAXIMIZE_CONVERSIONS</dd>
          </div>
        </dl>
      ) : null}
      {tab === "targeting" ? (
        <dl className="tl-agent-hitl-grid">
          <div>
            <dt>Location</dt>
            <dd>United States</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>Search</dd>
          </div>
        </dl>
      ) : null}
    </>
  );
}

function HitlCreative() {
  return (
    <>
      <p className="tl-agent-hitl-kicker">
        <IconsaxOutline name="gallery" className="size-3" />
        Ad Creative
        <span>Ad Group 1 of 1</span>
      </p>
      <p className="tl-agent-hitl-sub">
        Creative for kAInet Lead Generation Display Campaign — US Ad Group
      </p>
      <div className="tl-agent-hitl-cols">
        <section>
          <p>Headlines ({HITL_HEADLINES.length})</p>
          <ol>
            {HITL_HEADLINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
        <section>
          <p>Descriptions ({HITL_DESCS.length})</p>
          <ol>
            {HITL_DESCS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

function HitlGroups() {
  return (
    <>
      <p className="tl-agent-hitl-kicker">
        <IconsaxOutline name="hierarchy" className="size-3" />
        Ad Groups
        <span>1 ad group</span>
      </p>
      <p className="tl-agent-hitl-pill">kAInet Lead Generation Display Campaign — US Ad Group</p>
      <div className="tl-agent-hitl-empty">
        <b>Keywords (0)</b>
        <span>No keywords</span>
      </div>
    </>
  );
}

function HitlAssets() {
  return (
    <>
      <p className="tl-agent-hitl-kicker">
        <IconsaxOutline name="export" className="size-3" />
        Assets
        <span>Google Ads assets</span>
      </p>
      <p className="tl-agent-hitl-shot-label">Square Logo Image (1)</p>
      <img className="tl-agent-hitl-logo" src={`${SHARED}/kainet-mark.png`} alt="" />
      <p className="tl-agent-hitl-shot-label">Square Marketing Image ({ADS.length})</p>
      <ul className="tl-agent-hitl-shots">
        {ADS.map((ad) => (
          <li key={ad.title}>
            <img src={ad.src} alt="" />
          </li>
        ))}
      </ul>
    </>
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

function DetailGlyph({ name }: { name: (typeof DETAILS)[number][0] }) {
  if (name === "url") return <GlobeIcon className="size-3" />;
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      {name === "budget" ? <path d="M8 2.2v11.6M10.6 5.1c0-1.2-1.1-2-2.6-2S5.4 4 5.4 5.2c0 2.8 5.2 1.4 5.2 4.4 0 1.3-1.2 2.2-2.6 2.2S5.4 10.8 5.4 9.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> : null}
      {name === "geo" ? <path d="M8 14s4-4.1 4-7A4 4 0 1 0 4 7c0 2.9 4 7 4 7z" fill="none" stroke="currentColor" strokeWidth="1.3" /> : null}
      {name === "links" ? <path d="M6 3.2v9.6M10 3.2v9.6M3.4 6.2h9.2M3.4 9.8h9.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> : null}
      {name === "neg" ? <path d="M3.4 4.4h9.2M3.4 8h9.2M3.4 11.6h6.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> : null}
      {name === "image" ? <><rect x="2.6" y="3.6" width="10.8" height="8.8" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M3.4 11.2l2.6-2.6 2 2 2.2-2.8 2.4 3.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></> : null}
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
