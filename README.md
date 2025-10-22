# MonaKit

An Astro theme featuring multi-format content including knowledge cards, articles, slide presentations, and doodle announcements.

## Features

- **Knowledge Cards**: Research summaries and insights with customizable themes
- **Articles**: Blog posts and long-form content
- **Slide Presentations**: Interactive slides with reveal.js
- **Doodles**: Running log of releases, experiments, and announcements (Mona Pulse)
- **Search**: Pagefind-powered search with full-text indexing

## Tech Stack

- Astro 5 with SSR (Vercel deployment)
- React 19 with Radix UI and Lucide icons
- TailwindCSS 4
- Reveal.js 5.2 for presentations
- Anime.js 4 for animations
- Pagefind for static search indexing

## How to Use

```bash
npm create astro@latest my-astro-project -- --template monakit/monakit
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build search index (runs automatically on build)
npm run build:search-index

# Code quality
npm run check
npm run fix

# Build for production (auto-builds search index)
npm run build
```

### Note

The search index is automatically built during production builds (via prebuild hook). For development, run `npm run build:search-index` manually to generate the search index.

## Content Structure

- **Knowledge Cards**: `src/content/cards/` - Research summaries in Markdown
- **Blog Articles**: `src/content/blogs/` - Long-form content
- **Slide Presentations**: `src/content/slides/` - Markdown-based slides for reveal.js
- **Doodles**: `src/content/doodles/` - Announcements with date ranges
