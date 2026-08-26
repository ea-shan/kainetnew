import { comparePanels } from "./content";

function CompareMark({ good }: { good: boolean }) {
  return (
    <span className={`tl-wf-mark${good ? " tl-wf-mark-good" : ""}`} aria-hidden>
      <svg viewBox="0 0 24 24">
        {good ? (
          <path className="tl-wf-stroke" d="M5 12.4l5 5L20 7" />
        ) : (
          <>
            <path className="tl-wf-stroke" d="M6 6l12 12" />
            <path className="tl-wf-stroke tl-wf-stroke-late" d="M18 6L6 18" />
          </>
        )}
      </svg>
    </span>
  );
}

export function WorkflowsSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-20 text-[var(--kai-light-text)] md:px-10 md:pb-20">
      <div className="tl-wf-wash" aria-hidden />
      <div className="tl-page relative">
        <header className="mx-auto max-w-[40rem] text-center">
          <h2 className="text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[1.14] md:tracking-[-0.96px]">
            There are two bad ways to do AI marketing.{" "}
            <span className="tl-wf-grad">We&apos;re not doing either.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px] text-[var(--kai-light-muted)]">
            You&apos;ve probably been burned by one of them. Here&apos;s what we think went wrong, and what we do instead.
          </p>
        </header>

        <div className="relative mt-14 grid grid-cols-1 gap-6 md:mt-16 md:auto-rows-fr md:grid-cols-2 md:gap-x-12 md:gap-y-8">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[var(--kai-purple)]/15 md:block"
          />
          {comparePanels.map((panel) => {
            const good = panel.kind === "good";
            return (
              <article
                key={panel.heading}
                className={`tl-wf-card ${good ? "tl-wf-card-good" : ""} flex h-full items-start gap-5 rounded-[28px] px-6 py-8 md:items-center md:gap-7 md:rounded-[32px] md:px-8 md:py-10`}
              >
                <CompareMark good={good} />
                <div className="min-w-0">
                  <p className="tl-wf-grad text-[11px] font-semibold uppercase tracking-[0.12em]">
                    {good ? "The good kind" : "The bad kind"}
                  </p>
                  <h3 className="mt-2 text-[20px] font-[family-name:var(--font-milling-bold)] font-bold leading-7 tracking-[0.1px]">
                    {panel.heading}
                  </h3>
                  <p className="mt-3 text-[16px] leading-6 tracking-[0.16px]">{panel.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-12 max-w-[52rem] text-center text-[16px] leading-6 tracking-[0.16px] text-[var(--kai-light-muted)] md:mt-14">
          Your account. Your approval. Your call — every time. And every change kAInet makes is written to your account&apos;s change log, so you can always answer the only question that matters when something moves:{" "}
          <em className="tl-wf-grad">what changed, and who changed it</em>.
        </p>
      </div>
    </section>
  );
}
