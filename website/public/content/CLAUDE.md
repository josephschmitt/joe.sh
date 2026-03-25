# Blog Post Writing Guide

## Voice and Tone

These blog posts are written in first person by a senior software engineer writing for other developers. The tone is conversational and confident without being showy. Think "explaining something interesting to a friend who's also technical" rather than "writing documentation" or "pitching a product."

### Sentence Structure

- Prefer longer, flowing sentences that connect ideas with commas, subordinate clauses, and natural conjunctions. Avoid the short-sentence-short-sentence-short-sentence staccato pattern that reads as robotic.
- BAD: "It's fast. It's simple. It works."
- GOOD: "It's fast, simple, and works without much fuss."
- BAD: "This is fundamentally different. The agent doesn't poll. It just receives the event."
- GOOD: "This is fundamentally different from polling because the agent just receives the event directly."

### Em Dashes

Use em dashes (`--` in these posts) sparingly. One or two per section is fine for a genuine aside or parenthetical. Do NOT use them as a crutch to glue short clauses together. If you find yourself using `--` more than twice in a paragraph, rewrite with commas, colons, semicolons, or by restructuring the sentence.

- BAD: "It handles the basics -- staging, committing, pushing -- but also the advanced stuff -- rebases, hunks, stashes -- without touching the mouse."
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

Posts use `----` as field separators:

```
Title: The Post Title
----
Short: Short Slug
----
Subtitle: One-line description of the post
----
Date: Mon DD, YYYY
----
Status: Published
----

Text:
```

Required fields: Title, Short, Subtitle, Date, Status. The `Text:` marker begins the body.

### Directory Convention

Posts live in numbered directories: `##-slug-name/default.md` (e.g., `19-monocle/default.md`). The number is sequential. Assets (images, downloads) go in the same directory.

### Content Structure

Posts typically follow this arc for project announcements:

1. **Motivation**: What problem existed, what was the friction in the previous workflow, what was missing. Connect to existing posts or tools where relevant.
2. **What the tool does**: High-level overview of the solution.
3. **Technical deep-dives**: Individual sections on key features or architectural decisions. These should explain the "why" behind decisions, not just list features.
4. **Practical details**: Configuration, installation, getting started.
5. **Broader perspective** (optional): Where this fits in a larger ecosystem or what patterns it enables beyond the immediate use case.

### Custom Syntax

- Figures: `(figure: filename.ext alt: alt text)`
- Links: Standard markdown `[text](url)`
- Code blocks: Standard triple-backtick with language identifier
