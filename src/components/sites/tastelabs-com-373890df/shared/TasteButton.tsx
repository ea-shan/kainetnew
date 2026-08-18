import { ScrambleText } from "./ScrambleText";

export function TasteButton({
  href,
  children,
  dark = false,
  className = "",
}: {
  href: string;
  children: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`taste-mono inline-flex h-[38px] items-center justify-center rounded-[7px] border px-7 text-[13px] leading-[18.2px] tracking-[-0.48px] ${
        dark
          ? "border-[#1e1e1e] text-[#1e1e1e]"
          : "border-[#f5f7f2] text-[#f5f7f2]"
      } ${className}`}
    >
      <ScrambleText text={children} />
    </a>
  );
}
