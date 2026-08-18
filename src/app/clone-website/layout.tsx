import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taste Labs - The taste layer for AI",
  description: "We're giving AI models and agents taste | Join our mission to end AI slop.",
  icons: {
    icon: "/sites/tastelabs-com-373890df/root-8a5edab2/images/favicon-light.png",
    apple: "/sites/tastelabs-com-373890df/root-8a5edab2/images/apple-touch.png",
  },
};

export default function TasteLayout({ children }: { children: React.ReactNode }) {
  return <div className="taste-site min-h-full">{children}</div>;
}
