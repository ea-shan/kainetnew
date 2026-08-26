import { ArrowUpRightIcon } from "./icons";
import type { SiteButtonSize, SiteButtonVariant, SiteTheme } from "../root-8a5edab2/types";

export function SiteButton({
  href,
  children,
  variant = "secondary",
  size = "l",
  theme = "dark",
  orbit = false,
}: {
  href: string;
  children: string;
  variant?: SiteButtonVariant;
  size?: SiteButtonSize;
  theme?: SiteTheme;
  orbit?: boolean;
}) {
  const isPrimary = variant === "primary";
  const isLarge = size === "l";
  const onDark = theme === "dark";

  if (isPrimary || orbit) {
    return (
      <a
        href={href}
        className={`tl-header-cta ${isPrimary ? "tl-header-cta-solid" : "tl-header-cta-outline"} inline-flex shrink-0 cursor-pointer`}
      >
        <span>
          {children}
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      </a>
    );
  }

  const ink = onDark ? "!text-[var(--kai-white)]" : "!text-[var(--kai-black)]";
  const fill = onDark ? "bg-[#08070a] border border-white" : "bg-[#eeeeee] border border-black";

  return (
    <a
      href={href}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-[16px] leading-6 tracking-[0.16px] transition-opacity hover:opacity-80 ${ink} ${fill} ${
        isLarge ? "h-11 rounded-full px-6" : "h-11 rounded-full px-4"
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
  wash = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  wash?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${className ?? "text-[20px]"}`}>
      <img
        src="/sites/www-twelvelabs-io-a368af44/shared/kainet.webp"
        alt=""
        className={`h-[1.15em] w-[1.15em] rounded-[22%] object-cover ${tone === "dark" ? "mix-blend-screen" : ""}`}
      />
      <span
        className={`font-[family-name:var(--font-milling-bold)] leading-none tracking-[-0.04em] ${wash ? "tl-logo-wash" : ""}`}
      >
        kAInet
      </span>
    </span>
  );
}
