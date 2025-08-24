# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppStoreBank Insights is a Next.js 15 media site providing professional insights about the app store industry, market analysis, and regulatory compliance (especially Japan's "スマホ新法" smartphone regulation). The site features a CMS-style admin interface with Supabase backend for content management.

## Development Commands

```bash
# Development server (runs on port 3001)
npm run dev

# Production build
npm run build

# Production server (port 3001)
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase adapter
- **Styling**: Tailwind CSS with custom design system
- **Content**: MDX support for articles
- **Images**: Unsplash integration + Supabase storage
- **Deployment**: Vercel

### Key Directories
```
src/
├── app/                 # App Router pages
│   ├── admin/          # Admin dashboard & CMS
│   ├── articles/       # Public article pages
│   └── api/            # API routes (OG images, etc.)
├── components/         # Reusable UI components
├── lib/               # Utilities & services
├── types/             # TypeScript definitions
└── content/           # Static MDX content
```

### Database Architecture
- **articles**: Main content with categories (market_analysis, global_trends, law_regulation, tech_deep_dive)
- **profiles**: User management with roles (admin, developer, end_user, etc.)
- **subscription tiers**: free, starter, professional, enterprise

### Path Aliases
```typescript
@/* -> ./src/*
@/components/* -> ./src/components/*
@/lib/* -> ./src/lib/*
@/types/* -> ./src/types/*
@/styles/* -> ./src/styles/*
@/content/* -> ./src/content/*
```

## Content Management

### Article System
- Articles support both database storage and static MDX files
- Categories: market_analysis, global_trends, law_regulation, tech_deep_dive
- Premium content flag for subscription features
- Featured articles system with `is_featured` flag
- Slug-based routing: `/articles/[slug]`

### Admin Interface
- Dashboard at `/admin` with authentication required
- Article management: create, edit, publish, draft
- User management and analytics
- Uses role-based permissions (admin role required)

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
UNSPLASH_ACCESS_KEY=
```

## Security Configuration
- Comprehensive Content Security Policy headers
- HTTPS enforcement in production
- Secure image optimization settings
- XSS and CSRF protection enabled

## Design System
- Custom AppStoreBank light theme with primary (#3399ff) and secondary (#ff3399) colors
- Extensive color palette with accent variants (mint, peach, lavender, sky, coral)
- Typography optimized for Japanese content (Noto Sans JP)
- Glass-morphism and gradient effects throughout

## Development Notes
- Port 3001 is used to avoid conflicts
- TypeScript strict mode enabled
- MDX processing with custom plugins
- Image optimization for Supabase and Unsplash domains
- Server-side admin functions use `getSupabaseAdmin()`
- Client-side uses standard `supabase` client

## Testing & Deployment
- Lint and type-check before deployment
- Vercel deployment with automatic builds
- Production domain: insights.appstorebank.com
- Automatic HTTP to HTTPS redirects in production