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

# Kill port if occupied
npx kill-port 3001
```

## Architecture Overview

### Core Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL) with JSONB support
- **Authentication**: NextAuth.js with Supabase adapter
- **Styling**: Tailwind CSS with custom design tokens
- **Content**: MDX support + Supabase CMS with React Markdown + remark-gfm for table support
- **Images**: Unsplash API + Supabase storage
- **Deployment**: Vercel (automatic deploys from main branch)
- **TypeScript**: Strict mode enforced
- **Analytics**: Google Analytics 4 (GA4) integration

### Database Schema

#### Articles Table
```sql
- id: UUID
- slug: string (unique)
- title: string
- subtitle: string (optional)
- content: text (Markdown with GFM table support)
- excerpt: string (optional)
- category: enum ('market_analysis', 'global_trends', 'law_regulation', 'tech_deep_dive')
- status: enum ('draft', 'published', 'archived')
- is_featured: boolean
- is_premium: boolean
- external_sources: JSONB array (URLs)
- tags: text array
- technical_level: enum ('beginner', 'intermediate', 'advanced', 'expert')
- view_count: integer
- reading_time: integer
- cover_image_url: string (optional)
- published_at: timestamp
```

#### App Stores Table
```sql
- id: UUID
- name: string
- slug: string (unique)
- description: text
- logo_url: string
- website_url: string
- status: enum ('available', 'coming_soon', 'planning', 'discontinued')
- commission_rate: string
- features: JSONB
- launch_date: date
- company: string
```

#### Categories Table (Dynamic)
```sql
- id: UUID
- slug: string (unique)
- name: string
- display_name: string
- description: text
- is_active: boolean
- sort_order: integer
```

### Critical Service Integrations

#### Supabase Clients
- **Server-side admin**: Use `getSupabaseAdmin()` from `lib/supabase.ts`
- **Client-side**: Use standard `supabase` client
- **Auth operations**: Always use server-side for security
- **Migrations**: SQL files in `/migration_*.sql` and `/supabase/migrations/`

#### Unsplash Integration
- Handled via `lib/unsplash.ts`
- Category-specific keyword mappings in `categoryImageKeywords`
- Fallback to default images when unavailable
- Used in article cover images via `ImageSelector` component

### Content Management

#### Article Categories
- **market_analysis**: 市場分析 - Industry market reports
- **global_trends**: グローバルトレンド - International developments
- **law_regulation**: 法規制 - Japanese smartphone law updates
- **tech_deep_dive**: 技術解説 - Links to developer portal

#### Admin Routes (`/admin/*`)
- `/admin/login` - Email/password authentication
- `/admin/articles` - Article management dashboard
- `/admin/articles/new` - Create new article
- `/admin/articles/[id]/edit` - Edit existing article
- `/admin/preview/[id]` - Preview before publishing
- `/admin/app-stores` - App store management
- `/admin/drafts` - Draft articles
- `/admin/analytics` - Site analytics

### Component Architecture

#### Key Components
- `Header.tsx` - Unified sticky navigation with dropdown categories
- `BlogHero.tsx` - Homepage featured article display
- `ArticleCard.tsx` - Article preview cards with author info
- `TableOfContents.tsx` - Scroll-tracking article navigation with auto-hide on mobile
- `ImageSelector.tsx` - Unsplash image search integration
- `CategoryFilter.tsx` - Article filtering by category with dynamic counts
- `GoogleAnalyticsWrapper.tsx` - GA4 tracking integration
- `ScrollToTopButton.tsx` - Progress indicator and scroll-to-top functionality

#### Article Rendering Pipeline
1. Server-side data fetching via `getArticleBySlug()`
2. Markdown processing with React Markdown
3. Syntax highlighting with Prism (vscDarkPlus theme)
4. Automatic heading ID generation for TOC
5. External sources display as numbered references
6. Reading time calculation based on content length

### Path Aliases (TypeScript)
```typescript
@/* -> ./src/*
@/components/* -> ./src/components/*
@/lib/* -> ./src/lib/*
@/types/* -> ./src/types/*
```

### Environment Variables

Required for production:
```bash
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY     # Server-side admin key (never expose)
NEXTAUTH_SECRET               # Session encryption
NEXTAUTH_URL                  # Auth callback URL
UNSPLASH_ACCESS_KEY           # Image search API
```

### Security Configuration

#### Headers (next.config.js)
- X-Frame-Options: DENY
- HSTS with preload
- CSP for XSS protection
- HTTPS enforcement in production
- Referrer-Policy restrictions

#### SEO Configuration
- Dynamic sitemap generation at `/sitemap.xml`
- robots.txt with admin directory exclusion
- Open Graph and Twitter Card metadata
- Structured data for articles

#### Image Domains
Allowed remote patterns:
- `qczwbwhbxyrwasauxhwy.supabase.co`
- `images.unsplash.com`

### Deployment

- **Production**: https://insights.appstorebank.com
- **GitHub**: https://github.com/NEXT-STANDARD/appstorebank-insights
- **Vercel**: Auto-deploys from main branch
- **Port**: 3001 (both dev and production)

### Recent Features

1. **External Sources**: Articles can reference external URLs stored as JSONB array
2. **Dynamic Categories**: Admin-configurable categories with custom display names
3. **Featured Articles**: Homepage hero section pulls from `is_featured` flag
4. **Markdown Tables**: Full GFM table support via remark-gfm plugin
5. **SEO Enhancements**: Dynamic sitemap, robots.txt, and structured data
6. **Google Analytics**: GA4 integration with custom events tracking

### Database Migrations

Pending migrations are in `/migration_*.sql` files:
- `migration_add_external_sources.sql` - Adds JSONB external sources to articles
- `migration_add_is_featured.sql` - Adds featured flag to articles
- `supabase/migrations/create_app_stores_table.sql` - App stores schema

Apply via Supabase SQL Editor in order.