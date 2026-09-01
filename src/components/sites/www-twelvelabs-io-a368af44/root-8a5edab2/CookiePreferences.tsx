"use client";

import { useEffect, useId, useState } from "react";
import { CookieIcon } from "./FooterBrandMark";

const GROUPS = [
  {
    id: "essential",
    title: "Essential",
    locked: true,
    body: "Required for the site to work. These cannot be switched off.",
  },
  {
    id: "ads",
    title: "Targeted Advertising",
    locked: false,
    body: "Used to show ads that are more relevant to you across this site and partners.",
  },
  {
    id: "personalisation",
    title: "Personalisation",
    locked: false,
    body: "Remembers choices you make so the product can feel like yours.",
  },
  {
    id: "analytics",
    title: "Analytics",
    locked: false,
    body: "Helps us understand how the site is used so we can improve it.",
  },
] as const;

export function CookiePreferences() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState({ essential: true, ads: true, personalisation: true, analytics: true });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Cookie settings"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        className="tl-foot-cookie"
        onClick={() => setOpen(true)}
      >
        <CookieIcon className="size-6" />
      </button>

      {open ? (
        <div className="tl-cookie-root">
          <button type="button" className="tl-cookie-scrim" aria-label="Close cookie settings" onClick={() => setOpen(false)} />
          <aside className="tl-cookie-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="tl-cookie-head">
              <h2 id={titleId}>Storage Preferences</h2>
              <button type="button" className="tl-cookie-x" aria-label="Close" onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="tl-cookie-lead">
              We use cookies to run the site, remember your choices, and measure what works. See the{" "}
              <a href="#">Privacy Policy</a> for the full list.
            </p>
            {GROUPS.map((g) => (
              <section key={g.id} className="tl-cookie-row">
                <div className="tl-cookie-row-top">
                  <h3>{g.title}</h3>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on[g.id]}
                    aria-disabled={g.locked || undefined}
                    disabled={g.locked}
                    className={`tl-cookie-switch${on[g.id] ? " is-on" : ""}`}
                    onClick={() => {
                      if (g.locked) return;
                      setOn((s) => ({ ...s, [g.id]: !s[g.id] }));
                    }}
                  >
                    <span />
                  </button>
                </div>
                <p>{g.body}</p>
                <a href="#">View Disclosures</a>
              </section>
            ))}
          </aside>
        </div>
      ) : null}
    </>
  );
}
