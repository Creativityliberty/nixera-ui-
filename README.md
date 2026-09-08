# Pixera Studio — Curated for Bold Ambition

> Built with the **NümUI WebJSON Modular Architecture** — Next.js 15 App Router, React 19, Three.js WebGL2 spatial glass stack, and Framer Motion v12.

## 📦 Project Architecture

```
src/
├── data/
│   └── experience.json          # WebJSON Source of Truth
├── types/
│   └── webjson.ts               # Universal WebJSON Standard Interfaces
├── components/
│   ├── ExperienceRenderer.tsx   # Dynamic Section Dispatcher
│   ├── ui/
│   │   └── TactileCard.tsx      # Physics-based 3D Tilt Card
│   ├── canvas/
│   │   └── EngineCanvas.tsx     # WebGL Three.js Glass Stack Engine
│   └── sections/
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── PortfolioSection.tsx
│       ├── BentoSection.tsx
│       ├── PricingSection.tsx
│       ├── FaqSection.tsx
│       ├── TestimonialSection.tsx
│       └── Footer.tsx
└── app/
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your experience.

## 🌐 1-Click Deploy to Vercel
Push this repository directly to GitHub and import it into Vercel with standard Next.js preset.
