export type DomainArchetype = 'creative-agency' | 'ai-automation' | 'saas-platform' | 'luxury-craft';

export interface WebJSONTheme {
  accentColor: string;
  background: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  mode: 'dark' | 'light';
  archetype: 'spatial-glass' | 'kinetic-split' | 'bento-hud' | 'editorial-minimal' | 'liquid-webgl';
}

export interface WebJSONMeta {
  brandName: string;
  title: string;
  description: string;
  domainCategory: DomainArchetype;
  tone: 'bold' | 'elegant' | 'technical' | 'playful';
}

export interface WebJSONNavigation {
  logoText: string;
  badge?: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
}

export interface WebJSONHeroSection {
  type: 'hero';
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  metrics?: Array<{ label: string; value: string }>;
}

export interface WebJSONBentoItem {
  title: string;
  desc: string;
  icon?: string;
  outcome?: string;
  badge?: string;
  span?: 'col-span-1' | 'col-span-2' | 'col-span-3';
}

export interface WebJSONBentoSection {
  type: 'bento';
  tag: string;
  title: string;
  subtitle: string;
  items: WebJSONBentoItem[];
}

export interface WebJSONPortfolioItem {
  title: string;
  client: string;
  category: string;
  impact: string;
}

export interface WebJSONPortfolioSection {
  type: 'portfolio';
  tag: string;
  title: string;
  subtitle: string;
  projects: WebJSONPortfolioItem[];
}

export interface WebJSONPricingTier {
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
}

export interface WebJSONPricingSection {
  type: 'pricing';
  tag: string;
  title: string;
  subtitle: string;
  tiers: WebJSONPricingTier[];
}

export interface WebJSONFaqItem {
  q: string;
  a: string;
}

export interface WebJSONFaqSection {
  type: 'faq';
  tag: string;
  title: string;
  faqs: WebJSONFaqItem[];
}

export interface WebJSONTestimonialSection {
  type: 'testimonial';
  tag: string;
  quote: string;
  author: string;
  role?: string;
}

export interface WebJSONCtaSection {
  type: 'cta';
  headline: string;
  subheadline: string;
  ctaText: string;
}

export type WebJSONSection =
  | WebJSONHeroSection
  | WebJSONBentoSection
  | WebJSONPortfolioSection
  | WebJSONPricingSection
  | WebJSONFaqSection
  | WebJSONTestimonialSection
  | WebJSONCtaSection;

export interface WebJSONDocument {
  version: '1.0.0';
  meta: WebJSONMeta;
  theme: WebJSONTheme;
  navigation: WebJSONNavigation;
  sections: WebJSONSection[];
  footer: {
    copyright: string;
    links: Array<{ label: string; href: string }>;
  };
}
