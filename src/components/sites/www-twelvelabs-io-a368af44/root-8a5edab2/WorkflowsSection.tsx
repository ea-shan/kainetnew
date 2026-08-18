"use client";

import { useState } from "react";
import { workflowTabs } from "./content";
import { WorkflowVisual } from "./WorkflowVisual";

export function WorkflowsSection() {
  const [active, setActive] = useState(workflowTabs[0].id);

  return (
    <section
      className="px-5 pb-16 pt-20 text-[#1D1C1B] md:px-10"
      style={{
        background:
          "linear-gradient(90deg, rgb(220, 240, 215) 0%, rgb(250, 245, 210) 38%, rgb(255, 236, 220) 68%, rgb(255, 230, 240) 100%)",
      }}
    >
      <div className="tl-page grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-16">
        <h2 className="max-w-[593px] border-l border-[#1D1C1B]/15 pl-6 text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
          Built for the most demanding video workflows.
        </h2>
        <p className="max-w-[420px] border-l border-[#1D1C1B]/15 pl-6 text-[16px] leading-6 tracking-[0.16px]">
          Designed for organizations working with video at scale, turning raw, passive footage into a strategic asset teams can actually use.
        </p>
      </div>

      <div className="tl-page mt-16 overflow-hidden rounded-[40px] bg-white px-8 py-12 md:rounded-[80px] md:px-16 md:py-16 lg:rounded-[100px] lg:px-20 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-x-14 lg:gap-x-20">
          <div className="min-w-0">
            {workflowTabs.map((tab) => {
              const isOn = tab.id === active;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className="block w-full cursor-pointer py-3 text-left"
                >
                  <h3 className={`text-[20px] leading-7 tracking-[0.1px] ${isOn ? "text-[#1D1C1B]" : "text-[#1D1C1B]/45"}`}>
                    {tab.title}
                  </h3>
                  {isOn && tab.body ? (
                    <p className="mt-3 text-[16px] leading-6 tracking-[0.16px] text-[#1D1C1B]">
                      {tab.body}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="mx-auto w-full max-w-[590px] min-w-0 md:ml-auto">
            <WorkflowVisual active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
