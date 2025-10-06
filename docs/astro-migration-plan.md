# Comprehensive Technical Migration Plan: Kirby → Astro + Decap CMS

## Executive Summary

**Goal:** Migrate joe.sh from Kirby CMS (PHP 5.6) to Astro with Decap CMS
**Timeline:** 2-3 weeks (depending on availability)
**Current State:** 
- 16 blog posts + special pages (home, colophon, error, feed)
- 104 images embedded in content
- Custom KirbyText plugins (forkme, figure, heading)
- SCSS compilation with Grunt
- Docker-based PHP 5.6/Apache deployment

**Target State:**
- Modern TypeScript/Astro static site
- Git-based content with Decap CMS admin UI
- Docker-based deployment on VPS (continuity with existing infrastructure)
- Sub-second build times
- Improved SEO and performance

---

## Phase 1: Repository Setup & Branch Strategy (Day 1)

### 1.1 Create Migration Branch
```bash
cd /Volumes/Docker/joe.sh
git checkout -b astro-migration
```

### 1.2 Create New Astro Project Directory
```bash
# Create new directory for Astro project
mkdir astro-blog
cd astro-blog

# Initialize Astro with TypeScript
npm create astro@latest . -- --template minimal --typescript strict --git false

# Install required dependencies
npm install -D @astrojs/mdx @astrojs/rss @astrojs/sitemap
npm install -D astro-imagetools sharp
npm install -D decap-cms-app
npm install -D sass
npm install reading-time
npm install date-fns
```

### 1.3 Directory Structure
```
/Volumes/Docker/joe.sh/
├── website/              # OLD - Keep running during migration
│   └── public/          # Kirby site (localhost:8090)
├── astro-blog/          # NEW - Astro project
│   ├── src/
│   │   ├── components/
│   │   ├── content/
│   │   │   ├── blog/
│   │   │   └── config.ts
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   │   ├── admin/       # Decap CMS
│   │   └── assets/
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yaml  # Keep for local Kirby testing
└── .gitignore          # Update for both projects
```

### 1.4 Update .gitignore
```bash
# Add to existing .gitignore
echo "
# Astro
astro-blog/node_modules/
astro-blog/dist/
astro-blog/.astro/
astro-blog/.env
astro-blog/.netlify/
" >> .gitignore
```

---

## Phase 2: Astro Configuration (Day 2)

### 2.1 Configure astro.config.mjs
```typescript
// astro-blog/astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  site: 'https://joe.sh',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [imagetools()],
  },
  markdown: {
    shikiConfig: {
      theme: 'tomorrow',
      langs: [],
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
```

### 2.2 Configure Content Collections
```typescript
// astro-blog/src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    short: z.string().optional(),
    date: z.date(),
    status: z.enum(['Published', 'Draft']).default('Draft'),
    theme: z.enum(['blue', 'purple', 'red', 'green', 'yellow', 'white', 'gray', 'darkblue']).optional(),
    code: z.boolean().default(false),
    heroImage: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### 2.3 TypeScript Configuration
```json
// astro-blog/tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

---

## Phase 3: Component Migration (Days 3-4)

### 3.1 Create Base Layout
```astro
// astro-blog/src/layouts/BaseLayout.astro
---
import '@/styles/global.scss';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description, image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Joe Schmitt</title>
  <meta name="description" content={description || "Hi, my name is Joe, I build things with my mind."}>
  
  <link rel="canonical" href={canonicalURL}>
  <link rel="shortcut icon" href="/assets/images/favicon.ico">
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="RSS Feed">
  <link rel="me" href="https://hachyderm.io/@josephschmitt">
  <link rel="me" href="https://mastodon.cloud/@joe">
  
  {/* OpenGraph tags */}
  <meta property="og:type" content="website">
  <meta property="og:url" content={canonicalURL}>
  <meta property="og:title" content={title}>
  {description && <meta property="og:description" content={description}>}
  {image && <meta property="og:image" content={new URL(image, Astro.site)}>}
</head>
<body>
  <slot />
</body>
</html>
```

