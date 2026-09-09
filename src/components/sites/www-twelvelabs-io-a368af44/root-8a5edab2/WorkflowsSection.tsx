import { comparePanels } from "./content";

function CompareMark({ good }: { good: boolean }) {
  return (
    <span className={`tl-wf-mark${good ? " tl-wf-mark-good" : ""}`} aria-hidden>
      <svg viewBox="0 0 24 24">
        {good ? (
          <>
            <path className="tl-wf-shade" d="M5 12.4l5 5L20 7" />
            <path className="tl-wf-stroke" d="M5 12.4l5 5L20 7" />
          </>
        ) : (
          <>
            <path className="tl-wf-shade" d="M6 6l12 12" />
            <path className="tl-wf-shade" d="M18 6L6 18" />
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
        <header className="max-w-[52rem] border-l border-[#000000]/15 pl-6">
          <h2 className="text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[1.14] md:tracking-[-0.96px]">
            There are two bad ways to do AI marketing.{" "}
            <span className="tl-wf-grad">We&apos;re not doing either.</span>
          </h2>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-6 tracking-[0.16px] text-[var(--kai-light-muted)]">
            You&apos;ve probably been burned by one of them. Here&apos;s what we think went wrong, and what we do instead.
          </p>
        </header>

        <div className="tl-wf-plate relative mt-14 md:mt-16">
          <div className="relative grid grid-cols-2 auto-rows-fr gap-3 min-[480px]:gap-4 md:gap-x-12 md:gap-y-8">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--kai-purple)]/15"
            />
            {comparePanels.map((panel) => {
              const good = panel.kind === "good";
              return (
                <article
                  key={panel.heading}
                  className="tl-wf-card tl-wf-card-good flex h-full min-w-0 flex-col items-start gap-3 rounded-[20px] px-3 py-4 min-[480px]:flex-row min-[480px]:gap-5 min-[480px]:rounded-[28px] min-[480px]:px-5 min-[480px]:py-6 md:items-center md:gap-7 md:rounded-[32px] md:px-8 md:py-10"
                >
                  <CompareMark good={good} />
                  <div className="min-w-0">
                    <p
                      className={
                        good
                          ? "tl-preview-text text-[11px] font-semibold uppercase tracking-[0.12em]"
                          : "tl-wf-grad text-[11px] font-semibold uppercase tracking-[0.12em]"
                      }
                    >
                      {good ? "The good kind" : "The bad kind"}
                    </p>
                    <h3 className="mt-2 text-[15px] font-[family-name:var(--font-milling-bold)] font-bold leading-5 tracking-[0.1px] min-[480px]:text-[18px] min-[480px]:leading-6 md:text-[20px] md:leading-7">
                      {panel.heading}
                    </h3>
                    <p className="mt-3 text-[13px] leading-5 tracking-[0.16px] min-[480px]:text-[15px] md:text-[16px] md:leading-6">
                      {panel.body}
                    </p>
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
      </div>
    </section>
  );
}
