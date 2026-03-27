Title: Monocle - Real-Time Code Review for AI Agents
----
Short: Monocle
----
Subtitle: A terminal UI for reviewing AI-generated code as it's written, powered by MCP channels
----
Date: Mar 25, 2026 5:08pm
----
Status: Published
----

Text:

The more I use AI coding agents, the more I realize that the weakest part of the workflow isn't the code generation. It's the review. The agent writes something, you get a diff, and then you're left choosing between a few unsatisfying options: rubber-stamp it and hope for the best, copy-paste your feedback into a chat window and wait for the next iteration, or just accept that you're going to miss things because the friction of reviewing is too high.

None of those feel right. Code review exists for a reason, and the fact that the code was written by an AI doesn't make it less important to review. If anything, it makes it _more_ important. But the tooling hasn't caught up. There's no equivalent of a GitHub PR review for code that an agent is writing in real time, right in front of you.

That's the problem [Monocle](https://github.com/josephschmitt/monocle) is trying to solve.

## What Monocle Does

Monocle is a terminal UI that lets you review AI-generated diffs as they happen. You run it alongside Claude Code in a separate terminal, and it shows you every file the agent touches with proper syntax-highlighted diffs, line-level commenting, and structured feedback submission.

The basic flow is straightforward: Claude Code works in one terminal, Monocle runs in another. As the agent writes code, the diffs appear in Monocle in real time. You browse through the changed files, leave comments on specific lines tagged as issues, suggestions, or notes, and submit your review when you're ready. The feedback flows directly into Claude Code's context, and the agent addresses it without you having to switch windows or retype anything.

It's the review loop that was missing from agent-assisted development. A way to give structured, line-level feedback without slowing the agent down or breaking your own flow.

## Implementation Details: Or How I Abused MCP Channels

The piece of this I'm most excited about is _how_ the feedback gets from Monocle to Claude Code. It uses [MCP channels](https://code.claude.com/docs/en/channels), a relatively new feature in Claude Code that I think opens up some genuinely interesting possibilities.

If you've used [MCP (Model Context Protocol)](https://modelcontextprotocol.io) before, you're probably familiar with the standard pattern: you set up an MCP server that exposes tools, Claude calls those tools when it needs to, and the communication is entirely pull-based. Claude reaches out to the server, does something, and comes back. The server can't push anything to Claude on its own.

Channels flip that model. A channel is an MCP server that can push events _into_ a running Claude Code session. The agent doesn't have to poll for updates or stop to ask "do you have feedback for me?" The event just arrives in context, and the agent reacts to it.

The official use cases for channels are things like chat bridges (Telegram, Discord) and webhook receivers (CI results, monitoring alerts). But when I looked at the feature, I saw something else: a way to build a real-time feedback loop between a human reviewer and an AI agent.

Here's how Monocle's architecture works:

```
Claude Code ←→ MCP Channel (channel.ts) ←→ Monocle TUI
```

Claude Code communicates with a lightweight MCP channel server over stdio. That server connects to the Monocle TUI through a Unix domain socket. When you submit a review in Monocle, the feedback is formatted and pushed through the channel as a notification, and Claude Code receives it immediately. No polling, no waiting, no copy-pasting.

This is fundamentally different from how most agent feedback works. In a typical setup, you'd either interrupt the agent to give feedback (which breaks its flow) or wait until it's done and then point out everything it got wrong (which wastes the work it did in the wrong direction). With channels, the feedback arrives asynchronously and the agent can incorporate it naturally as part of its ongoing work. It's almost like having a reviewer sitting next to you leaving comments as you type.

## Diff Viewing

The diff viewer is where you'll spend most of your time, so I put a lot of work into making it comfortable.

It supports unified, side-by-side (split), and raw file modes with syntax highlighting and intra-line diffs that highlight the exact characters that changed. You can toggle line wrapping, scroll horizontally through long lines, and adjust how many lines of surrounding context are shown. There's also a ref picker that lets you change the base comparison on the fly, so you can compare against a different branch or commit without restarting.

