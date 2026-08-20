import { kpis } from "./content";

export function KpisSection() {
  return (
    <section className="bg-[#EEEEEE] px-5 pb-10 pt-16 text-[#000000] min-[768px]:px-10">
      <div className="tl-page">
        <h2 className="mx-auto max-w-[720px] text-center text-[36px] leading-[1.14] tracking-[-0.02em] min-[768px]:text-[48px] min-[768px]:leading-[54.72px] min-[768px]:tracking-[-0.96px]">
          Create, scale & move faster with video
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] text-center text-[16px] leading-6 tracking-[0.16px]">
          Designed for organizations working with video at scale – turning raw, passive footage into a strategic asset teams can actually use.
        </p>
        <div className="tl-kpis mt-16 grid min-[768px]:grid-cols-3 min-[768px]:divide-x min-[768px]:divide-[#000000]/12">
          {kpis.map((kpi) => (
            <div key={kpi.value} className="tl-kpi px-6 py-10 text-center min-[768px]:py-8">
              <p className="relative text-[56px] leading-[62.72px] tracking-[-1.12px]">
                <span>{kpi.value}</span>
                <span className="tl-kpi-glow absolute inset-0" aria-hidden>
                  {kpi.value}
                </span>
              </p>
              <p className="mx-auto mt-6 max-w-[280px] text-[16px] leading-6 tracking-[0.16px]">{kpi.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
