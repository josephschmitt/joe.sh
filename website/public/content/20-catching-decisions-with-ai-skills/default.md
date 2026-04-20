Title: Using Agent Skills to catch the decisions I didn't realize I was making
----
Short: Catching Decisions with AI Skills
----
Subtitle: The skill I built for code turned out to work just as well for picking a backpack
----
Date: Apr 18, 2026 8:00pm
----
Status: Draft
----

Text:

I tend to bounce around to lots of ideas at once, and these days almost all of my ideating and thinking out loud happens in conversations with AI like Claude. Between a [Monocle](https://joe.sh/reintroducing-monocle) feature that's half in my head and half in a dozen conversations, blog drafts in various stages, and ideas for little tools to sand off some workflow friction, there's always something in flight. The problem is that after I close the tab, those threads basically vanish. A week later I can half-remember that I was working on something, but the actual context of what I decided and what I still needed to come back to is gone.

So I built a small skill that has Claude notice when a conversation is worth tracking and offer to save it as a task in my task manager. I use [Linear](https://linear.app) &mdash; it's not perfect but it works well for me. No workflow change on my side, just a yes or no when Claude suggests it. My own threads can keep falling out of my head, but now they have a place to land when they do.

## What I didn't expect

Most of what this skill catches isn't code.

I spent a good chunk of time this past weekend going back and forth with Claude about which backpack to buy. I wanted something that gave me one-bag-travel at both personal item and carry-on sizes, so I could save some money doing personal item only on quick solo 3-5 day trips while still keeping my hands free without a wheelie suitcase when traveling with the family. The two sizes that fit those constraints were each perfect for one case and awkward for the other, so Claude and I spent a while weighing volume tradeoffs, materials, and how the bag would look packed full versus half-empty. A real decision with meaningful tradeoffs, and none of it had anything to do with code.

When we'd landed on an answer, Claude asked if I wanted to save the decision to Linear so I could find it later.

I wasn't expecting that. I'd written the skill thinking about code projects and blog drafts, things that obviously belong in a tracker, and the bag thread wasn't even on my radar. But of course it mattered. Six months from now when I'm trying to remember why I picked the bag I did, the reasoning would be gone and I'd relitigate the whole thing from scratch.

Once I started paying attention to when the skill fired, I realized I chat with AI about a lot more than code. Just in the last few weeks Claude has helped me think through whether my favorite two Fuji primes cover enough ground to stop carrying around a bigger, heavier alternative, what to replace my Docker Watchtower auto-update service with now that it's been archived, and a handful of other threads that would have been equally worth keeping around.

Consequential decisions happen in exploratory chats all the time, not just technical ones, and the "save this somewhere findable" reflex I already rely on for code turns out to be just as valuable for everything else I end up thinking through.

## Building one for yourself

The obvious move is to share my `SKILL.md` here and let you copy it, but I don't actually think that's useful. A good skill is by definition tuned to the person using it, shaped by whatever conventions you've built up around your own tracker. The interesting thing is the pattern, not my particular implementation.

Here's how I'd build it again if I were starting fresh.

### Read the best practices doc first

Anthropic's [skill authoring best practices doc](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) is the single most useful read before you write anything. It covers description writing that triggers correctly, how to structure the body so it loads progressively instead of all at once, and &mdash; most relevant here &mdash; a whole section on iterating with Claude itself as the author and tester.

### Let Claude write it for you

Here's the move that matters: don't write the `SKILL.md` yourself. Open a Claude conversation and describe your workflow in plain language, telling it what tracker you're using, how your projects and teams are laid out, and when you'd want tracking to kick in versus never, then ask Claude to draft the skill. Claude understands the skill format natively, so your plain-language description is enough to get a well-structured first draft.

The less obvious reason this matters is that Claude isn't only translating your description into a markdown file. It's also bringing architectural knowledge about how skills actually behave that you probably don't have when you start, pushing back on parts of your idea that won't work and flagging gaps you hadn't thought to ask about.

I found this out firsthand, which is the next part of this story.

### The piece I didn't know I needed

When I first described what I wanted, a skill that proactively offers to save a conversation as a Linear task when the thread seems worth tracking, Claude stopped and told me the shape of what I was describing wasn't quite a skill.

Skills get matched against explicit task-shaped user intent, things that are visibly requests like "help me write a function" or "review this PR." They don't reliably fire on ambient signals like "I've been weighing options in this conversation for a while and we're landing on an answer."

What I actually needed, Claude explained, was two pieces working together. The skill would handle the _how_: the shape of a well-formed Linear task and the conventions around which project to route what to. A separate user-level memory edit, a standing instruction that lives in Claude's memory for every conversation, would handle the _when_. The memory edit nudges Claude to notice the shape of a worth-tracking moment and offer the skill, and the skill handles everything that happens after I say yes.

Here's the gist of what my memory edit says:

> When a conversation reaches a decision or makes enough progress on a topic that it seems worth saving, offer to create or update a Linear task. Route it per the conventions in my Linear task-tracking skill. Always confirm before writing.

Without this piece the skill just sits there waiting to be called. With it, the skill fires on its own judgment and I only have to say yes or no.

The part worth lingering on is where the insight came from. If I'd written the skill myself from the docs, I'd probably have spent a day debugging why the thing I built wasn't firing before I figured out that skills alone aren't the right mechanism for ambient triggers. Instead, Claude pointed at the gap before I'd written a single line. That's the actual advantage of having the agent build it: not the typing you don't have to do, but the architectural decisions you don't have to derive on your own.

### Example: what I told Claude about my setup

For what it's worth, here's roughly what I said when bootstrapping mine:

> I use Linear as my personal task tracker. My team key is JJS. The projects I actively route work to are:
>
> - **Blog**: long-form drafts for joe.sh
> - **Public Presence**: short-form posts for LinkedIn, Mastodon, Bluesky, X
> - **Monocle**: my AI code review tool
> - **Shopping**: purchase decisions I want to remember the reasoning for
>
> When we're in a conversation that's clearly a tracked-work thread (a coding project, a blog post I'm drafting, a gear decision I've spent real time on, architectural exploration), offer to save it to Linear. Always confirm before writing. Never create tasks for anything related to my day job. Don't offer tracking for one-off factual questions or quick lookups.

The specifics won't help you; it's the shape of the prompt that matters. Describe your own setup to Claude in plain language and let it translate that into a `SKILL.md`, and if your setup has a gap like mine did, it'll tell you what else you need.

### Packaging and uploading

A skill is a folder containing `SKILL.md` and optionally other files. To get it into Claude, zip the folder and upload it at Settings → Capabilities → Skills in [claude.ai](https://claude.ai).

If you want a shortcut for the packaging step, plus tooling around validation and iteration, Anthropic ships a [`skill-creator` skill](https://github.com/anthropics/skills/tree/main/skills/skill-creator) that handles scaffolding, frontmatter validation, packaging, and optional measurement of how well your skill actually triggers. It's not required, but if you're going to build more than one skill it takes some of the fiddly bits out.

When you're iterating, delete the previous version before uploading a new one, since two versions of the same skill fighting over triggers will make the behavior confusing.

## A small friction point, solved

I love finding these little friction points to solve. The best ones are often boring, just a markdown file and a memory edit working together in the background, nothing that would show up on a roadmap. But they compound, and the workflow I have now feels measurably better than the one I had two weeks ago.

If you build your own version of this, I'd love to hear what you tuned it for.
