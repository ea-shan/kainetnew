import type {
  FeatureTab,
  FooterColumn,
  KpiItem,
  ModelCard,
  NavItem,
  SolutionCard,
  Testimonial,
} from "./types";

export const ASSET = "/sites/www-twelvelabs-io-a368af44/root-8a5edab2";
export const SHARED = "/sites/www-twelvelabs-io-a368af44/shared";

export const navItems: NavItem[] = [
  {
    label: "Platform",
    href: "#",
    children: [
      { label: "The Platform", href: "#", icon: "category", description: "Research, build, launch, improve: six agents for Google and Meta" },
      { label: "Audience Research", href: "#", icon: "search-status", description: "Search demand, competitor bids, and audience segments, read before you brief" },
      { label: "Campaign Strategy", href: "#", icon: "hierarchy", description: "Ad groups, match types, and budget split, mapped from the research" },
      { label: "Creative Assets", href: "#", icon: "gallery", description: "Headlines, descriptions, and creative for every ad group you're running" },
      { label: "Campaign Execution", href: "#", icon: "export", description: "Your whole campaign, built in your own ad account and left paused" },
      { label: "Performance Analysis", href: "#", icon: "status-up", description: "What's working and what's burning budget. Every day." },
      { label: "Optimization", href: "#", icon: "setting-4", description: "Tests, budget shifts, and fixes, queued for your approval" },
      { label: "Integrations", href: "#", icon: "link", description: "Connect Google Ads and Meta. Keep the rest of your stack." },
    ],
  },
  {
    label: "Use Cases",
    href: "#",
    children: [
      { label: "Agencies", href: "/use-cases/agencies", icon: "briefcase", description: "Same retainer. None of the build." },
      { label: "In-House Teams", href: "/use-cases/in-house", icon: "people", description: "Launch like a bigger team than you have." },
      { label: "Enterprise", href: "/use-cases/enterprise", icon: "buildings", description: "Every account to the same standard, with a full change log." },
    ],
  },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export const getStartedTabs: FeatureTab[] = [
  {
    id: "audience-research",
    title: "1. Audience Research Agent",
    body: "Search demand, competitor bids, and audience segments, read before you brief.",
    href: "#",
    image: `${ASSET}/images/ai-orchestration.jpg`,
  },
  {
    id: "campaign-strategy",
    title: "2. Campaign Strategy Agent",
    body: "Ad groups, match types, and budget split, mapped from the research.",
    href: "#",
    image: `${ASSET}/images/THm7BlufIqEY8taJyec7USIzsTg.avif`,
  },
  {
    id: "creative-assets",
    title: "3. Creative Assets Agent",
    body: "Headlines, descriptions, and creative for every ad group you're running.",
    href: "#",
    image: `${ASSET}/images/HOxj8HlO2OZ5zG747yPiJuucbXI.webp`,
  },
  {
    id: "campaign-execution",
    title: "4. Campaign Execution Agent",
    body: "Your whole campaign, built in your own ad account and left paused.",
    href: "#",
    image: `${ASSET}/images/workflow-a.png`,
  },
  {
    id: "performance-analysis",
    title: "5. Performance Analysis Agent",
    body: "What's working and what's burning budget. Every day.",
    href: "#",
    image: `${ASSET}/images/workflow-b.png`,
  },
  {
    id: "optimization",
    title: "6. Optimization Agent",
    body: "Tests, budget shifts, and fixes, queued for your approval.",
    href: "#",
    image: `${ASSET}/images/workflow-c.png`,
  },
];

export const comparePanels = [
  {
    kind: "bad" as const,
    heading: "AI that spends while you sleep.",
    body: "It optimizes overnight. It pauses your best-performing campaign at 2am because of a data blip, or quietly moves budget into an audience you'd never have picked. You find out in the morning — or you find out in the invoice. The efficiency is real. So is the money it burned proving a point nobody approved.",
  },
  {
    kind: "good" as const,
    heading: "AI that does the work, then stops.",
    body: "The research, the structure, the keywords, the assets, the build — done. Then it stops, because every campaign kAInet builds is built paused. You open it, see exactly what's about to run, change what you want, and launch it yourself. Nothing moves your money until you decide it does.",
  },
  {
    kind: "bad" as const,
    heading: "AI that's a template wearing a new name.",
    body: "You fill in a form. You get back the same three headlines everyone else got, with your product name dropped in. It's fast because it isn't thinking. And somewhere out there, your competitor is running the identical ad, because they filled in the same form.",
  },
  {
    kind: "good" as const,
    heading: "AI that actually did the work on your account.",
    body: "Six specialist agents work your brief the way a team would — Audience Research Agent finds who's worth reaching, Campaign Strategy Agent structures the spend, Creative Assets Agent drafts what the ads say, Campaign Execution Agent builds it. On your account, from your data, for your brief. Not pulled from a template library.",
  },
] as const;

export const kpis: KpiItem[] = [
  { value: "+13.1%", caption: "Pegasus 1.5 over Gemini 3.1 Pro on Multimodal Prompting" },
  { value: "10x", caption: "Faster content review and compliance scanning." },
  { value: "4 hrs", caption: "Single video, one API call" },
];

export const solutions: SolutionCard[] = [
  {
    id: "agencies",
    title: "Performance agencies",
    headline: "Same retainer. None of the build.",
    body: 'Research, structure, creative, and the build itself, across every client account. Each one waiting for you to look at it. Each one logged, so "what changed?" has an answer.',
    href: "/use-cases/agencies",
    image: `${ASSET}/images/workflow-b.png`,
  },
  {
    id: "in-house",
    title: "In-house teams",
    headline: "Launch like a bigger team than you have.",
    body: "One brief in, a finished campaign in your own accounts. You still decide what runs — you just stop spending Thursdays building it.",
    href: "/use-cases/in-house",
    image: `${ASSET}/images/workflow-c.png`,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    headline: "Every account to the same standard, with a full change log.",
    body: "The campaign a new hire builds looks like the one your best person builds. Custom onboarding, dedicated support, and a record of every change across every account.",
    href: "/use-cases/enterprise",
    image: `${ASSET}/images/workflow-a.png`,
  },
];

export const models: ModelCard[] = [
  {
    name: "Marengo",
    kind: "Multimodal Embedding Model.",
    body: "You can't search what you can't see. Marengo turns video into data: spatiotemporal embeddings that make every moment findable by what's actually in it, not metadata someone typed. One index. Every modality. 78.5% composite accuracy. 47 languages.",
    href: "https://www.twelvelabs.io/models",
    image: `${ASSET}/images/security-a.png`,
  },
  {
    name: "Pegasus",
    kind: "Video Language Model.",
    body: "General-purpose models sample frames and guess. Pegasus reasons continuously over the full temporal arc of any asset, up to two hours: tracking entities, causation, and narrative across time. Not a transcript reader.",
    href: "https://www.twelvelabs.io/models",
    image: `${ASSET}/images/security-b.png`,
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "It’s essential for our business to access exact moments in games to package the best content to our fans. Multimodal AI is a game-changer in surfacing the best content you have available.",
    name: "Brad Boim",
    role: "Senior Director, Media Management & Post Production, NFL Media",
  },
  {
    quote:
      "With generative AI, we can mine neglected aspects of videos, both in and out of game, to create content tailored to each fan while maintaining the brand identity of each team preserved in team-specific generative models. This revolutionary approach allows creative teams to focus on high-level strategy while providing an unprecedented scale of personalized, engaging content",
    name: "Farah Bastien",
    role: "SENIOR DIRECTOR, MEDIA OPERATIONS AND SPORTS PRODUCTION, MLSE",
  },
  {
    quote:
      "TwelveLabs is one-of-a kind. For us to serve as a design partner to be the first city in the world to deploy this kind of advanced technology using foundational models is a true opportunity we appreciate.",
    name: "CTO, Sejong City",
    role: "",
  },
  {
    quote:
      "TwelveLabs has developed a powerful and user-friendly technology that allows users to ask questions about videos and receive answers as if by magic!",
    name: "Jorge Torres",
    role: "Co-Founder and CEO, MindsDB",
  },
  {
    quote:
      "Building with TwelveLabs was an easy and powerful way to enhance our video datasets. Integration with FiftyOne was made simple with their excellent documentation and tutorials.",
    name: "Daniel Gural",
    role: "Machine Learning Evangelist, Voxel51",
  },
  {
    quote:
      "There is nothing in the world like TwelveLabs. It’s easy to integrate, finds what’s valuable, and the accuracy is astounding. Our video data opens new doors to business areas we’d only imagined.",
    name: "Pedro Almeida",
    role: "CEO, Mindprober",
  },
  {
    quote:
      "The TwelveLabs API continually amazes me in searching ALL parts of a video. With each search, I discover new results and possibilities of the technology for our customers.",
    name: "Michael Philips",
    role: "Chief Product Officer, Source Digital",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "The Platform", href: "#" },
      { label: "Audience Research", href: "#" },
      { label: "Campaign Strategy", href: "#" },
      { label: "Creative Assets", href: "#" },
      { label: "Campaign Execution", href: "#" },
      { label: "Performance Analysis", href: "#" },
      { label: "Optimization", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "For Agencies", href: "/use-cases/agencies" },
      { label: "For In-House Teams", href: "/use-cases/in-house" },
      { label: "For Enterprise", href: "/use-cases/enterprise" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export const partnerLogos = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19].map(
  (n) => `${ASSET}/images/inline-${n}.svg`,
);