### 3.2 Create Blog Post Layout
```astro
// astro-blog/src/layouts/BlogPost.astro
---
import BaseLayout from './BaseLayout.astro';
import ArticleHeader from '@components/ArticleHeader.astro';
import Footer from '@components/Footer.astro';
import { formatDate } from '@utils/date';

interface Props {
  title: string;
  subtitle?: string;
  date: Date;
  heroImage?: string;
  theme?: string;
  code?: boolean;
}

const { title, subtitle, date, heroImage, theme, code } = Astro.props;
---

<BaseLayout title={title} description={subtitle}>
  <ArticleHeader 
    title={title} 
    subtitle={subtitle} 
    date={date}
    heroImage={heroImage}
    theme={theme}
  />
  
  <section class="column content">
    <article>
      <slot />
    </article>
    
    <aside>
      <p>Questions or comments? <a href={`https://twitter.com/intent/tweet?screen_name=josephschmitt&text=Re%3A%20${encodeURIComponent(title)}`}>Ping me on Twitter</a></p>
    </aside>
  </section>
  
  <Footer />
</BaseLayout>

{code && <link rel="stylesheet" href="/assets/styles/themes/tomorrow.css">}
```

### 3.3 Create Custom Shortcode Components
```astro
// astro-blog/src/components/Forkme.astro
---
interface Props {
  repo?: string;
  ribbon?: 'lightblue' | 'purple' | 'red' | 'green' | 'yellow' | 'white' | 'gray' | 'darkblue';
}

const { repo = 'josephschmitt', ribbon = 'lightblue' } = Astro.props;
const ribbonMap = {
  lightblue: 'forkme_right_lightblue_729dd6.png',
  purple: 'forkme_right_purple_C272ED.png',
  red: 'forkme_right_red_E3422F.png',
  green: 'forkme_right_green_72EDAD.png',
  yellow: 'forkme_right_yellow_CCE36D.png',
  white: 'forkme_right_white_ffffff.png',
  gray: 'forkme_right_gray_6d6d6d.png',
  darkblue: 'forkme_right_darkblue_121621.png',
};
---

<a id="forkme" href={`https://github.com/${repo}`}>
  <img src={`/assets/images/gh_ribbons/${ribbonMap[ribbon]}`} alt="Fork me on GitHub">
</a>
```

```astro
// astro-blog/src/components/Figure.astro
---
interface Props {
  src: string;
  alt?: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  maxWidth?: string;
}

const { src, alt, caption, align = 'center', width, maxWidth } = Astro.props;
const style = [
  width && `width: ${width}`,
  maxWidth && `max-width: ${maxWidth}`,
].filter(Boolean).join('; ');
---

<figure style={`text-align: ${align}`}>
  <img src={src} alt={alt || caption || ''} style={style} />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

```astro
// astro-blog/src/components/Heading.astro
---
interface Props {
  level?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id: string;
  text: string;
}

const { level = 'h2', id, text } = Astro.props;
const Tag = level;
---

<Tag id={id}>
  <a href={`#${id}`}>{text}</a>
</Tag>
```

### 3.4 Utility Functions
```typescript
// astro-blog/src/utils/date.ts
import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
```

```typescript
// astro-blog/src/utils/reading-time.ts
import readingTime from 'reading-time';

export function getReadingTime(content: string): string {
  const stats = readingTime(content);
  return stats.text;
}
```

---

## Phase 4: Content Migration (Days 5-7)

### 4.1 Content Migration Script
```typescript
// astro-blog/scripts/migrate-kirby-content.ts
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'date-fns';

const KIRBY_CONTENT = '/Volumes/Docker/joe.sh/website/public/content';
const ASTRO_CONTENT = '/Volumes/Docker/joe.sh/astro-blog/src/content/blog';

interface KirbyPost {
  title: string;
  subtitle?: string;
  short?: string;
  date: string;
  status: string;
  theme?: string;
  code?: string;
  text: string;
  folder: string;
}

