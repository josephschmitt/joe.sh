Title: pj - A Smarter Project Finder
----
Short: pj
----
Subtitle: Project finder that discovers projects automatically, including nested ones in monorepos
----
Date: Feb 2, 2026 12:00pm
----
Status: Published
----

Text:

In my [terminal tools post](https://joe.sh/terminal-tools), I described using **Sesh** and **TWM** together to manage Tmux sessions and discover projects. That workflow served me well for a long time, but I kept bumping into a limitation that wasn't really a flaw in either tool -- it was an architectural mismatch.

TWM is excellent at what it does. It scans directories for project markers -- `.git`, `package.json`, etc. -- finds nested projects in monorepos, and spins up Tmux sessions with predefined layouts. The project discovery logic it pioneered is genuinely good, and pj's architecture owes a lot to it. But that discovery is inseparable from the workspace management. There's no way to say "just find my projects" without also getting the Tmux session creation, the layout application, and the rest of the workspace machinery.

That became a problem as my workflow evolved. I wanted to use the project discovery in Neovim's picker to switch working directories. I wanted to pipe a list of projects into other tools. I wanted to use it in scripts that had nothing to do with Tmux. TWM's project finder was doing exactly what I needed, but it was locked behind an interface that assumed the answer was always "start a Tmux session."

Sesh solved a different part of the problem -- session switching -- but relied on Zoxide for directory discovery. Zoxide is great for places you've already visited, but it can't show you projects you _haven't_ opened yet. I kept finding myself manually navigating to new repos, opening them once so Zoxide would learn the path, and then relying on Sesh after that. It felt like an unnecessary bootstrapping step.

So I built [pj](https://github.com/josephschmitt/pj).

## What pj Does

pj is a CLI tool written in Go that extracts the project discovery concept that TWM proved out and makes it a standalone, composable primitive. You give it one or more search paths, and it walks the directory tree looking for project markers: `.git`, `go.mod`, `package.json`, `Cargo.toml`, `pyproject.toml`, and a bunch of others. When it finds one, it registers that directory as a project.

The key difference is that pj is _just_ a discovery engine. It doesn't manage Tmux sessions, it doesn't apply layouts, it doesn't have opinions about what you do with the results. It finds projects and outputs them. That constraint is what makes it useful -- it fits into whatever workflow you already have, whether that's a Neovim picker, a shell script, a Tmux popup, or something else entirely.

A basic invocation is dead simple:

```bash
pj
```

That's it. It outputs a list of project paths, one per line. Add `--icons` and `--ansi` and you get Nerd Font icons with color coding per project type.

## Caching

The first thing I focused on was speed. Directory traversal is inherently slow, and nobody wants to wait for a recursive filesystem scan every time they open a picker.

pj caches its results with a configurable TTL (five minutes by default). The first scan walks the filesystem, but every subsequent call returns instantly from the cache. If you've added a new project and want to pick it up right away, `pj --clear-cache` forces a fresh scan.

This makes a huge difference in practice. Opening a fuzzy finder backed by pj feels instant, even across hundreds of projects.

## Nested Project Discovery

This was the main itch I wanted to scratch. Most project finders stop at the first marker they hit. If you point them at `~/work/my-monorepo`, they find the root `.git` directory and move on. But inside that monorepo there might be fifteen packages, each with its own `package.json` or `go.mod`, and those are the things you actually want to navigate to.

pj searches recursively up to a configurable depth (default of 3). It'll find the root project _and_ all the nested ones. Point it at a monorepo and you'll see every package listed individually, ready to jump into.

## Markers and Icons

Out of the box, pj knows about common project markers: `.git`, `go.mod`, `package.json`, `Cargo.toml`, `pyproject.toml`, `Makefile`, `flake.nix`, and more. Each marker can have an associated Nerd Font icon, ANSI color, and label.

That means your Go projects get a gopher icon, Rust projects get a crab, Node projects get the Node logo, and so on. It sounds cosmetic, but when you're scanning a list of fifty projects, the visual differentiation is genuinely useful.

You can also define your own markers. If your stack uses an unusual config file as the project root indicator, just add it to the config:

```yaml
search_paths:
  - ~/work
  - ~/projects

markers:
  - name: my-foxy-project.toml
    icon: "🦊"
    color: orange
    label: foxy
```

Markers support glob patterns too, so something like `*.csproj` will match any C# project file. When multiple markers exist in the same directory, a priority system determines which one "wins" for display purposes.

## Unix Pipeline Integration

One design decision I'm particularly happy with is that pj works as both a data source and a filter in Unix pipelines. On its own, it scans directories and outputs results. But you can also pipe a list of directories _into_ pj, and it'll check each one for project markers:

```bash
# Use pj as a data source
pj | fzf

# Use pj as a filter
ls -d ~/work/*/ | pj --icons

# Compose with other tools
pj | xargs du -sh | sort -rh
```

The output format is fully customizable with placeholders: `%p` for the path, `%n` for the project name, `%i` for the icon, `%l` for the label, and so on. This makes it easy to integrate pj into scripts or feed its output into other tools in exactly the format they expect.

## Git Worktree Support

pj also understands Git worktrees. If you use worktrees (and you should -- they're great for reviewing PRs without stashing your current work), pj can discover them automatically, even if they live outside your configured search paths. Each worktree shows up as its own entry with a reference back to the parent repository.

## Configuration

All of pj's settings live in `~/.config/pj/config.yaml`. A typical setup looks like this:

```yaml
search_paths:
  - ~/work
  - ~/projects

max_depth: 3
cache_ttl: 300

excludes:
  - node_modules
  - .terraform
  - vendor
```

Everything can also be overridden via CLI flags, so you can experiment without touching the config file.

## pj.nvim

The CLI is useful on its own, but the real payoff for me was bringing it into Neovim. [pj.nvim](https://github.com/josephschmitt/pj.nvim) is a plugin that wraps the pj binary and feeds its output into whatever fuzzy picker you already have installed.

It supports [Snacks](https://github.com/folke/snacks.nvim), [Telescope](https://github.com/nvim-telescope/telescope.nvim), [fzf-lua](https://github.com/ibhagwan/fzf-lua), [mini.pick](https://github.com/echasnovski/mini.pick), and [television](https://github.com/alexpasmantier/tv.nvim). Rather than implementing its own picker UI, pj.nvim just integrates with what you've already got. No need to learn a new interface.

Setup with lazy.nvim is minimal:

```lua
{
  "josephschmitt/pj.nvim",
  dependencies = { "folke/snacks.nvim" },
  keys = { { "<leader>fp", "<cmd>Pj<cr>", desc = "Find Projects" } },
  opts = {},
}
```

When you select a project, pj.nvim changes your working directory to it. If you use a session manager like [auto-session](https://github.com/rmagatti/auto-session) or [persistence.nvim](https://github.com/folke/persistence.nvim), it'll try to restore your previous session for that project automatically. It also supports opening projects in splits, vsplits, or new tabs, and you can change the directory scope to be tab-local if you like working on multiple projects in different Neovim tabs.

One feature I'm especially pleased with: pj.nvim will automatically download and install the pj binary if you don't already have it. First time you run `:Pj`, it fetches the binary via curl and you're off. It even handles auto-updates so you stay current without thinking about it.

## Terminal Pickers

pj.nvim is great if you live in Neovim, but pj's output is just text -- which means it works with any fuzzy finder. If you prefer staying in the terminal, you can pipe pj straight into [fzf](https://github.com/junegunn/fzf):

```bash
pj --icons --ansi | fzf --ansi
```

Where this gets really powerful is with **fzf-tmux**. You can bind a Tmux key to open a popup that lists all your projects, and when you pick one, it creates or switches to a Tmux session for that project:

```bash
pj --icons --ansi | fzf-tmux -p 80%,60% --ansi | xargs sesh connect
```

That one-liner is essentially what TWM does, but composed from independent tools. You can swap out any piece -- use a different picker, change what happens on selection, add your own filtering.

[Television](https://github.com/alexpasmantier/tv.nvim) is another option. It's a full TUI picker that can use pj as a data source, giving you a richer preview experience than fzf while still running entirely in the terminal.

This composability is the whole point of pj being a standalone tool. The same discovery engine powers your Neovim picker, your Tmux popup, your Raycast extension, or whatever else you wire it up to.

## The Broader Ecosystem

pj is the core, but I've been building out a small ecosystem around it:

- **[pj.nvim](https://github.com/josephschmitt/pj.nvim)** -- Neovim integration (described above)
- **[pj-node](https://github.com/josephschmitt/pj-node)** -- A Node.js wrapper that provides both a CLI and a TypeScript API, useful if you want to build tooling on top of pj's discovery
- **[pj-raycast](https://github.com/josephschmitt/pj-raycast)** -- A Raycast extension for quick project navigation on macOS

## Installation

pj is available through several package managers:

```bash
# Homebrew
brew install josephschmitt/tap/pj

# Go
go install github.com/josephschmitt/pj@latest

# Nix
nix run github:josephschmitt/pj
```

Pre-built binaries for macOS (Intel and Apple Silicon), Linux, and Windows are available on the [releases page](https://github.com/josephschmitt/pj/releases).
