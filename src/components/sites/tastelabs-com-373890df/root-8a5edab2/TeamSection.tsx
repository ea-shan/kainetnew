"use client";

import { ASSET, JOBS, TEAM, TEAM_PHOTOS } from "./content";
import { ArrowUpRightIcon } from "../shared/icons";

const GROUPS = ["Creative Team", "Product & operations staff", "Technical staff"] as const;

export function TeamSection() {
  const strip = [...TEAM_PHOTOS, ...TEAM_PHOTOS];

  return (
    <section
      id="team"
      data-nav-theme="light"
      className="overflow-hidden bg-[#f5f7f2] px-10 py-[112px]"
    >
      <div className="mx-auto w-[min(1345px,100%)]">
        <h2 className="max-w-[640px] text-[31.68px] leading-[39.6px] tracking-[-0.5px] text-[#1e1e1e]">
          {TEAM.title}
        </h2>
        <p className="mt-5 max-w-[560px] text-[16px] leading-[22.4px] font-light text-[#8b8b8b]">{TEAM.body}</p>
      </div>

      <div className="mt-12 -mx-10 overflow-hidden">
        <div className="taste-marquee flex w-max gap-3">
          {strip.map(([file, alt], i) => (
            <img
              key={`${file}-${i}`}
              src={`${ASSET}/images/${file}`}
              alt={alt}
              className="h-[280px] w-[187px] shrink-0 object-cover min-[768px]:h-[360px] min-[768px]:w-[240px]"
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 w-[min(1345px,100%)]">
        <div className="text-[22.4px] leading-7 tracking-[-0.25px] text-[#1e1e1e]">{TEAM.who}</div>
        {GROUPS.map((group) => (
          <div key={group} className="mt-8">
            <div className="taste-mono text-[14.4px] leading-[18.72px] text-[#8b8b8b]">{group}</div>
            <ul className="mt-3">
              {JOBS.filter((j) => j.group === group).map((job) => (
                <li key={job.title}>
                  <a
                    href="#team"
                    className="group flex flex-wrap items-center justify-between gap-3 border-b border-[#1e1e1e]/10 py-4"
                  >
                    <span className="text-[16px] leading-[22.4px] font-medium text-[#1e1e1e]">{job.title}</span>
                    <span className="flex items-center gap-3 text-[16px] font-light text-[#1e1e1e]">
                      {job.location}
                      <span className="text-[#8b8b8b]">|</span>
                      {job.type}
                      <span className="text-[#8b8b8b]">|</span>
                      {job.mode}
                      <ArrowUpRightIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
