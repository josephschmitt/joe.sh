# Blog Post Writing Guide

## Voice and Tone

These blog posts are written in first person by a principal software engineer writing for other developers. The tone is conversational and confident without being showy. Think "explaining something interesting to a friend who's also technical" rather than "writing documentation" or "pitching a product."

### Sentence Structure

- Prefer longer, flowing sentences that connect ideas with commas, subordinate clauses, and natural conjunctions. Avoid the short-sentence-short-sentence-short-sentence staccato pattern that reads as robotic.
- BAD: "It's fast. It's simple. It works."
- GOOD: "It's fast, simple, and works without much fuss."
- BAD: "This is fundamentally different. The agent doesn't poll. It just receives the event."
- GOOD: "This is fundamentally different from polling because the agent just receives the event directly."

### Em Dashes

Use em dashes (`&mdash;` in these posts, which renders as —) sparingly. One or two per section is fine for a genuine aside or parenthetical. Do NOT use them as a crutch to glue short clauses together. If you find yourself using `&mdash;` more than twice in a paragraph, rewrite with commas, colons, semicolons, or by restructuring the sentence. For en dashes (ranges, etc.), use `&ndash;`.

- BAD: "It handles the basics &mdash; staging, committing, pushing &mdash; but also the advanced stuff &mdash; rebases, hunks, stashes &mdash; without touching the mouse."
- GOOD: "It handles the basics like staging, committing, and pushing, but also makes the advanced stuff easy. Interactive rebases, staging individual hunks, managing stashes, switching branches: all of it's just a few keystrokes away."

### Things to Avoid

- **Tricolon patterns**: "No X, no Y, no Z" or "It's X. It's Y. It's Z." These are AI writing tells. Restructure into a single flowing sentence.
- **Trailing summaries**: Don't end sections with a sentence that restates what you just said. The reader can see the content.
- **Marketing voice**: Don't sell. Describe what the thing does and why it matters. Let the reader decide if it's interesting.
- **"That's where X comes in"**: Use sparingly (once per post at most). Find other ways to introduce a tool or concept.
- **Over-hedging**: Don't say "I think" or "in my opinion" before every claim. Just state it.

### Things That Work

- Personal anecdotes about what motivated building something or why a particular decision was made.
- Concrete examples: show a command, a config snippet, a one-liner, then explain what it does.
- Giving credit to tools and projects that inspired the work.
- Acknowledging tradeoffs honestly rather than pretending everything is perfect.
- Using _italics_ for emphasis on specific words, especially when contrasting ideas ("you can review the agent's _thinking_ before it writes code, not just the output").

## Blog Post Structure

### Frontmatter Format

Posts are Markdown files with YAML frontmatter:

```
---
title: The Post Title
short: Short Slug
subtitle: One-line description of the post
date: 2026-02-02T12:00:00.000Z
status: Published
---

Body of the post...
```

Required fields: `title`, `short`, `subtitle`, `date`, `status`. Dates are UTC timestamps. Optional fields: `theme` (blue, green, purple, yellow, red) colors the header on posts with a hero image, `code: true` loads the code highlighting stylesheet, and `link` turns the post into a link post whose title points at that URL. A post with any `status` other than `Published` is a draft: it builds, but it is left off the home page and the feed in production.

### Directory Convention

Posts live in numbered directories under `src/posts`: `NN-slug/index.md` (e.g., `19-monocle/index.md`). The number orders posts on the home page, highest first. The slug is the URL: `19-monocle` is published at `/monocle/`. Assets (images, downloads) go in the same directory and are published next to the post, so a figure can reference `screenshot.png` by name. A `hero.jpg` in the directory becomes the full-width header image; its credit, alignment and other details go under a `hero:` key in the frontmatter.

### Content Structure

Posts typically follow this arc for project announcements:

1. **Motivation**: What problem existed, what was the friction in the previous workflow, what was missing. Connect to existing posts or tools where relevant.
2. **What the tool does**: High-level overview of the solution.
3. **Technical deep-dives**: Individual sections on key features or architectural decisions. These should explain the "why" behind decisions, not just list features.
4. **Practical details**: Configuration, installation, getting started.
5. **Broader perspective** (optional): Where this fits in a larger ecosystem or what patterns it enables beyond the immediate use case.

### Custom Syntax

- Figures: `(figure: filename.ext alt: alt text)`
- Section headings with anchors: `(heading: Section Title id: section-title)`
- GitHub ribbon: `(forkme: josephschmitt/repo)`
- Downloads: `(file: archive.zip text: link text)`
- Links: Standard markdown `[text](url)`
- Footnotes: `[^1]` in the text and `[^1]: Note` at the end of the post
- Code blocks: Standard triple-backtick with language identifier

## Building

`npm run serve` previews the site with drafts visible; `npm run build` produces the production site in `_site/`.