Files are displayed in either a tree view that mirrors your project structure or a flat list, and you can collapse or expand directories in tree mode. The sidebar is toggleable with `\`, and you can jump between sections with `{`/`}`. Markdown files get rendered with styled headings, lists, and code blocks rather than showing raw markup.

The layout is responsive and automatically switches between side-by-side and stacked views depending on your terminal width, though you can override this manually. Mouse support is fully integrated as well: click to focus panes, scroll with the wheel, click files to select them, and drag to make visual selections. It's keyboard-first, but the mouse is there when you want it.

## The Review Loop

Leaving feedback in Monocle works a lot like leaving comments on a PR:

- Press `c` on any line to add a comment. Each comment gets a tag: issue, suggestion, note, or praise.
- Use `v` to visually select a range of lines and comment on the whole block.
- Press `C` for file-level comments when your feedback applies to the whole file rather than a specific line.
- Mark comments as resolved with `x` as the agent addresses them.
- Submit everything with `S`.

When you submit, Monocle formats your comments into structured feedback with code snippets and line references, then pushes it through the MCP channel. Claude Code receives it as a channel event and can immediately start addressing your comments. If the agent happens to be busy when you submit, the feedback is queued and delivered the next time Claude Code checks in, so you never lose a review because of timing.

If you need the agent to stop what it's doing, maybe because it's heading in the wrong direction and you want to intervene before it goes further, you can press `P` to pause. This sends a notification through the channel telling Claude Code to stop and wait for your review before continuing.

## Plan Review and Focus Mode

Monocle isn't limited to reviewing file diffs. One pattern I've found especially useful is reviewing plans and architecture decisions _before_ the agent starts writing code.

Claude Code can submit plans, architecture decisions, and other structured content to Monocle using the `submit_plan` tool. These show up alongside your file diffs in the sidebar, and you can leave line-level comments on them the same way you would on code. It means you can review the agent's _thinking_ before it writes code, not just the output.

When reviewing plans, focus mode (`F`) strips away the sidebar and enables line wrapping, giving you a distraction-free markdown rendering of the plan content. You can also set `auto_focus_mode` in your config to enter focus mode automatically whenever a plan comes in.

This is where the channel architecture really shines. The `submit_plan_and_wait` variant blocks Claude Code's execution until you respond. The agent proposes a plan, you review it in Monocle, and only when you approve does it start implementing. If you request changes, it revises the plan and resubmits. It's a lightweight approval gate that doesn't require any context switching.

## Navigation

Everything is keyboard-driven with vim-style bindings: `j`/`k` to move through files, `J`/`K` to scroll the diff, `[`/`]` to jump between files, `g`/`G` for top and bottom. If you've used LazyGit or any other vim-style TUI, you'll feel at home immediately.

All keybindings are customizable through the config file, and the help overlay (`?`) dynamically reflects whatever bindings you've set up. Reviews are persisted in a local SQLite database, so your session survives restarts. You can close Monocle, reopen it, and pick up right where you left off.

## Configuration

Monocle's settings live in `~/.config/monocle/config.json` for global settings, with optional per-project overrides in `.monocle/config.json`:

```json
{
  "layout": "auto",
  "diff_style": "split",
  "sidebar_style": "tree",
  "wrap": false,
  "mouse": true,
  "context_lines": 3,
  "auto_focus_mode": false,
  "ignore_patterns": ["*.lock", "node_modules/**"]
}
```

You can control the diff style, layout, sidebar mode, tab size, line wrapping, mouse behavior, and which files to ignore. The `auto_focus_mode` setting automatically enters focus mode when a plan arrives. There's also a `review_format` section that controls how submitted feedback is formatted, including whether to include code snippets, how many lines of context to show, and whether to add a summary.

## Getting Started

Install Monocle and register the channel plugin:

```bash
# Install
brew install josephschmitt/tap/monocle

# Register the channel plugin in Claude Code
/plugin marketplace add josephschmitt/monocle
/plugin install monocle@monocle
```

Then run Claude Code with the channel enabled in one terminal and Monocle in another:

```bash
# Terminal 1
claude --dangerously-load-development-channels plugin:monocle@monocle

# Terminal 2
monocle
```

They auto-pair over a Unix domain socket. Start working in Claude Code, and the diffs will appear in Monocle as the agent makes changes.

## Why Channels Matter

Building Monocle on MCP channels was a deliberate choice, and I think it points at something bigger than just code review.

The standard MCP model, where Claude pulls data from servers on demand, is powerful but inherently one-directional. The agent decides when to reach out. Channels introduce the inverse: external systems can push information _into_ the agent's context at any time, which is a fundamentally different interaction model.

For Monocle, that means the reviewer is in control. You don't have to wait for the agent to ask for feedback, and you don't have to interrupt it. You just leave your comments, submit, and the agent picks them up naturally. The feedback becomes part of the conversation rather than an interruption to it.

I think there are a lot more tools waiting to be built on this pattern. Any workflow where a human needs to steer or supervise an AI agent in real time, whether that's code review, design review, content editing, or research guidance, could benefit from this kind of push-based feedback loop. Monocle is one implementation of that idea, but the underlying pattern is much broader.
