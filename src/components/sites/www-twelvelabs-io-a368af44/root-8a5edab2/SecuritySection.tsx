import { SecurityVideoDeck } from "./SecurityVideoDeck";

export function SecuritySection() {
  return (
    <section className="tl-secure-section relative overflow-hidden px-5 py-24 text-[#000000] min-[768px]:px-10">
      <div className="tl-page relative grid items-start gap-12 min-[900px]:grid-cols-[1.1fr_0.9fr] min-[900px]:gap-x-16 min-[900px]:items-center">
        <SecurityVideoDeck />
        <div className="border-l border-[#000000]/15 pl-8 min-[900px]:pl-12">
          <h2 className="max-w-[520px] text-[36px] leading-[1.14] tracking-[-0.02em] min-[768px]:text-[48px] min-[768px]:leading-[54.72px] min-[768px]:tracking-[-0.96px]">
            Built in the open
          </h2>
          <div className="mt-6 max-w-[28rem] space-y-4 text-[16px] leading-6 tracking-[0.16px]">
            <p>
              <strong>kAInet is early.</strong> Our first accounts started this summer, so we don&apos;t have a wall of
              customer results to show you yet — and we&apos;re not going to borrow anyone else&apos;s or
              dress up a demo number as one.
            </p>
            <p>
              What we can do is show you exactly how it works and let you check it yourself. Every action
              kAInet takes lands in your own account, timestamped, in a change log you can read line by
              line. Nothing about how this works is hidden from you.
            </p>
            <p>When we do have numbers, they&apos;ll be real ones, and we&apos;ll tell you how we counted them.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
