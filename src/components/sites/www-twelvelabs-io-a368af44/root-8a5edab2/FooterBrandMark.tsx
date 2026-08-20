import { LogoMark } from "../shared/SiteButton";

export function FooterBrandMark({ className }: { className?: string }) {
  return <LogoMark tone="light" className={className} />;
}

export function CookieIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9.2" cy="10.2" r="1.05" fill="currentColor" />
      <circle cx="13.6" cy="9.4" r=".85" fill="currentColor" />
      <circle cx="14.4" cy="13.6" r="1.05" fill="currentColor" />
      <circle cx="10.2" cy="14.5" r=".75" fill="currentColor" />
    </svg>
  );
}
