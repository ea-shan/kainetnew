import type { ReactNode } from "react";

export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M 7.48 1 L 2.354 1 L 2.354 0 L 8.02 0 C 8.665 0 9.187 0.522 9.187 1.167 L 9.187 6.833 L 8.187 6.833 L 8.187 1.707 L 0.707 9.187 L 0 8.48 Z"
        transform="translate(3.406 3.406)"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 12h16M12 4c2.4 2.6 3.6 5.4 3.6 8s-1.2 5.4-3.6 8c-2.4-2.6-3.6-5.4-3.6-8s1.2-5.4 3.6-8z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2l1.1 5.1L18 9.2l-4.9 1.1L12 15.2l-1.1-4.9L6 9.2l4.9-.9L12 3.2z" />
      <path d="M18.2 14.2l.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6.6-2.4z" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.2 8.2l3 3 6.6-6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.4L1.8 13.2h12.4L8 2.4z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 6.4v3.2M8 11.4v.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5.2V8l2 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.2" y="4.2" width="11.6" height="7.6" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.2 7h11.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PauseCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.6 5.8v4.4M9.4 5.8v4.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function HorseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
      <path d="M10 40c1.2-6 3-10 7-13-3-1-5-4-5-8 0-2 1-4 3-5 2 3 5 5 9 5 3 0 5-1 7-3 2 1 3 3 3 6 2-1 4-1 6 0-1 3-3 5-6 6 2 2 3 5 3 9H10z" />
    </svg>
  );
}

export function PegasusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
      <path d="M8 18c6-2 10-8 11-14 3 5 6 8 11 9-1 3-3 5-6 6 4 1 7 2 9 5-3 1-6 1-9 0 2 3 3 7 3 12H9c1-6 2-10 6-13-3-1-5-3-7-5z" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const STROKE = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICON_PATHS: Record<string, ReactNode> = {
  category: (
    <>
      <path d="M5 10h2c2 0 3-1 3-3V5c0-2-1-3-3-3H5C3 2 2 3 2 5v2c0 2 1 3 3 3Z" {...STROKE} />
      <path d="M17 10h2c2 0 3-1 3-3V5c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3Z" {...STROKE} />
      <path d="M17 22h2c2 0 3-1 3-3v-2c0-2-1-3-3-3h-2c-2 0-3 1-3 3v2c0 2 1 3 3 3Z" {...STROKE} />
      <path d="M5 22h2c2 0 3-1 3-3v-2c0-2-1-3-3-3H5c-2 0-3 1-3 3v2c0 2 1 3 3 3Z" {...STROKE} />
    </>
  ),
  "search-status": (
    <>
      <path d="M14 5h6M14 8h3" {...STROKE} />
      <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z" {...STROKE} />
      <path d="m22 22-2-2" {...STROKE} />
    </>
  ),
  hierarchy: (
    <>
      <path d="M5 8h3c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5C3.9 2 3 2.9 3 4v2c0 1.1.9 2 2 2Z" {...STROKE} />
      <path d="M16 22h3c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z" {...STROKE} />
      <path d="M5 22h3c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2Z" {...STROKE} />
      <path d="M6.5 8v3.5c0 1.1.9 2 2 2h7c1.1 0 2 .9 2 2V16" {...STROKE} />
      <path d="M6.5 16.5V13.5" {...STROKE} />
    </>
  ),
  gallery: (
    <>
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" {...STROKE} />
      <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...STROKE} />
      <path d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9" {...STROKE} />
    </>
  ),
  export: (
    <>
      <path d="M16.44 8.9c3.6.31 5.07 2.16 5.07 6.21v.13c0 4.47-1.79 6.26-6.26 6.26H8.74c-4.47 0-6.26-1.79-6.26-6.26v-.13c0-4.03 1.46-5.87 5.02-6.2" {...STROKE} />
      <path d="M12 15V3.62M15.35 5.85 12 2.5 8.65 5.85" {...STROKE} />
    </>
  ),
  "status-up": (
    <>
      <path d="M6.88 18.15v-2.07M12 18.15v-4.14M17.12 18.15v-1.35" {...STROKE} />
      <path d="m17.12 5.85-.46.54c-2.56 3.03-5.42 5.12-9.66 6.3" {...STROKE} />
      <path d="M14.19 5.85h2.93v2.92" {...STROKE} />
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" {...STROKE} />
    </>
  ),
  "setting-4": (
    <>
      <path d="M22 6.5h-6M6 6.5H2M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 17.5h-4M10 17.5H2M14 21a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...STROKE} />
    </>
  ),
  link: (
    <>
      <path d="M13.06 10.94a5.74 5.74 0 0 1 0 8.13l-.91.91a5.74 5.74 0 0 1-8.13-8.13l1.26-1.26" {...STROKE} />
      <path d="M10.94 13.06a5.74 5.74 0 0 1 0-8.13l.91-.91a5.74 5.74 0 1 1 8.13 8.13l-1.26 1.26" {...STROKE} />
    </>
  ),
  briefcase: (
    <>
      <path d="M8 22h8c4.02 0 4.74-1.61 4.95-3.57l.75-8C21.97 8.61 21.27 7 17 7H7C2.73 7 2.03 8.61 2.3 10.43l.75 8C3.26 20.39 3.98 22 8 22Z" {...STROKE} />
      <path d="M8 7V6.4C8 3.87 8.56 2.62 12 2.62s4 1.24 4 3.76V7" {...STROKE} />
      <path d="M14 12.7a1.99 1.99 0 0 1-4 0" {...STROKE} />
    </>
  ),
  people: (
    <>
      <path d="M9.16 10.87c-.1 0-.21 0-.31.01-2.38.14-4.27-1.8-4.27-4.19C4.58 4.4 6.39 2.59 8.58 2.59c2.18 0 3.99 1.8 3.99 3.99 0 2.3-1.75 4.17-3.99 4.29h-.42Z" {...STROKE} />
      <path d="M16.41 10.87c.08 0 .15 0 .23.01 1.78.11 3.2-1.35 3.2-3.14 0-1.75-1.42-3.17-3.17-3.17-1.75 0-3.17 1.42-3.17 3.17 0 1.72 1.32 3.12 3.01 3.14h-.1Z" {...STROKE} />
      <path d="M4.16 14.96c-1.83 1.22-1.83 3.21 0 4.42 2.08 1.39 5.48 1.39 7.56 0 1.83-1.22 1.83-3.21 0-4.42-2.07-1.38-5.47-1.38-7.56 0Z" {...STROKE} />
      <path d="M15.34 19.2c.52-.11 1.01-.3 1.43-.58 1.18-.77 1.18-2.03 0-2.8-.41-.27-.88-.46-1.38-.57" {...STROKE} />
    </>
  ),
  buildings: (
    <>
      <path d="M13 22H5c-2 0-3-1-3-3v-8.2c0-1.2.6-2.3 1.6-2.96l6-4.28a3 3 0 0 1 3.5 0l6 4.28A3.5 3.5 0 0 1 21 10.8V19c0 2-1 3-3 3h-5Z" {...STROKE} />
      <path d="M12 22v-7h.01" {...STROKE} />
      <path d="M9.5 10h.01M14.5 10h.01M9.5 13.5h.01M14.5 13.5h.01" {...STROKE} />
    </>
  ),
};

export function IconsaxOutline({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {ICON_PATHS[name] ?? ICON_PATHS.category}
    </svg>
  );
}
