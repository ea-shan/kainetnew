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
  const ink = isPrimary ? "!text-[#1D1C1B]" : onDark ? "!text-[#F4F3F3]" : "!text-[#1D1C1B]";
  const fill = isPrimary
    ? "bg-[#F4F3F3]"
    : "bg-transparent";
  const ring = isPrimary
    ? ""
    : onDark
      ? "shadow-[inset_0_0_0_1px_#F4F3F3]"
      : "shadow-[inset_0_0_0_1px_#1D1C1B]";

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

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/sites/www-twelvelabs-io-a368af44/shared/logo.svg"
      alt="TwelveLabs"
      className={className ?? "h-8 w-auto"}
    />
  );
}
