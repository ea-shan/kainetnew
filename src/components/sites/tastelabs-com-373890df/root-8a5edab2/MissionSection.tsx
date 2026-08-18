import { MISSION } from "./content";

export function MissionSection() {
  return (
    <section
      id="about"
      data-nav-theme="light"
      className="flex min-h-[971px] items-center bg-[#f5f7f2] py-[112px] pl-0 pr-10"
    >
      <div className="mx-auto grid w-[min(1385px,100%)] grid-cols-1 gap-8 px-10 min-[900px]:grid-cols-12 min-[900px]:px-0 min-[900px]:pl-10">
        <div className="hidden min-[900px]:col-span-8 min-[900px]:block" />
        <div className="min-[900px]:col-span-3 min-[900px]:col-start-10">
          <h2 className="text-[31.68px] leading-[39.6px] tracking-[-0.5px] text-[#1e1e1e]">{MISSION.title}</h2>
          <p className="mt-6 whitespace-pre-line text-[16px] leading-[22.4px] font-light text-[#1e1e1e]">
            {MISSION.body}
          </p>
        </div>
      </div>
    </section>
  );
}