async function parseKirbyMarkdown(filePath: string): Promise<KirbyPost> {
  const content = await fs.readFile(filePath, 'utf-8');
  const parts = content.split('----').map(p => p.trim());
  
  const fields: Record<string, string> = {};
  for (let i = 0; i < parts.length - 1; i++) {
    const [key, ...valueParts] = parts[i].split(':');
    if (key && valueParts.length) {
      fields[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return {
    title: fields['Title'] || '',
    subtitle: fields['Subtitle'],
    short: fields['Short'],
    date: fields['Date'] || '',
    status: fields['Status'] || 'Draft',
    theme: fields['Theme'],
    code: fields['Code'],
    text: parts[parts.length - 1],
    folder: path.basename(path.dirname(filePath)),
  };
}

function convertKirbyTextToMDX(text: string): string {
  // Convert (forkme: repo ribbon: color) to <Forkme repo="repo" ribbon="color" />
  text = text.replace(/\(forkme:\s*([^\s]+)(?:\s+ribbon:\s*([^\)]+))?\)/g, 
    (_, repo, ribbon) => `<Forkme repo="${repo}" ${ribbon ? `ribbon="${ribbon}"` : ''} />`);
  
  // Convert (figure: src caption: text align: center) to <Figure />
  text = text.replace(/\(figure:\s*([^\s]+)(?:\s+caption:\s*([^)]+?))?\s*(?:align:\s*([^)]+?))?\)/g,
    (_, src, caption, align) => {
      const props = [`src="${src}"`];
      if (caption) props.push(`caption="${caption.trim()}"`);
      if (align) props.push(`align="${align.trim()}"`);
      return `<Figure ${props.join(' ')} />`;
    });
  
  // Convert (heading: text id: myid el: h3) to <Heading />
  text = text.replace(/\(heading:\s*([^)]+?)\s+id:\s*([^\s]+)(?:\s+el:\s*([^\)]+))?\)/g,
    (_, heading, id, level) => `<Heading text="${heading.trim()}" id="${id}" ${level ? `level="${level}"` : ''} />`);
  
  return text;
}

async function migratePost(folderPath: string) {
  const defaultMd = path.join(folderPath, 'default.md');
  
  try {
    const post = await parseKirbyMarkdown(defaultMd);
    
    // Parse date (format: "Aug 29, 2010 11:07pm")
    const dateMatch = post.date.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)/);
    if (!dateMatch) return;
    
    const [, month, day, year] = dateMatch;
    const parsedDate = parse(`${month} ${day} ${year}`, 'MMM d yyyy', new Date());
    const slug = post.folder.replace(/^\d+-/, '');
    const filename = `${parsedDate.toISOString().split('T')[0]}-${slug}.mdx`;
    
    // Convert KirbyText to MDX
    const content = convertKirbyTextToMDX(post.text);
    
    // Check for hero image
    const heroImagePath = path.join(folderPath, 'hero.jpg');
    let heroImage = '';
    try {
      await fs.access(heroImagePath);
      heroImage = `./images/${slug}/hero.jpg`;
      
      // Copy images
      const imageDir = path.join(ASTRO_CONTENT, 'images', slug);
      await fs.mkdir(imageDir, { recursive: true });
      await fs.copyFile(heroImagePath, path.join(imageDir, 'hero.jpg'));
    } catch {}
    
    // Copy all other images
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      if (/\.(jpg|png|gif)$/i.test(file) && file !== 'hero.jpg') {
        const srcPath = path.join(folderPath, file);
        const imageDir = path.join(ASTRO_CONTENT, 'images', slug);
        await fs.mkdir(imageDir, { recursive: true });
        await fs.copyFile(srcPath, path.join(imageDir, file));
      }
    }
    
    // Generate frontmatter
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
${post.subtitle ? `subtitle: "${post.subtitle.replace(/"/g, '\\"')}"` : ''}
${post.short ? `short: "${post.short.replace(/"/g, '\\"')}"` : ''}
date: ${parsedDate.toISOString()}
status: ${post.status}
${post.theme ? `theme: ${post.theme}` : ''}
${post.code === 'true' ? 'code: true' : ''}
${heroImage ? `heroImage: "${heroImage}"` : ''}
---

${content.includes('<Figure') || content.includes('<Forkme') || content.includes('<Heading') ? `
import Figure from '@components/Figure.astro';
import Forkme from '@components/Forkme.astro';
import Heading from '@components/Heading.astro';
` : ''}

${content}`;
    
    // Write to new location
    await fs.writeFile(path.join(ASTRO_CONTENT, filename), frontmatter, 'utf-8');
    console.log(`✓ Migrated: ${filename}`);
    
  } catch (error) {
    console.error(`✗ Failed to migrate ${folderPath}:`, error);
  }
}

async function migrate() {
  // Create destination directory
  await fs.mkdir(ASTRO_CONTENT, { recursive: true });
  await fs.mkdir(path.join(ASTRO_CONTENT, 'images'), { recursive: true });
  
  // Get all post folders
  const items = await fs.readdir(KIRBY_CONTENT);
  
  for (const item of items) {
    const itemPath = path.join(KIRBY_CONTENT, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory() && /^\d+-/.test(item)) {
      await migratePost(itemPath);
    }
  }
  
  console.log('\n✓ Migration complete!');
}

migrate();
```

