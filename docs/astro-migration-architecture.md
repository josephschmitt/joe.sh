# Astro Migration Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CURRENT ARCHITECTURE (Kirby)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐      ┌─────────────────┐      ┌──────────────────┐   │
│  │   Browser    │─────▶│  Apache/PHP 5.6 │─────▶│  File System     │   │
│  │              │◀─────│  (Docker:8090)  │◀─────│  - content/*.md  │   │
│  └──────────────┘      │                 │      │  - site/snippets │   │
│                        │  Kirby CMS      │      │  - site/plugins  │   │
│                        │  - Templates    │      │  - site/config   │   │
│                        │  - KirbyText    │      └──────────────────┘   │
│                        │  - Disk Cache   │                              │
│                        └─────────────────┘                              │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

                                    ↓ MIGRATION ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                      NEW ARCHITECTURE (Astro + Decap)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PRODUCTION (Static Hosting - Netlify/Vercel/Cloudflare Pages)          │
│  ┌──────────────┐      ┌─────────────────────────────────────────┐     │
│  │   Browser    │─────▶│         CDN Edge Nodes                  │     │
│  │              │◀─────│  - Pre-rendered HTML/CSS/JS              │     │
│  └──────────────┘      │  - Optimized Images                      │     │
│                        │  - RSS Feed (static XML)                 │     │
│                        └─────────────────────────────────────────┘     │
│                                         ▲                                │
│                                         │ Deploy                         │
│                                         │                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Build Process (CI/CD)                        │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Git Push → Netlify/Vercel Build                         │  │   │
│  │  │  1. npm install                                           │  │   │
│  │  │  2. astro build                                           │  │   │
│  │  │  3. Generate static site → dist/                          │  │   │
│  │  │  4. Deploy to CDN                                         │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  CONTENT MANAGEMENT                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Decap CMS Admin (/admin)                                       │   │
│  │  ┌──────────────┐      ┌─────────────────────────────────┐     │   │
│  │  │  Admin UI    │─────▶│  Git Gateway (OAuth)            │     │   │
│  │  │  - WYSIWYG   │      │  - Create/Edit Posts            │     │   │
│  │  │  - Media Mgmt│      │  - Upload Images                │     │   │
│  │  │  - Preview   │      │  - Auto-commit to Git           │     │   │
│  │  └──────────────┘      └─────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                         │                                │
│                                         ▼                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  Git Repository Structure                       │   │
│  │                                                                  │   │
│  │  /astro-blog                                                     │   │
│  │  ├── src/                                                        │   │
│  │  │   ├── content/                                               │   │
│  │  │   │   └── blog/            ← Migrated .md files             │   │
│  │  │   │       ├── 2010-08-29-controlling-television.md          │   │
│  │  │   │       └── images/       ← Migrated images               │   │
│  │  │   ├── components/           ← Kirby snippets → Astro        │   │
│  │  │   ├── layouts/                                               │   │
│  │  │   └── pages/                                                 │   │
│  │  ├── public/                   ← Static assets                 │   │
│  │  └── astro.config.mjs                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  DEVELOPMENT (Local)                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  npm run dev → http://localhost:4321                            │   │
│  │  - Hot reload                                                    │   │
│  │  - TypeScript checking                                           │   │
│  │  - Local Decap CMS at /admin                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

PARALLEL RUNNING SETUP (During Migration):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  joe.sh (Kirby - Production)          astro.joe.sh (Preview)            │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │  Docker: localhost:8090      │    │  Netlify Deploy Preview      │  │
│  │  Branch: main                │    │  Branch: astro-migration     │  │
│  │  /website/public             │    │  /astro-blog                 │  │
│  └──────────────────────────────┘    └──────────────────────────────┘  │
│                                                                           │
│  DNS Cutover Plan:                                                       │
│  1. Phase 1: Test on astro.joe.sh (Netlify preview)                     │
│  2. Phase 2: Migrate content, verify all pages                          │
│  3. Phase 3: Update DNS joe.sh → Netlify                                │
│  4. Phase 4: Setup redirects for old URLs                                │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Mapping: Kirby → Astro

```
Kirby                          →  Astro
─────────────────────────────────────────────────────────────────────────
/site/templates/default.php    →  src/layouts/BlogPost.astro
/site/templates/home.php        →  src/pages/index.astro
/site/templates/feed.php        →  src/pages/feed.xml.ts

/site/snippets/head.php         →  src/components/Head.astro
/site/snippets/footer.php       →  src/components/Footer.astro
/site/snippets/article.php      →  src/components/Article.astro

/site/plugins/kirbytext.*.php   →  src/components/shortcodes/
                                   - Forkme.astro
                                   - Figure.astro
                                   - Heading.astro

/content/XX-post-name/          →  src/content/blog/YYYY-MM-DD-post-name.md
  - default.md                     (frontmatter + content)
  - hero.jpg                    →  src/content/blog/images/post-name/hero.jpg

/site/config/config.php         →  astro.config.mjs + .env
```
