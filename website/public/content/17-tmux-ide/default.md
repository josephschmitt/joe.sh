Title: Tmux Is My IDE
----
Short: Tmux IDE
----
Subtitle: How AI agents made me realize my text editor is just one piece of a larger system
----
Date: Mar 25, 2026 7:15pm
----
Status: Draft
----

Text:

A few months ago, I wrote about [the tools that make my terminal work](https://joe.sh/terminal-tools). That post covered the individual utilities I use day-to-day, but looking back, it didn't really capture how they all fit together. Listing a bunch of binaries doesn't explain how a terminal environment can replace the cohesive experience of something like VS Code.

The missing piece in that explanation was Tmux.

When I first moved to terminal-based development, I assumed Neovim was the thing replacing VS Code. I spent months configuring it to cover every aspect of my workflow, and it got pretty close. But as my setup matured, I started to see the distinction more clearly. I hadn't replaced VS Code with Neovim. I had replaced it with Tmux. Neovim was just the text editor, one component in a larger system. The thing actually managing my projects, integrating my tools, and orchestrating my workflow was Tmux.

That realization changed how I think about my development environment, and the rise of AI coding agents has made it even more obvious.

## The IDE Is Shifting

The most capable AI coding tools right now are CLI-native. Claude Code, OpenCode, Codex, Gemini CLI: they all run in terminals, not in editor sidebars. They work best when they have access to a shell, a filesystem, and a way to run commands directly. The traditional IDE wasn't really designed around this. VS Code has terminal panels and Copilot, but the whole architecture still assumes the _editor_ is the center of the universe, and everything else is a plugin or a sidebar bolted on.

That model is starting to feel backwards. More and more of my actual development work happens outside the editor. An AI agent writes code in one pane while I review its changes in another. I switch between projects, manage git worktrees, run builds and tests, browse files, do code review, all without touching the editor. Neovim is still where I _edit text_, but it's no longer where I _develop software_. The development happens across the whole session, in all the panes and tools that Tmux is holding together.

## What an IDE Actually Provides

If you strip away the branding, an IDE is really just a system that unifies a handful of capabilities into a single interface: project management, file navigation, code search, version control, terminal access, layout management, and increasingly, AI integration.

My terminal setup provides all of these. The difference is that instead of being bundled into one monolithic application, they're independent tools orchestrated by Tmux. The session is the workspace. The popups and panes are the UI. And a keybinding is never more than one shortcut away from any of it.

## Sessions as Projects

In a traditional IDE, you open a project folder and the environment configures itself around that context. In Tmux, I map the same concept to **sessions**. Each session is named after a project, rooted in its directory, and arranged with a layout that makes sense for the work.

When I trigger the session picker with `Ctrl-s o`, I get a unified list of active Tmux sessions alongside directories discovered by tools like [pj](https://joe.sh/pj) and Zoxide. Selecting a directory creates a new session there automatically, and selecting an existing session switches to it instantly. It's essentially VS Code's "Open Recent" workflow, but with the added benefit that every session I've ever opened is still alive in the background, exactly where I left it.

Session persistence is one of Tmux's most underappreciated features. I can close my laptop, open it hours later, and every project is exactly as I left it: pane arrangement, working directory, running processes, all preserved. That's something GUI IDEs have never quite nailed.

## Popups as a Command Palette

One of the design patterns that makes this setup feel cohesive rather than cobbled together is a **standardized popup system**. Every tool that needs a floating UI opens in a popup that's sized and positioned consistently, whether it's a git interface, a file browser, a fuzzy finder, or a quick shell prompt.

I have a centralized script that handles all of this. It defines preset sizes (small for pickers, medium for full applications, large for things that need maximum space) and every popup in my setup flows through it. The interaction model is always the same: a keybinding opens a popup over my current workspace, I do the thing I need to do, and when I'm done the popup disappears and I'm right back where I was. No new windows, no context switching.

The interesting part is what happens when a popup needs to hand off to the editor. If I'm browsing files in Yazi and select one to edit, the naive behavior would be to open the editor _inside_ the popup, which is clunky and breaks the flow entirely. Instead, I built a "popup-aware editor" wrapper that detects when it's running inside a popup, finds the Neovim instance in my main workspace via its RPC socket, and opens the file there directly. The popup closes automatically and the file just appears in my editor.

```bash
# Simplified logic
if [ -n "$TMUX_IN_POPUP" ]; then
  nvim --server $SOCKET --remote-send ":e $FILE<CR>"
else
  nvim "$FILE"
fi
```

This works across every tool that opens files: the file browser, git diffs, search results, all of it. It's a small piece of glue code, but it's what makes the whole system feel like a single application rather than a collection of separate programs that happen to be running next to each other.

## Adaptive Layouts

GUI IDEs handle window management for you. In a terminal, you'd normally be on your own with manual splits and resizing. I've automated most of that away.

My workspace layout has actually evolved in an interesting way that reflects the broader shift I'm describing. It used to be a main editor pane on the left with an AI agent and shell stacked on the right, with the editor getting the lion's share of the space. That made sense when editing was my primary activity. But as I've leaned more into agent-driven development, my primary activity has shifted from _writing_ code to _reviewing_ it. That's why I built [Monocle](https://joe.sh/monocle), and it's now the tool that occupies the main pane. The agent runs alongside it, and Neovim is there when I need it, but the review surface is what gets the most real estate.

The proportions adapt to however wide my terminal happens to be, with a keybinding that calculates the current terminal width and applies the most appropriate layout automatically. On a laptop it's a 50/50 split, on a normal monitor the sidebar gets a fixed 100 columns, and on an ultrawide the primary pane takes two-thirds of the space.

```
Laptop (<210 cols)          Monitor (210-310 cols)       Ultrawide (310+ cols)
┌──────────┬──────────┐    ┌────────────────┬────────┐  ┌──────────────────┬──────────┐
│          │          │    │                │        │  │                  │          │
│ Monocle  │  Agent   │    │  Monocle       │ Agent  │  │  Monocle         │  Agent   │
│  (50%)   │          │    │  (flexible)    │ (100   │  │  (67%)           │  (33%)   │
│          ├──────────┤    │                │ cols)  │  │                  ├──────────┤
│          │  Shell   │    │                ├────────┤  │                  │  Shell   │
└──────────┴──────────┘    └────────────────┴────────┘  └──────────────────┴──────────┘
```

The implementation is surprisingly simple, just a conditional check on `#{window_width}`, but it eliminates one of those constant micro-frictions that add up over a long day of work.

## AI Agents as Workspace Citizens

In my setup, AI agents aren't plugins or sidebars. Claude Code runs in a pane just like Neovim runs in a pane, with equal access to the filesystem, the shell, and the full terminal environment. There's no sandboxed extension API limiting what it can do, and there's no assumption that the editor is the thing in charge.

When I need to review what an agent has written, I don't switch to a diff view inside my editor. I use [Monocle](https://joe.sh/monocle), a dedicated TUI that runs alongside Claude Code and shows me every file change as it happens with syntax-highlighted diffs and line-level commenting. The feedback flows back to the agent through an MCP channel in real time. It's a proper review loop, the kind of workflow that would require deep integration with an editor's extension system but in Tmux is just another pane doing its thing.

When I need to work on multiple features in parallel, I use [Workmux](https://github.com/raine/workmux) to pair git worktrees with Tmux windows. Each worktree gets its own window with a full environment (editor, agent, review tools), and they're completely isolated from each other. Different code checked out, different git state, different running processes. I can have one agent refactoring the auth system in one window while another adds a new API endpoint in the next, and switch between them instantly.

None of this requires the editor to know about it. Neovim doesn't need an "AI sidebar" plugin or a "worktree manager" extension. Those capabilities live at the Tmux level, where they belong, because they're not editing concerns. They're workflow concerns.

## Customizing the Seams

This is the part of the Tmux-as-IDE model that I think gets undersold. It's not just that the tools are composable, it's that Tmux gives you total control over the seams _between_ them, which means you can build exactly the UX you want for any workflow.

A good example: I use [Workmux](https://github.com/raine/workmux) to manage the git worktree workflow I described above. It's a great tool, but it's CLI-only. You run `workmux add feature-branch` from a shell prompt, pass flags for merge strategies, type out branch names by hand. That works fine, but it means I need a terminal prompt available and I have to remember the exact command syntax every time I want to create or clean up a worktree.

In a traditional IDE, this is where you'd file a feature request and wait for the extension author to add a GUI. In Tmux, I just built one myself.

I wrote a handful of small shell scripts using [gum](https://github.com/charmbracelet/gum) (a tool for building interactive shell UIs) and wired them into Tmux popups. Now when I press `Ctrl-s w a`, a popup appears asking for a branch name. I type it in, hit enter, and Workmux creates the worktree and spins up a fully configured Tmux window with my agent and review tools already running. When I'm done with a branch, `Ctrl-s w m` opens a different popup that lets me pick a target branch and merge strategy from a menu:

```bash
# workmux-merge.sh (simplified)
TARGET=$(git branch --format='%(refname:short)' \
  | gum filter --header "Merge into branch")
STRATEGY=$(gum choose --header "Merge strategy" merge rebase squash)
workmux merge --$STRATEGY --into "$TARGET"
```

The scripts are tiny, around 20 lines each, but they turn a CLI tool into something with a real interface. And because they're just shell scripts launched through Tmux's popup system, they automatically get consistent sizing, positioning, and keybinding behavior. I didn't have to learn an extension API or write a plugin. I wrote some shell, told Tmux to run it in a popup, and bound it to a key.

This pattern shows up everywhere in my setup. Whenever a tool has a workflow that's slightly too cumbersome, I can wrap it in a small script, give it a popup, and bind it to a key. The friction of going from "this is annoying" to "this is fixed" is remarkably low, because Tmux's building blocks (popups, panes, key tables, environment variables) are general-purpose enough to handle almost anything.

Honestly, the rise of AI coding agents is a big part of what's made this level of customization practical. These glue scripts aren't complicated individually, but writing a dozen of them to cover every workflow used to feel like more effort than it was worth. Now I can describe what I want in a prompt and have a working script in seconds. The barrier to building custom UX around my tools has basically disappeared, which means I actually _do_ it instead of just living with the friction.

That flexibility extends to swapping out tools entirely. My [terminal tools post](https://joe.sh/terminal-tools) from a while back describes an FZF-heavy workflow that I've since migrated mostly to Television. My [pj post](https://joe.sh/pj) describes replacing TWM's project management with a standalone tool. The system evolves one piece at a time, and the Tmux layer that holds it all together doesn't need to change. That's the real difference between a framework and an application. VS Code is an application: when you outgrow something, you hope someone's written an extension for the replacement. Tmux is a framework: when you outgrow something, you swap it out or wrap it in something better.

## The Tradeoffs

The learning curve is real. Tmux has its own conceptual model (sessions, windows, panes) that takes time to internalize, and adding Neovim's modal editing plus a dozen other CLI tools on top of that makes the onboarding pretty steep. The first few weeks will feel slow. That's normal, and it does get better, but it's not something you can skip.

Nothing works out of the box, either. Every tool needs configuration, keybindings need to be mapped, and integrations need to be scripted. My dotfiles repo is hundreds of files at this point. That's the cost of this level of customization.

There's no graphical debugger with breakpoints and watch windows. Language-specific debuggers exist and can run in a Tmux pane, but if you rely heavily on visual debugging this will feel like a step backward. I mostly work in TypeScript and debug through logs and tests, so this hasn't been a blocker for me, but it's worth knowing.

And if your workflow involves a lot of GUI tools like design software, graphical database clients, or visual API testers, those won't integrate as naturally as they would in a traditional IDE.

## Why This Works Now

A year ago, I would have described this setup as a nice terminal workflow for people who like Vim. Today it feels like something more than that.

The shift toward AI-assisted development is changing what an IDE needs to be. The most capable coding agents run in terminals. The best way to supervise them is with dedicated review tools rather than editor plugins. The most productive way to run multiple agents in parallel is with isolated worktrees in separate windows. All of these workflows are things Tmux handles natively.

I'm not suggesting everyone should drop their IDE and switch to Tmux tomorrow. The setup cost is high, the learning curve is steep, and the maintenance is ongoing. But for me, the realization that my text editor is just one component in a larger system, and that Tmux is the thing actually orchestrating my development environment, changed how I think about the tools I use every day.

The traditional IDE assumes the editor is the center of everything. In a world where AI agents are doing more and more of the actual writing, that assumption is starting to show its age.

---

The full configuration is available in [my dotfiles repo](https://github.com/josephschmitt/dotfiles). If you have questions or want to talk terminal workflows, find me on [Mastodon](https://hachyderm.io/@josephschmitt), [Bluesky](https://bsky.app/profile/joe.sh), or [X](https://x.com/josephschmitt).
