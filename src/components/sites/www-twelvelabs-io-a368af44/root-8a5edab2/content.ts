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
    href: "https://www.twelvelabs.io/product",
    children: [
      { label: "Platform Overview", href: "https://www.twelvelabs.io/product" },
      { label: "Models Overview", href: "https://www.twelvelabs.io/models" },
      { label: "Embed", href: "https://www.twelvelabs.io/embed" },
      { label: "Search", href: "https://www.twelvelabs.io/search" },
      { label: "Analyze", href: "https://www.twelvelabs.io/analyze" },
    ],
  },
  {
    label: "Pricing",
    href: "https://www.twelvelabs.io/pricing",
    children: [{ label: "Pricing", href: "https://www.twelvelabs.io/pricing" }],
  },
  {
    label: "Solutions",
    href: "https://www.twelvelabs.io/solutions",
    children: [
      { label: "Media & Entertainment", href: "https://www.twelvelabs.io/solutions/media" },
      { label: "Advertising", href: "https://www.twelvelabs.io/solutions/advertising" },
      { label: "Government", href: "https://www.twelvelabs.io/solutions/government" },
      { label: "Security", href: "https://www.twelvelabs.io/solutions/security" },
      { label: "Sports & Broadcasting", href: "https://www.twelvelabs.io/solutions/sports" },
    ],
  },
  { label: "Build", href: "https://www.twelvelabs.io/developers" },
  {
    label: "Resources",
    href: "https://www.twelvelabs.io/blog",
    children: [
      { label: "API Docs", href: "https://docs.twelvelabs.io" },
      { label: "SDKs", href: "https://docs.twelvelabs.io/docs/sdk" },
      { label: "Developer Hub", href: "https://www.twelvelabs.io/developers" },
      { label: "Sample Apps", href: "https://www.twelvelabs.io/developers" },
      { label: "Research", href: "https://www.twelvelabs.io/research" },
    ],
  },
  {
    label: "Company",
    href: "https://www.twelvelabs.io/about",
    children: [
      { label: "About Us", href: "https://www.twelvelabs.io/about" },
      { label: "Careers", href: "https://www.twelvelabs.io/careers" },
      { label: "Blog", href: "https://www.twelvelabs.io/blog" },
      { label: "Press", href: "https://www.twelvelabs.io/press" },
    ],
  },
];

export const getStartedTabs: FeatureTab[] = [
  {
    id: "infra",
    title: "1. Infrastructure",
    body: "Ingest multimodal data through a single pipeline at ~60x real-time speed. Index an hour of video in a minute. 10k+ hours per day.",
    href: "https://www.twelvelabs.io/product",
    image: `${ASSET}/images/nUghrpRDrBnm65VAzyao7IjxRno.avif`,
  },
  {
    id: "api",
    title: "2. API + SDK",
    body: "Index, search, and analyze video with one API. Python and Node.js SDKs so you can ship in a single call.",
    href: "https://docs.twelvelabs.io",
    image: `${ASSET}/images/THm7BlufIqEY8taJyec7USIzsTg.avif`,
  },
  {
    id: "mcp",
    title: "3. MCP",
    body: "Connect TwelveLabs to agents through MCP. Ask questions of your archive from the tools you already use.",
    href: "https://www.twelvelabs.io/developers",
    image: `${ASSET}/images/HOxj8HlO2OZ5zG747yPiJuucbXI.webp`,
  },
  {
    id: "integrations",
    title: "4. Integrations",
    body: "Plug video intelligence into Notion, Slack, Linear, and the rest of your stack—no custom pipeline required.",
    href: "https://www.twelvelabs.io/developers",
    image: `${ASSET}/images/HOxj8HlO2OZ5zG747yPiJuucbXI.webp`,
  },
];

export const workflowTabs: FeatureTab[] = [
  {
    id: "search",
    title: "Search & Discover",
    body: "Search entire video libraries using natural language. Locate specific actions, scenes, dialogue, and even human emotions across hours or years of footage, no tags needed. One index. Every modality. SOTA composite accuracy.",
    image: `${ASSET}/images/workflow-a.png`,
  },
  {
    id: "segment",
    title: "Segment Content",
    body: "Automatically identify natural breaks, scene changes, and pacing shifts in long-form video, grounded in what actually happened. Not a transcript reader. A video reasoner. #1 on Video-MME.",
    image: `${ASSET}/images/workflow-b.png`,
  },
  {
    id: "compliance",
    title: "Ensure Compliance",
    body: "Identify policy risks, sensitive content, and brand safety issues at scale with explainable AI, so teams can review faster, with confidence in every decision.",
    image: `${ASSET}/images/workflow-c.png`,
  },
  {
    id: "highlights",
    title: "Create Highlights",
    body: "Describe what you need, a rough cut from 200 hours of dailies, every scored goal this season, thematic clips organized by subject. Finds the material, assembles it, and exports directly into your editing workflow.",
    image: `${ASSET}/images/workflow-a.png`,
  },
  {
    id: "insights",
    title: "Generate Insights",
    body: "Analyze video at scale to surface patterns and signals, so teams can quickly see what's working and make better creative and editorial decisions.",
    image: `${ASSET}/images/workflow-b.png`,
  },
];

