export type SiteButtonVariant = "primary" | "secondary";
export type SiteButtonSize = "l" | "s";
export type SiteTheme = "dark" | "light";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export type FeatureTab = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  image?: string;
};

export type KpiItem = {
  value: string;
  caption: string;
};

export type SolutionCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  image: string;
};

export type ModelCard = {
  name: string;
  kind: string;
  body: string;
  href: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};