### 4.2 Run Migration
```bash
cd astro-blog
npm install -D @types/node date-fns
npx tsx scripts/migrate-kirby-content.ts
```

### 4.3 Manual Content Adjustments
After automated migration, manually review:
- Special pages (home, colophon, error)
- Footnotes formatting
- Embedded videos/iframes
- Link references
- Code blocks with custom attributes

---

## Phase 5: Styling Migration (Day 8)

### 5.1 Copy and Update SCSS
```bash
# Copy existing SCSS files
cp -r website/public/site/sass astro-blog/src/styles/

# Update import paths in SCSS files
# Remove Kirby-specific styles
# Update asset paths
```

### 5.2 Global Styles Structure
```
astro-blog/src/styles/
├── global.scss          # Main entry (from common.scss)
├── _variables.scss      # Colors, fonts, breakpoints
├── _typography.scss     # Font styles
├── _layout.scss         # Grid, containers
├── _components.scss     # Buttons, cards, etc
└── themes/
    └── tomorrow.css     # Code highlighting
```

### 5.3 Copy Static Assets
```bash
# Copy fonts
cp -r website/public/assets/fonts astro-blog/public/assets/

# Copy images
cp -r website/public/assets/images astro-blog/public/assets/

# Copy scripts (if still needed)
cp -r website/public/assets/scripts astro-blog/public/assets/
```

---

## Phase 6: Dynamic Pages & RSS Feed (Day 9)

### 6.1 Homepage
```astro
// astro-blog/src/pages/index.astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import Logo from '@components/Logo.astro';

const posts = (await getCollection('blog'))
  .filter(post => post.data.status === 'Published')
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title="Hi, I'm Joe Schmitt">
  <header>
    <Logo />
  </header>
  
  <section id="home" class="column">
    <hgroup>
      <h1>Hi, my name is Joe</h1>
      <h3>
        I build things with my mind at <a href="https://compass.com">Compass</a>. 
        Formerly, I made things <a href="http://madeforhumans.com">for humans</a>. 
        Before that, at <a href="http://vimeo.com">Vimeo</a> I helped make iframes fun again.
      </h3>
    </hgroup>
    
    <nav>
      <ul>
        {posts.map(post => (
          <li>
            <a href={`/${post.slug}/`}>{post.data.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  </section>
</BaseLayout>
```

### 6.2 RSS Feed
```typescript
// astro-blog/src/pages/feed.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const publishedPosts = posts
    .filter(post => post.data.status === 'Published')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Joe Schmitt',
    description: 'Hi, my name is Joe, I build things with my mind.',
    site: context.site!,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.subtitle || '',
      pubDate: post.data.date,
      link: `/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
```

### 6.3 Individual Post Pages
```astro
// astro-blog/src/pages/[...slug].astro
---
import { getCollection } from 'astro:content';
import BlogPost from '@layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>
```

### 6.4 Error Page
```astro
// astro-blog/src/pages/404.astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout title="404 - Page Not Found">
  <section class="column content">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <a href="/">← Back to home</a>
  </section>
</BaseLayout>
```

---

## Phase 7: Decap CMS Setup (Day 10)

### 7.1 Install Decap CMS
```bash
cd astro-blog
npm install decap-cms-app
```

### 7.2 Create Admin Interface
```html
<!-- astro-blog/public/admin/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### 7.3 Configure Decap CMS
```yaml
# astro-blog/public/admin/config.yml
backend:
  name: git-gateway
  branch: main # Will use Git Gateway with authentication

media_folder: "public/assets/images/blog"
public_folder: "/assets/images/blog"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    extension: "mdx"
    format: "frontmatter"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Subtitle", name: "subtitle", widget: "string", required: false }
      - { label: "Short Title", name: "short", widget: "string", required: false }
      - { label: "Publish Date", name: "date", widget: "datetime" }
      - { label: "Status", name: "status", widget: "select", options: ["Published", "Draft"], default: "Draft" }
      - { label: "Theme", name: "theme", widget: "select", options: ["blue", "purple", "red", "green", "yellow", "white", "gray", "darkblue"], required: false }
      - { label: "Has Code", name: "code", widget: "boolean", default: false }
      - { label: "Hero Image", name: "heroImage", widget: "image", required: false }
      - { label: "Description", name: "description", widget: "text", required: false }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: "pages"
    label: "Pages"
    files:
      - label: "Home Page"
        name: "home"
        file: "src/content/pages/home.md"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Greeting", name: "greeting", widget: "string" }
          - { label: "Subtitle", name: "subtitle", widget: "markdown" }
          
      - label: "Colophon"
        name: "colophon"
        file: "src/content/pages/colophon.md"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Body", name: "body", widget: "markdown" }
```