export const kpis: KpiItem[] = [
  { value: "+13.1%", caption: "Pegasus 1.5 over Gemini 3.1 Pro on Multimodal Prompting" },
  { value: "10x", caption: "Faster content review and compliance scanning." },
  { value: "4 hrs", caption: "Single video, one API call" },
];

export const solutions: SolutionCard[] = [
  {
    id: "creative",
    title: "Creative Industries",
    body: "Turn archives from liabilities to strategic assets. Within seconds: timestamped clips, from every year, every shoot. What used to take a research team three days takes three seconds.",
    href: "https://www.twelvelabs.io/solutions/media",
    image: `${ASSET}/images/workflow-b.png`,
  },
  {
    id: "ads",
    title: "Advertising and Marketing",
    body: "Actually contextual targeting, driven by understanding, not metadata. Place ads only in brand-safe scenes, no tags, no manual review.",
    href: "https://www.twelvelabs.io/solutions/advertising",
    image: `${ASSET}/images/workflow-c.png`,
  },
  {
    id: "public",
    title: "Public Sector",
    body: "Evidence management, anomaly detection, after incident reporting, all done in minutes using TwelveLabs video intelligence.",
    href: "https://www.twelvelabs.io/solutions/government",
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
      { label: "Platform Overview", href: "https://www.twelvelabs.io/product" },
      { label: "Models Overview", href: "https://www.twelvelabs.io/models" },
    ],
  },
  {
    title: "Enterprise",
    links: [
      { label: "Overview", href: "https://www.twelvelabs.io/enterprise" },
      { label: "Case Studies", href: "https://www.twelvelabs.io/customers" },
      { label: "Partners", href: "https://www.twelvelabs.io/partners" },
      { label: "Security", href: "https://www.twelvelabs.io/security" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Docs", href: "https://docs.twelvelabs.io" },
      { label: "SDKs", href: "https://docs.twelvelabs.io" },
      { label: "Discord", href: "https://discord.com/invite/twelvelabs" },
      { label: "Developer Hub", href: "https://www.twelvelabs.io/developers" },
      { label: "Sample Apps", href: "https://www.twelvelabs.io/developers" },
      { label: "Research", href: "https://www.twelvelabs.io/research" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Website Terms", href: "https://www.twelvelabs.io/legal/website-terms" },
      { label: "Terms of Use", href: "https://www.twelvelabs.io/legal/terms" },
      { label: "Enterprise Terms of Service", href: "https://www.twelvelabs.io/legal/enterprise" },
      { label: "Privacy Policy", href: "https://www.twelvelabs.io/legal/privacy" },
      { label: "Trust Center", href: "https://trust.twelvelabs.io" },
      { label: "Additional Legal Resources", href: "https://www.twelvelabs.io/legal" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "Embed", href: "https://www.twelvelabs.io/embed" },
      { label: "Search", href: "https://www.twelvelabs.io/search" },
      { label: "Analyze", href: "https://www.twelvelabs.io/analyze" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Media & Entertainment", href: "https://www.twelvelabs.io/solutions/media" },
      { label: "Advertising", href: "https://www.twelvelabs.io/solutions/advertising" },
      { label: "Government", href: "https://www.twelvelabs.io/solutions/government" },
      { label: "Security", href: "https://www.twelvelabs.io/solutions/security" },
      { label: "Sports & Broadcasting", href: "https://www.twelvelabs.io/solutions/sports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "https://www.twelvelabs.io/about" },
      { label: "Careers", href: "https://www.twelvelabs.io/careers" },
      { label: "Newsletter", href: "https://www.twelvelabs.io/newsletter" },
      { label: "Blog", href: "https://www.twelvelabs.io/blog" },
      { label: "Press", href: "https://www.twelvelabs.io/press" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/twelvelabs" },
      { label: "YouTube", href: "https://www.youtube.com/@twelvelabs" },
      { label: "x", href: "https://x.com/twelvelabsio" },
    ],
  },
];

export const partnerLogos = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19].map(
  (n) => `${ASSET}/images/inline-${n}.svg`,
);
