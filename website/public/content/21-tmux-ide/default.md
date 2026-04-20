Title: Tmux Is My IDE
----
Short: Tmux IDE
----
Subtitle: It was the multiplexer all along
----
Date: Apr 20, 2026 6:30pm
----
Status: Published
----

Text:

A few months ago I wrote [about the tools that make my terminal work](https://joe.sh/terminal-tools), which was effectively a laundry list of binaries &mdash; fzf, zoxide, ripgrep, the whole lineup &mdash; plus some notes on how I use each one. It was fine as far as it went, but re-reading it later I realized it didn't actually answer the question it implied. You can't hand someone a list of CLIs and have them go "ah yes, clearly this is equivalent to the integrated experience of a modern IDE." Something was doing the work of holding all of that together, and the post didn't name it.

The last post ended by noting that somewhere along the way my terminal had stopped being just a shell and become _the_ environment. That transition started with remote editing. After close to a decade in VS Code I wanted something I could bring with me to any box I SSHed into, and Neovim with LazyVim was the first thing polished enough to make the jump feel viable. For a long time I thought _that_ was the whole story: I was replacing VS Code with Neovim, and I spent an embarrassing amount of time tuning it to cover every aspect of my workflow. To its credit, it got pretty close. But as the rest of my setup matured, the picture clarified in a way I didn't expect: I didn't need to replace VS Code with Neovim, I needed to replace it with the terminal environment in general. Neovim was just the text editor, one component. What managed my projects, held my tools together, and made the whole environment feel like a single product was the terminal multiplexer I'd been treating as a supporting character: [Tmux](https://github.com/tmux/tmux/wiki).

Once I saw it that way, I stopped hunting for plugins to shove every other terminal tool inside Neovim and let them live in the environment where they belonged. I built my developer experience around the system instead of trying to bend the system to fit inside the editor.

Tmux is the glue. It holds a terminal-based workspace together and harmonizes the interactions across tools that don't know about each other, so the Unix philosophy &mdash; one tool, one job, done well &mdash; can scale into something that feels like a coherent product rather than a grab-bag of unrelated binaries. The individual tools stay small and focused. Tmux is what makes them _feel_ like one system.

However, the part worth writing about isn't any particular piece of the setup; it's the way the pieces compose, and how the composition kept holding up while everything I was doing inside it changed.

## Sessions

The first piece of Tmux that really clicked for me was sessions. In a GUI IDE the unit of work is a project folder: open one and the environment configures itself around it, more or less the way you left it last time. A Tmux session does the same thing at the shell level. Each one gets the project name, a working directory at its root, and whatever layout the work happens to call for. I hit `Ctrl-s o` to pop a picker that shows every active session alongside directories discovered by [pj](https://joe.sh/pj) and Zoxide, and if I pick a directory that isn't already a session one gets created on the spot. Functionally it's VS Code's "Open Recent," except every session I've ever opened is still alive in the background, waiting exactly where I left it.

That last part took me a while to appreciate. When I close my laptop and open it a few hours later, every project is right where I left it, not reconstructed from a state file or reopened but simply continuing. The difference between "the IDE restored your last session" and "the session never stopped running" doesn't sound like much until you've lived with both, and then it really does.

The payoff grows once the same setup lives on more than one machine. My laptop and the Mac mini I use as a home server both pull from the same dotfiles, so a session opened on one feels indistinguishable from a session opened on the other &mdash; same keybindings, same layout, same tools. If I'm away from my desk I can SSH into the Mac from my [iPad or my phone](https://rootshell.com)[^1] and land in exactly the environment I left. And because Tmux sessions run indefinitely in the background, long-running agent tasks keep ticking along after I've stepped away; I can pull out my phone a few hours later and check in on them from wherever I am.

## Popups as a UX layer

With project context handled, the next thing that started to bother me was how uneven the rest of the setup felt. I was running a dozen CLI tools across sessions &mdash; a git interface, a file browser, fuzzy finders, quick shells &mdash; and each one had its own idea of how to present itself. The tools themselves were fine; what was missing was a consistent way to invoke them.

The fix turned out to be a centralized popup system. Every floating UI in my setup routes through the same script, which picks a size (small for pickers, medium for full applications, large for the rare things that need real estate) and positions the popup over the workspace the same way every time. The interaction model is consistent across tools: a keybinding opens a popup, I do the thing, the popup closes, I'm back where I was.

The part I'm proudest of is what happens when a popup needs to hand off to the editor. The naive version, opening Neovim inside the popup, is clunky and immediately breaks the illusion that the popup is a floating UI rather than a nested terminal. So I wrote a small wrapper that detects when it's running inside a popup, reaches out to the real Neovim instance in my main pane via its RPC socket, and opens the file there instead:

```bash
if [ -n "$TMUX_IN_POPUP" ]; then
  nvim --server $SOCKET --remote-send ":e $FILE<CR>"
else
  nvim "$FILE"
fi
```

Twelve lines of shell, and it's one of those moments where the first time it worked I sat there thinking "oh, that's actually the thing." The popup vanishes and the file appears in the editor, with no visible seam.

## Layouts

Once every tool felt like part of the same product, the question that replaced "how does this interact with that" was "where should everything sit." For a while the answer was boring: a main Neovim pane on the left, an AI agent and shell stacked on the right. That configuration made sense when writing code was the main thing I did. It didn't stay the main thing I did.

Somewhere along the way my focus shifted from _writing_ code to _reviewing_ code an agent had written, and the layout I'd been defaulting to stopped fitting the work. That's why I built [Monocle](https://joe.sh/monocle), and why the main pane of my workspace is now Monocle rather than Neovim. The proportions also needed to adapt to whatever screen I happened to be plugged into &mdash; my laptop, an external monitor, or an ultrawide, depending on the day &mdash; so a keybinding measures `#{window_width}` and picks a layout:

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

The same adaptive logic carries down to the phone. When I'm SSH'd in from an iPhone the grid doesn't make sense anymore, so I have a keybinding that drops me into what I think of as single-pane mode: the current pane zooms to fill the window, and another keybind cycles focus through the other panes in order. I've also patched the tab bar plugin to collapse at narrow widths so it doesn't spill off-screen. It's not as rich as the desktop view &mdash; how could it be? &mdash; but it's enough to check on an agent, nudge it, and put the phone back down.

You'll notice Neovim doesn't appear in any of those layouts. That's not a mistake.

## What happened to Neovim

A year ago Neovim was the primary pane. Today Monocle holds that slot, with the agent sitting next to it in the secondary pane doing the actual writing, and Neovim has dropped out of the pane hierarchy entirely. It's an escape hatch. When I'm reviewing something in Monocle and it's faster to fix the problem directly than to describe the fix to the agent, I hit `Ctrl-g` on the selected file, it opens in `$EDITOR`, I make the edit, and I'm back in Monocle. That's the role Neovim plays now.

I didn't plan any of this. My focus shifted and the layout followed, which left the editor with a narrower role by default. The demotion itself isn't really the point, though. The point is that it didn't require me to rebuild anything. Tmux let the shape change out from under me without complaint. The layout grew a new primary pane and the editor migrated into an escape hatch, while the rest of the setup kept working as if nothing much had happened.

That's the thing I couldn't have done in VS Code without waiting for someone to ship an extension.

## Customizing the seams

Which gets at the thing I actually care about in this setup, and why I keep defending it to people who think I should just use a real IDE. Tmux doesn't only let you compose tools. It lets you customize the _seams_ between them, which means you can build the exact UX you want for any workflow without asking anyone for permission.

A concrete example. I use [Workmux](https://github.com/raine/workmux) to pair git worktrees with Tmux windows, which lets me work on multiple features in parallel with complete isolation between them. Workmux is a great tool. It's also a CLI, which means every worktree operation requires a shell prompt handy and the syntax memorized. That works fine in isolation, but the mental overhead starts to add up.

In a traditional IDE, this is the point where you file a feature request and hope. In Tmux, I wrote a handful of shell scripts using [gum](https://github.com/charmbracelet/gum) (which is a delight; go poke around if you haven't used it) and wired them into popups. `Ctrl-s w a` pops a prompt asking for a branch name, I type it in, and Workmux creates the worktree and spins up a fully configured window in the background. `Ctrl-s w m` opens a different popup for merging:

```bash
# workmux-merge.sh (simplified)
TARGET=$(git branch --format='%(refname:short)' \
  | gum filter --header "Merge into branch")
STRATEGY=$(gum choose --header "Merge strategy" merge rebase squash)
workmux merge --$STRATEGY --into "$TARGET"
```

Each script is around twenty lines of shell, and because they run through the same popup system as everything else they inherit consistent sizing, positioning, and keybinding behavior for free. Just shell, bound to a key, without an extension API to learn or plugin architecture to compile against.

This pattern keeps showing up. Every time some tool has a workflow that's slightly too cumbersome, I wrap it in a small script and bind that script to a keystroke through the popup system. The friction of going from "this is annoying" to "this is fixed" has always been low, and in the age of AI coding agents it's practically zero: I describe what I want, an agent writes the shell for me, and a minute later the annoyance is gone. Writing these scripts by hand used to feel like more overhead than the annoyance was worth, which is why I mostly just lived with it. Now I reach for the shell instead of resenting the UX.

When I outgrow a tool entirely, like when Television displaced FZF in most of my workflows a few months back, the Tmux layer holding everything together doesn't need to change. I swap the tool out underneath and the keybindings stay the same.

## The cost

There's a downside to all this, and I'd be lying to pretend otherwise. The same primitives that let me wrap Workmux in a polished popup also let me wire up a dozen half-baked commands I'll forget about in a week, each one taking up a keybinding in a finite namespace. A setup this composable turns into chaos fast without someone minding the store, and that someone is me. I spend a surprising amount of time making sure my keybindings and popups make sense as a whole, and I remove about as often as I add, because a command that doesn't earn its slot is worse than nothing. The vigilance is part of the price, and if I stopped enjoying the tinkering, the approach would stop working.

That's before we get to the learning curve, which is steep. Tmux's conceptual model alone &mdash; sessions and windows and panes &mdash; is a lot to internalize before you layer on Neovim's modal editing and a dozen other CLI tools. Nothing works out of the box: every tool needs configuration, and every integration between tools ends up as shell I wrote and still maintain. My dotfiles repo is hundreds of files at this point, which I'm neither proud of nor embarrassed about. It's the cost of the thing, and if you don't genuinely enjoy tinkering with config files you will resent this setup pretty quickly.

There's no graphical debugger with breakpoints and watch windows either. Language-specific debuggers run in a pane just fine, but if visual debugging is central to how you work this will feel like a regression. I mostly live in TypeScript and debug through logs and tests, so it hasn't bitten me. GUI tools (Figma, a graphical database client, whatever else you spend time in) don't integrate naturally with a terminal-first setup, and Tmux isn't going to wrap Figma for you.

## Closing thought

I don't think everyone should drop their IDE and switch to Tmux, and I genuinely mean that. This is a lot of hacking to pull off, plus a lot of ongoing curation to keep tidy, and it amounts to being your own product manager for your development environment. Plenty of people reasonably want someone else to do that work for them. VS Code is a spectacular piece of software, and if that's what you want, keep using it. I'm a builder and a tinkerer, so being able to design my own IDE and have it bend exactly to how I work brings me genuine personal joy. That's a disposition thing, not a prescription.

What I will say is that once I stopped thinking of my editor as the center of my development environment and started thinking of it as one component in a system I was orchestrating myself, a lot of things about my workflow got easier to reason about. The shape of the system kept changing as my work changed. Agents came along, Monocle eventually displaced the editor, and Tmux let the whole thing happen without me having to rebuild from scratch.

If you take anything from this post, I'd rather it not be "use Tmux." I'd rather it be: figure out what's actually orchestrating your development environment, and then pay attention to it.

---

The full configuration is available in [my dotfiles repo](https://github.com/josephschmitt/dotfiles). Questions, or want to talk terminal workflows? Find me on [Mastodon](https://hachyderm.io/@josephschmitt), [Bluesky](https://bsky.app/profile/joe.sh), or [X](https://x.com/josephschmitt).

[^1]: [rootshell](https://rootshell.com) uses libghostty for rendering, the same engine that powers [Ghostty](https://ghostty.org), my desktop terminal. The consistency runs all the way down to the pixels.