### 7.4 OAuth Setup
**Note:** Decap CMS admin will be available but authentication requires either:
- Netlify Identity (if you add Netlify Git Gateway)
- GitHub OAuth (alternative for self-hosted)
- Manual file editing via Git (always available)

For Docker deployment, consider using GitHub backend instead:
```yaml
# Alternative backend for self-hosted:
backend:
  name: github
  repo: your-username/joe.sh
  branch: main
```

---

## Phase 8: Local Development & Testing (Days 11-12)

### 8.1 Development Commands
```json
// astro-blog/package.json scripts
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "typecheck": "astro check"
  }
}
```

### 8.2 Run Both Systems Simultaneously
```bash
# Terminal 1: Kirby (existing)
cd /Volumes/Docker/joe.sh
docker-compose up
# Access at: http://localhost:8090

# Terminal 2: Astro (new)
cd /Volumes/Docker/joe.sh/astro-blog
npm run dev
# Access at: http://localhost:4321
```

### 8.3 Testing Checklist
- [ ] All blog posts render correctly
- [ ] Hero images display properly
- [ ] Custom components (Forkme, Figure, Heading) work
- [ ] Code syntax highlighting works
- [ ] RSS feed generates correctly
- [ ] Links are not broken
- [ ] Mobile responsive
- [ ] Reading time calculation works
- [ ] 404 page works
- [ ] Meta tags and SEO correct

---

## Phase 9: Docker Deployment Setup (Day 13)

