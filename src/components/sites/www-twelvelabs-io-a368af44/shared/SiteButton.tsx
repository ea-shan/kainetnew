import { ArrowUpRightIcon } from "./icons";
import type { SiteButtonSize, SiteButtonVariant, SiteTheme } from "../root-8a5edab2/types";

export function SiteButton({
  href,
  children,
  variant = "secondary",
  size = "l",
  theme = "dark",
}: {
  href: string;
  children: string;
  variant?: SiteButtonVariant;
  size?: SiteButtonSize;
  theme?: SiteTheme;
}) {
  const isPrimary = variant === "primary";
  const isLarge = size === "l";
  const onDark = theme === "dark";
  const ink = isPrimary ? "!text-[#000000]" : onDark ? "!text-[#EEEEEE]" : "!text-[#000000]";
  const fill = isPrimary ? "bg-[#EEEEEE]" : "bg-transparent";
  const ring = isPrimary
    ? ""
    : onDark
      ? "shadow-[inset_0_0_0_1px_#EEEEEE]"
      : "shadow-[inset_0_0_0_1px_#000000]";

  return (
    <a
      href={href}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-[16px] leading-6 tracking-[0.16px] transition-opacity hover:opacity-80 ${ink} ${fill} ${ring} ${
        isLarge ? "h-[60px] rounded-[18px] px-6" : "h-11 rounded-[14px] px-4"
      }`}
    >
      {children}
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}

export function LogoMark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${className ?? "text-[20px]"}`}>
      <img
        src="/sites/www-twelvelabs-io-a368af44/shared/kainet.webp"
        alt=""
        className={`h-[1.15em] w-[1.15em] rounded-[22%] object-cover ${tone === "dark" ? "mix-blend-screen" : ""}`}
      />
      <span className="font-[family-name:var(--font-milling-bold)] leading-none tracking-[-0.04em]">kAInet</span>
    </span>
  );
}
