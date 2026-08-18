export type NavLink = { label: string; href: string };

export type Job = {
  title: string;
  location: string;
  type: string;
  mode: string;
  group: "Creative Team" | "Product & operations staff" | "Technical staff";
};

export type BlogCard = {
  title: string;
  excerpt: string;
  href: string;
  image: string;
};

export type ProductCard = {
  title: string;
  body: string;
};