### 9.1 Create Dockerfile for Astro
```dockerfile
# astro-blog/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the site
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 9.2 Create Nginx Configuration
```nginx
# astro-blog/nginx.conf
server {
    listen 80;
    server_name joe.sh;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    gzip_min_length 256;

    # RSS feed redirect
    location = /feed {
        return 301 /feed.xml;
    }

    # FeedPress redirect (preserve from .htaccess)
    location /feed/ {
        if ($http_user_agent !~* "FeedValidator|FeedPress") {
            return 302 http://feedpress.me/joe-sh;
        }
    }

    # Smokescreen redirects
    location = /smk {
        return 301 /bin/smokescreen/index.html;
    }

    location /smk/ {
        rewrite ^/smk/(.*)$ /bin/smokescreen/demos/$1 permanent;
    }

    # Try files, fallback to 404
    location / {
        try_files $uri $uri/ /404.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 9.3 Update Docker Compose
```yaml
# /Volumes/Docker/joe.sh/docker-compose.yaml
version: '3.8'

services:
  # Keep old Kirby site for backup/reference
  kirby:
    build: ./website
    container_name: joe-kirby
    ports:
      - "8090:80"
    volumes:
      - ./website/public:/var/www/html
    profiles:
      - legacy  # Only start with: docker-compose --profile legacy up

  # New Astro site
  astro:
    build: ./astro-blog
    container_name: joe-astro
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    volumes:
      # Optional: Mount SSL certificates if using Let's Encrypt
      - ./certs:/etc/nginx/certs:ro
```

### 9.4 Build and Deploy Script
```bash
# astro-blog/deploy.sh
#!/bin/bash

set -e

echo "Building Astro site..."
npm run build

echo "Building Docker image..."
docker build -t joe-astro:latest .

echo "Stopping old container..."
docker stop joe-astro || true
docker rm joe-astro || true

echo "Starting new container..."
docker run -d \
  --name joe-astro \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  joe-astro:latest

echo "Deployment complete!"
echo "Site available at http://localhost"
```

### 9.5 Environment Variables
```bash
# astro-blog/.env (DO NOT COMMIT)
PUBLIC_SITE_URL=https://joe.sh

# For production on VPS
# Set these in docker-compose.yaml or pass to docker run
```

---

## Phase 10: Content Verification & URL Mapping (Day 14)

### 10.1 URL Structure Comparison
```
Kirby URLs                          Astro URLs
─────────────────────────────────────────────────────────────
/                                   /
/controlling-your-television        /2010-08-29-controlling-television/
/qc-tips                           /2013-05-23-qc-tips/
/feed                              /feed.xml
/colophon                          /colophon/
/error                             /404/
```

### 10.2 Create Redirects for Old URLs
```toml
# Add to netlify.toml
[[redirects]]
  from = "/controlling-your-television"
  to = "/2010-08-29-controlling-television/"
  status = 301

[[redirects]]
  from = "/clamp-js"
  to = "/2010-11-02-clamp-js/"
  status = 301

# ... (add redirect for each post)
```

### 10.3 Generate Redirect Map Script
```typescript
// astro-blog/scripts/generate-redirects.ts
import fs from 'fs/promises';
import path from 'path';

const KIRBY_CONTENT = '/Volumes/Docker/joe.sh/website/public/content';

async function generateRedirects() {
  const items = await fs.readdir(KIRBY_CONTENT);
  const redirects: string[] = [];
  
  for (const item of items) {
    if (/^\d+-/.test(item)) {
      const oldSlug = item.replace(/^\d+-/, '');
      const defaultMd = path.join(KIRBY_CONTENT, item, 'default.md');
      
      try {
        const content = await fs.readFile(defaultMd, 'utf-8');
        const dateMatch = content.match(/Date:\s*([A-Za-z]+\s+\d+,\s+\d+)/);
        
        if (dateMatch) {
          const date = new Date(dateMatch[1]);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          
          const newSlug = `${yyyy}-${mm}-${dd}-${oldSlug}`;
          
          redirects.push(`[[redirects]]
  from = "/${oldSlug}"
  to = "/${newSlug}/"
  status = 301
`);
        }
      } catch {}
    }
  }
  
  console.log(redirects.join('\n'));
}

generateRedirects();
```

---

## Phase 11: Pre-Launch Testing (Day 15)

### 11.1 Local Docker Testing
```bash
cd astro-blog

# Build production version
npm run build

# Build and run Docker container locally
docker build -t joe-astro:test .
docker run -d -p 8080:80 --name joe-astro-test joe-astro:test

# Test at http://localhost:8080
```

### 11.2 Comprehensive Testing
- [ ] Test all redirects from old URLs (http://localhost:8080)
- [ ] Verify RSS feed at /feed.xml
- [ ] Test Decap CMS admin at /admin
- [ ] Check all images load correctly
- [ ] Verify all external links work
- [ ] Test on multiple devices/browsers
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Verify analytics/tracking if applicable
- [ ] Test social media share cards
- [ ] Test nginx configuration (redirects, headers, compression)

### 11.3 Performance Benchmarks
```bash
# Run Lighthouse CLI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:8080
```

Expected scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### 11.4 Clean Up Test Container
```bash
docker stop joe-astro-test
docker rm joe-astro-test
```

---

## Phase 12: Production Deployment (Day 16)

### 12.1 Final Pre-Deploy Checklist
- [ ] All content migrated and verified
- [ ] All redirects configured in nginx.conf
- [ ] Decap CMS tested and working
- [ ] RSS feed verified
- [ ] Analytics configured
- [ ] Error pages tested
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Docker image builds successfully
- [ ] Local Docker testing complete

### 12.2 Deploy to Production VPS
```bash
# On local machine: Push changes to Git
git add .
git commit -m "Complete Astro migration"
git push origin astro-migration

# Create PR and review
gh pr create --title "Migrate to Astro + Decap CMS" --body "Complete migration from Kirby"

# After review, merge to main
gh pr merge --squash

# On VPS: Pull changes and deploy
ssh your-vps

cd /path/to/joe.sh
git pull origin main

# Navigate to astro-blog
cd astro-blog

# Run deployment
chmod +x deploy.sh
./deploy.sh

# Or use docker-compose
cd ..
docker-compose build astro
docker-compose up -d astro
```

### 12.3 DNS Configuration
DNS already points to VPS - no changes needed!
- joe.sh → Your VPS IP (existing)
- Docker container exposed on port 80/443

**If using reverse proxy (recommended):**
Update existing nginx/Apache on VPS to proxy to Docker container:
```nginx
# On VPS main nginx config
upstream astro_blog {
    server localhost:8080;  # Docker container port
}

server {
    listen 80;
    server_name joe.sh;
    
    location / {
        proxy_pass http://astro_blog;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 12.4 SSL Certificate
**Option 1: Use existing Let's Encrypt on VPS (Recommended)**
- Keep SSL termination at VPS nginx/Apache level
- Proxy to Docker container over HTTP
- No changes needed to existing SSL setup

**Option 2: SSL inside Docker container**
```bash
# Mount Let's Encrypt certs into container
docker run -d \
  --name joe-astro \
  -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/nginx/certs:ro \
  joe-astro:latest
```

Update nginx.conf to handle HTTPS:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/certs/live/joe.sh/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/live/joe.sh/privkey.pem;
    # ... rest of config
}
```

---

## Phase 13: Post-Launch (Days 17-21)

### 13.1 Monitoring Setup
```bash
# Setup monitoring
- Docker container health checks
- Uptime monitoring (UptimeRobot / Pingdom)
- Server logs: docker logs joe-astro
- Nginx logs inside container
- Error tracking (Sentry - optional)
```

### 13.2 Week 1 Tasks
- [ ] Monitor error logs
- [ ] Check 404 reports for missing redirects
- [ ] Verify RSS feed subscribers migrated
- [ ] Update social media links if needed
- [ ] Archive old Kirby deployment

### 13.3 Update FeedBurner/FeedPress
```bash
# Update feed URL at FeedPress
Old: http://joe.sh/feed
New: https://joe.sh/feed.xml
```

### 13.4 Backup Strategy
```bash
# Automated backups via Git
- All content in Git repository
- Docker images tagged with versions
- Images stored in Git (or migrate to CDN later)

# Docker image versioning
docker tag joe-astro:latest joe-astro:v1.0.0
docker tag joe-astro:latest joe-astro:$(date +%Y%m%d)

# VPS snapshots
- Create VPS snapshot before migration
- Schedule regular VPS backups

# Optional: Separate image hosting
- Cloudinary / ImageKit for images
- Update image paths in content
```

---

## Phase 14: Cleanup & Documentation (Day 21)

### 14.1 Archive Old Kirby Site
```bash
# Create archive branch
git checkout main
git checkout -b kirby-archive
git push origin kirby-archive

# Update README
# Document migration date
# Keep Docker setup for reference
```

### 14.2 Update Documentation
```markdown
# Create astro-blog/README.md

## Joe.sh - Astro Blog

### Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Content Management
- Admin UI: https://joe.sh/admin
- Login with Netlify Identity

### Deployment
- Auto-deploys from `main` branch
- Preview deploys from PRs
- Hosted on Netlify

### Custom Components
- `<Forkme />` - GitHub fork ribbons
- `<Figure />` - Image figures with captions
- `<Heading />` - Linkable headings

### Content Structure
- Blog posts: `src/content/blog/*.mdx`
- Images: `src/content/blog/images/`
- Pages: `src/content/pages/`
```

### 14.3 Remove Old Dependencies
```bash
# Keep Kirby for reference but update .gitignore
echo "
# Archive (keep for reference only)
website/public/site/cache/
website/public/site/accounts/
" >> .gitignore
```

---

## Rollback Plan

If issues arise post-launch:

### Immediate Rollback (< 1 minute)
```bash
# Stop new Astro container
docker stop joe-astro

# Start old Kirby container
docker-compose --profile legacy up -d kirby

# Update VPS nginx/Apache to proxy to port 8090
# Or reconfigure firewall to expose 8090 as port 80
```

### Quick Fix Deployment
```bash
# If minor issues, fix and redeploy quickly
cd /path/to/joe.sh/astro-blog
git pull
./deploy.sh

# Or rollback to previous image
docker stop joe-astro
docker run -d --name joe-astro -p 80:80 joe-astro:previous-version
```

### Gradual Cutover (Recommended)
```bash
# Run both containers simultaneously during migration
# Kirby on port 8090 (backup)
# Astro on port 80 (production)

# Keep Kirby running for 1-2 weeks as fallback
docker-compose --profile legacy up -d
```

---

## Cost Analysis

### Current (Kirby)
- Server: Variable (VPS hosting)
- Domain: ~$15/year
- SSL: Free (Let's Encrypt)
**Total: ~$15/year + VPS costs**

### New (Astro)
- Hosting: Same VPS (Docker container)
- Domain: ~$15/year  
- SSL: Free (Let's Encrypt - existing)
- Build: Local/on VPS (no build minute costs)
- Decap CMS: Free
**Total: ~$15/year + same VPS costs**

### Cost Savings
- **No new hosting costs** - uses existing VPS infrastructure
- **No vendor lock-in** - fully self-hosted
- **Better resource usage** - static files are lighter than PHP

### Potential Upgrades
- Image CDN (optional): $0-10/mo (Cloudinary/ImageKit)
- Monitoring (optional): $0-10/mo (UptimeRobot free tier available)
- Backup storage (optional): Included in VPS or $5/mo for separate backup solution

---

## Success Metrics

### Performance
- [ ] Lighthouse score 95+ (all categories)
- [ ] Time to First Byte < 200ms
- [ ] First Contentful Paint < 1s
- [ ] Build time < 60s

### SEO
- [ ] All meta tags preserved
- [ ] RSS feed functional
- [ ] Sitemap generated
- [ ] No broken links

### Functionality
- [ ] All posts migrated (16 posts)
- [ ] All images display correctly (104 images)
- [ ] Custom components work
- [ ] Decap CMS admin functional
- [ ] Zero downtime migration

---

## Key Commands Reference

```bash
# Development
npm run dev              # Start dev server (localhost:4321)
npm run build           # Build for production
npm run preview         # Preview production build
npm run typecheck       # TypeScript checking

# Content Migration
npx tsx scripts/migrate-kirby-content.ts     # Migrate Kirby posts

# Docker - Local Testing
docker build -t joe-astro:latest .           # Build image
docker run -d -p 8080:80 --name joe-astro-test joe-astro:latest  # Test locally
docker logs joe-astro-test                   # View logs
docker stop joe-astro-test && docker rm joe-astro-test           # Clean up

# Docker - Production Deployment
./deploy.sh                                  # Full deployment script
docker-compose build astro                   # Build via compose
docker-compose up -d astro                   # Deploy via compose
docker logs -f joe-astro                     # Follow logs

# Both systems running locally
docker-compose --profile legacy up           # Kirby (localhost:8090)
npm run dev                                  # Astro (localhost:4321)

# On VPS
ssh your-vps
cd /path/to/joe.sh && git pull
cd astro-blog && ./deploy.sh
```

---

## Timeline Summary

| Phase | Days | Description |
|-------|------|-------------|
| 1 | 1 | Repository setup, branch strategy |
| 2 | 1 | Astro configuration |
| 3-4 | 2 | Component migration |
| 5-7 | 3 | Content migration & validation |
| 8 | 1 | Styling migration |
| 9 | 1 | Dynamic pages & RSS |
| 10 | 1 | Decap CMS setup |
| 11-12 | 2 | Local testing |
| 13 | 1 | Deployment setup |
| 14 | 1 | URL mapping & redirects |
| 15 | 1 | Pre-launch testing |
| 16 | 1 | Production deployment |
| 17-21 | 5 | Post-launch monitoring |
| **Total** | **21 days** | **Full migration** |

**Accelerated timeline: 10-12 days** (if working full-time)
**Leisurely timeline: 3-4 weeks** (evenings/weekends)

---

## Next Steps

1. **Review this plan** - Ensure it covers all requirements
2. **Create migration branch** - `git checkout -b astro-migration`
3. **Initialize Astro project** - Follow Phase 1
4. **Run content migration script** - Automate bulk of work
5. **Manual refinement** - Polish migrated content
6. **Docker setup** - Create Dockerfile and nginx.conf
7. **Test locally** - Build and run Docker container
8. **Deploy to VPS** - Deploy production container

**Questions before starting?**
- VPS details (OS, existing reverse proxy setup)?
- SSL certificate location (for Docker mounting)?
- Image optimization strategy?
- Analytics/tracking requirements?
- Decap CMS authentication preference (GitHub OAuth vs Netlify Identity)?
