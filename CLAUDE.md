# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppStoreBank Insights is a Next.js 15 media site focused on the Japanese app store liberalization market ("アプリストア自由化"). It provides market analysis, regulatory updates, and industry insights, with a CMS-style admin interface powered by Supabase.

**Important**: Technical deep-dive content is handled by the separate developer portal at https://developer.appstorebank.com. This site focuses on business insights, market analysis, and regulatory compliance.

## Development Commands

```bash
# Development server (port 3001 to avoid conflicts)
npm run dev

# Production build
npm run build

# Production server (port 3001)
npm start

# Linting
npm run lint

# Type checking
npm run type-check

# Deploy to Vercel
npx vercel --prod
```

## Architecture Overview

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase adapter
- **Styling**: Tailwind CSS with custom design tokens
- **Content**: MDX support + Supabase CMS
- **Images**: Unsplash API + Supabase storage
- **Deployment**: Vercel (automatic deploys from main branch)

### Database Schema

#### Articles Table
- Categories: `market_analysis`, `global_trends`, `law_regulation`, `tech_deep_dive`
- Status: `draft`, `published`, `archived`
- Features: `is_featured`, `is_premium` flags
- Technical levels: `beginner`, `intermediate`, `advanced`, `expert`

#### User Roles
- `admin` - Full CMS access
- `developer`, `end_user`, `researcher`, `business_leader` - Content access levels

### Critical Service Integrations

#### Supabase Clients
- **Server-side admin**: Use `getSupabaseAdmin()` from `lib/supabase.ts`
- **Client-side**: Use standard `supabase` client
- **Auth operations**: Always use server-side for security

#### Unsplash Integration
- Handled via `lib/unsplash.ts`
- Fallback to default images when unavailable
- Search categories mapped to content types

### Content Strategy

#### Article Categories
- **market_analysis**: 市場分析 - Industry market reports
- **global_trends**: グローバルトレンド - International developments
- **law_regulation**: 法規制 - Japanese smartphone law updates
- **tech_deep_dive**: Links to developer.appstorebank.com

#### SEO Target Keywords
Primary: "アプリストア自由化", "スマホ新法", "第三者アプリストア"
Secondary: "アプリストア比較", "アプリストアレビュー"

### Admin Interface (`/admin`)

#### Authentication Flow
1. Login at `/admin/login` with email/password
2. Session managed by NextAuth
3. Role-based access control (admin role required)
4. Logout handled at `/admin/logout`

#### Article Management
- Create/Edit: `/admin/articles/new` and `/admin/articles/[id]/edit`
- Preview: `/admin/preview/[id]`
- Bulk operations: Status updates, featured toggles

### Component Architecture

#### Shared Components
- `Header.tsx` - Sticky navigation with dropdown categories
- `Footer.tsx` - Site info and navigation links
- `ArticleCard.tsx` - Article preview cards with proper type handling
- `TableOfContents.tsx` - Scroll-tracking article navigation

#### Article Rendering
- Server-side rendering for SEO
- React Markdown with syntax highlighting (Prism)
- Automatic heading ID generation for TOC
- Reading time calculation

### Environment Configuration

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY     # Server-side admin key
NEXTAUTH_SECRET               # Session encryption
NEXTAUTH_URL                  # Auth callback URL
UNSPLASH_ACCESS_KEY           # Image search API
```

### Security Headers

Production includes:
- HTTPS enforcement via redirects
- CSP headers for XSS protection
- HSTS for transport security
- X-Frame-Options DENY
- Referrer-Policy restrictions

### Image Handling

Logo and favicon locations:
- `/public/logo.png` - Main brand logo
- `/public/favicon.ico` - Browser favicon
- `/public/apple-touch-icon.png` - iOS home screen

Remote image domains allowed:
- `qczwbwhbxyrwasauxhwy.supabase.co`
- `images.unsplash.com`

### Build & Deployment Notes

- Port 3001 used to avoid local conflicts
- TypeScript strict mode enforced
- Vercel auto-deploys from GitHub main branch
- Production domain: insights.appstorebank.com
- `.gitignore` includes `supabase.txt` for security