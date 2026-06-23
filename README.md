# CoverLetter AI 📝🤖

CoverLetter AI is a world-class, premium AI SaaS application built using Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, MongoDB, and NextAuth. It helps job seekers generate tailored, professional, and ATS-optimized cover letters in seconds.

---

## 🌟 Key Features

- **🚀 Cinematic Landing Page**: Premium Vercel-like landing page featuring scroll-triggered timelines, testimonials, pricing tables, and interactive text-typing previews.
- **🔐 Secure Credentials Authentication**: Hashed password storage (`bcryptjs`), complete registration, custom session token mapping, and NextAuth route protection.
- **🗂️ Interactive Dashboard**:
  - Live weekly generation analytics line chart (SVG render).
  - Modern list/table of cover letters with query search, filters, and status toggles.
  - Custom modals for Document Creation, Editing, and deletion confirmation.
- **⚡ Next.js 16 Proxy Protection**: Secured path proxying mapping to `/dashboard/*` via standard Auth handlers.
- **✨ Real-time AI Generation Effect**: Live text typing effect that simulates real-time AI writing from models.
- **🔧 Multi-Provider AI Abstraction**: Layered provider module architecture allowing seamless swap-in of OpenAI, Anthropic, and Google Gemini.

---

## 🛠️ Architecture & Tech Stack

- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, custom glassmorphism panels, ambient particle blurs
- **Authentication**: NextAuth (CredentialsProvider)
- **Database**: MongoDB Atlas via Mongoose
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms & Validation**: React Hook Form + Zod

---

## 📂 Project Structure

```text
cover_letter_AI/
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # App Router files
│   │   ├── api/            # API Endpoints
│   │   │   ├── auth/       # Auth routes (NextAuth, Register)
│   │   │   ├── coverletters/# CRUD routes (base, detailed [id])
│   │   │   └── generate/   # AI routing generator
│   │   ├── dashboard/      # Secured main app workspace
│   │   ├── login/          # Split-screen Login form
│   │   ├── register/       # Premium Register form
│   │   ├── globals.css     # Dark Slate theme variables & design tokens
│   │   └── layout.tsx      # Fonts & Providers wrapper
│   ├── components/
│   │   └── Providers.tsx   # SessionProvider & Sonner Toaster
│   ├── lib/
│   │   ├── auth-options.ts # NextAuth configurations
│   │   └── mongodb.ts      # Mongoose connection cached instance
│   ├── models/
│   │   ├── CoverLetter.ts  # CoverLetter mongoose schema
│   │   └── User.ts         # User credentials schema
│   ├── providers/          # AI Abstraction Layer
│   │   ├── types.ts        # Generation param definitions
│   │   ├── mock.ts         # Multi-paragraph mock generator
│   │   ├── openai.ts       # OpenAI mini model integration
│   │   ├── anthropic.ts    # Anthropic Sonnet model integration
│   │   └── gemini.ts       # Google Gemini 2.5 Flash API connector
│   ├── services/
│   │   └── ai-generator.ts # Active AI provider router
│   ├── store/
│   │   └── useStore.ts     # Zustand client dashboard state
│   └── proxy.ts            # Next.js 16 proxy middleware routing guard
├── .env.local              # Local environment credentials config
├── package.json            # Scripts and packages map
├── tsconfig.json           # TS configurations
└── vercel.json             # Vercel deployment specifications
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (LTS v20+ recommended) and npm installed:
```bash
node -v
npm -v
```

### Installation

1. Install project dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Configure environment credentials inside `.env.local` (copy from `.env.example` first):
   ```bash
   # Copy sample
   cp .env.example .env.local
   ```
   Modify variables to match your MongoDB URI, NextAuth secret, and AI provider key.

### Development Server

Run the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application in action.

### Production Build

Compile the production build:
```bash
npm run build
```

Run the built server locally:
```bash
npm run start
```
