import type { BlogCard, Job, NavLink, ProductCard } from "./types";

export const ASSET = "/sites/tastelabs-com-373890df/root-8a5edab2";

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Product", href: "#product" },
  { label: "Careers", href: "#team" },
  { label: "Research", href: "#research" },
];

export const HERO = {
  line1: "Decoding subjective domains",
  line2: "the Taste infra layer for AI",
  cta: "Join our team",
};

export const CHALLENGE = {
  lines: [
    "AI has made it easy to generate anything.",
    "The challenge is knowing what to make.",
    "And how to make it great.",
  ],
};

export const CAROUSEL = Array.from({ length: 18 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const ext = i === 5 ? "png" : "avif";
  return `${ASSET}/images/carousel-${n}.${ext}`;
});

export const MISSION = {
  title: "Mission",
  body: "Instead, there can be a world of creativity, beauty and taste.\n\nThat requires cracking how to measure, classify, stir, search over and codify subjective domains into data models can learn from, and tools agents can use.\n\nSo that models and agents can produce not just outputs that are correct, but that feel right.\n\nWe’re making the unverifiable verifiable, starting with design.",
};

export const PRODUCT_HEAD = "Taste across the stack";

export const PRODUCT_CARDS: ProductCard[] = [
  {
    title: "Taste for Training Models",
    body: "We work with the top frontier labs to give their models taste, vision and design capabilities",
  },
  {
    title: "Taste for Agents or Apps",
    body: "We work with app layer, coding agents and creative technology companies, providing the infra products for context, eval and verification, so they can output better, more beautiful, more personalized and on brand designs.",
  },
];

export const TEAM = {
  title: "Join our mission to end AI slop.",
  body: "Bring your taste in post-training, architecture, search, product building, evals, data, design and more, to crack subjective domains.",
  who: "Who we need",
};

export const TEAM_PHOTOS = [
  ["team-ana.avif", "Smiling woman in a black sweater and jeans leaning on a chair by large windows with trees outside."],
  ["team-maria.avif", "Smiling woman in black dress standing indoors near large window overlooking a scenic hilly landscape."],
  ["team-lauta.avif", "Young man smiling and wearing a denim jacket and smartwatch standing indoors by a large window."],
  ["team-marcelo.avif", "Man with glasses sitting relaxed in a chair near large window with city view, black and white photo."],
  ["team-remi.avif", "Smiling man kneeling inside near glass windows overlooking trees and cityscape."],
  ["team-lucas.avif", "Smiling man with short hair and beard wearing a dark hoodie sitting indoors near a window."],
  ["team-joseph.avif", "Smiling man in black shirt and pants leaning against a window overlooking city landscape."],
  ["team-matthew.avif", "Man with glasses and beard wearing a dark jacket sitting on chair by window overlooking a city."],
  ["team-hami.avif", "Woman with long braided hair and glasses sitting indoors, smiling softly at the camera."],
  ["team-dave.avif", "Smiling man in black shirt leaning on chair in front of large window with outdoor view."],
  ["team-mo.avif", "Smiling young man with glasses sitting indoors by a large window with a city view."],
  ["team-thais.avif", "Woman with long dark hair sitting in patterned dress near large windows with city view."],
] as const;

export const JOBS: Job[] = [
  { group: "Creative Team", title: "Senior Designer", location: "San Francisco", type: "Full time", mode: "Hybrid" },
  { group: "Product & operations staff", title: "Strategic Product Operations Lead", location: "San Francisco", type: "Full time", mode: "Hybrid" },
  { group: "Product & operations staff", title: "Operations Manager, Community", location: "San Francisco", type: "Contract", mode: "Remote" },
  { group: "Product & operations staff", title: "Growth Lead", location: "San Francisco", type: "Full time", mode: "On-site" },
  { group: "Technical staff", title: "Design Research Engineer", location: "San Francisco", type: "Full time", mode: "On-site" },
  { group: "Technical staff", title: "Applied ML Engineer", location: "San Francisco", type: "Full time", mode: "On-site" },
  { group: "Technical staff", title: "AI-Engineer (Full Stack)", location: "San Francisco", type: "Full time", mode: "On-site" },
  { group: "Technical staff", title: "AI-Engineer (Back-end)", location: "San Francisco", type: "Full time", mode: "On-site" },
];

export const RESEARCH = {
  title: "Read our Research and Blog",
  body: "We're a hybrid research lab and infra product company. See more of what's on our mind.",
  cta: "Explore articles",
};

export const BLOG_CARDS: BlogCard[] = [
  {
    title: "Introducing prototype",
    excerpt: "Introducing Prototype, our fellowship to support researchers working on designing the language of creativity.",
    href: "https://tastelabs.com/blog/introducing-prototype",
    image: `${ASSET}/images/blog-01.jpg`,
  },
  {
    title: "Requests for research",
    excerpt: "Research(ed) questions we want to answer on human-AI collaboration, machine creativity, and the design engineer stack.",
    href: "https://tastelabs.com/blog/requests-for-research",
    image: `${ASSET}/images/blog-02.jpg`,
  },
  {
    title: "Stop debating taste",
    excerpt: "We have to first raise the floor before discussing the ceiling.",
    href: "https://tastelabs.com/blog/stop-debating-taste",
    image: `${ASSET}/images/blog-03.jpg`,
  },
];

export const FOOTER = {
  caption: "Drag a tile",
  title: "Swipe Yes Or No.",
  subtitle: "Play favorites.",
  love: "Love it",
  hate: "Hmm, not so much",
  connect: "Connect",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tastelabs" },
    { label: "Twitter / X", href: "https://x.com/tastelabs" },
  ],
  getInTouch: "Get in touch",
  careers: "Careers",
  email: "hello@tastelabs.com",
  locationLabel: "Location",
  location: "San Francisco, USA",
  community: "Community",
  makers: "Join Taste Makers",
};
