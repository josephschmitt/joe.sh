Title: The Tools That Make My Terminal Work
----
Short: Terminal Tools
----
Subtitle: How a handful of small utilities made my development workflow feel effortless
----
Date: Oct 4, 2025 03:02pm
----
Status: Published
----

Text:

At some point, most developers start to care about their terminal setup. It stops being just a place to run commands and becomes part of how you think about your work.

Over the years, I've built mine into something fast, predictable, and easy to reproduce across machines. None of it is particularly complicated, but the tools fit together in a way that makes the whole setup feel cohesive.

Here's what I use, and why it's worth knowing about.

(figure: terminal2.jpeg)

## Dotfiles + GNU Stow

Everything starts with [my dotfiles repo](https://github.com/josephschmitt/dotfiles). It's where all my terminal configurations live: shell, editor, Tmux, Git, everything.

The reason for having a dedicated repo is simple: these configurations evolve constantly, and being able to version them in Git means I can track changes, experiment safely, and sync them across machines. The tricky part is _where_ those files actually live. Most configuration files belong in your home directory (`~/.zshrc`, `~/.config/nvim/init.lua`, etc.), but you really don't want to make your entire home directory a Git repo.

That's where **GNU Stow** comes in.

Stow lets you keep your dotfiles in a separate, organized folder structure, and then it symlinks them into place in your home directory. For example, a `zsh/.zshrc` file inside the repo becomes `~/.zshrc` when stowed.

This approach has a few big advantages:

- You get full version control and portability without polluting your home directory.
- You can easily remove or update a tool's configuration by "unstowing" it.
- You always know exactly what will be linked where -- no magic, no scripts, no templating language.

I chose Stow specifically because of that simplicity. The files in my repo are exactly the files that end up on my system -- no templates, no build step, no indirection. You can open any file in the repo and know immediately what your local configuration would look like.

The repo is also structured around **profiles**:

- **shared/** for configuration common to all machines
- **personal/** for personal devices
- **work/** for work-related setup

That lets me apply a different combination of stow packages depending on which machine I'm setting up. It keeps the configurations isolated but still easy to maintain in one place.

Run `stow shared work` on a new laptop, and everything falls into place.

## [Tmux](https://github.com/tmux/tmux)

**Tmux** is a terminal multiplexer: it lets you run and manage multiple terminal sessions inside a single window. You can split the screen into panes, create tab-like "windows," detach from a session entirely, and come back later with everything exactly where you left it.

For me, it's the backbone of how I work day to day. It ties together everything else -- Neovim, shells, Git, even AI assistants -- into a single, coherent workspace.

Each Tmux session usually starts from a project directory. I'll open one up (often through **Sesh**, more on that later) and it immediately drops me into a layout I've come to rely on: a main pane on the left and a couple of ancillary panes on the right.

The left pane is almost always my editor Neovim running in LazyVim. On the right, I usually have two smaller panes stacked vertically: the top one runs an AI coding assistant like [OpenCode](https://opencode.ai), and the bottom one is just a regular shell for running commands, tests, or quick Git actions.

It's a simple layout, but it covers nearly everything I need. If I ever need a third or fourth pane, I can split, rearrange, or resize them at will using simple keyboard shortcuts.

Navigation is fast and intuitive. I move between panes using **Alt + movement keys**, and when I need to focus on one task, I hit **Alt + z** to "zoom" a pane full-screen, then drop back into my grid when I'm done. I can create new windows with **Alt + 1--9** and switch between them using **Alt + [** and **Alt + ]**.

Those shortcuts make it feel less like juggling terminals and more like working in a dynamic, responsive interface that's entirely keyboard-driven.

I've also added a few "popup" panes, centered overlays that float above the grid. They're perfect for quick context switches: I have one for **LazyGit**, one for **Yazi**, one for a bare “quick shell”, and one that runs **Sesh** so I can instantly jump between sessions.

All of this combines into a setup that's fast to move around in, easy to multitask within, and flexible enough to adapt as I work. Whether I'm deep in code or juggling multiple projects, everything stays within reach.

## Neovim (with LazyVim)

**Neovim**, configured with **LazyVim**, was my gateway drug into the world of advanced terminal tools.

For years I resisted diving into Vim beyond the absolute basics. I'd been using VS Code for nearly a decade, and that workflow was burned into muscle memory. Every time I tried Vim, it felt like touching a hot stove: awkward and counterintuitive, clearly designed by someone who didn't like other people very much.

What finally got me over the hump was two things:

1. **LazyVim** gives Vim/Neovim the vast majority of the features of a modern IDE, in a setup that's cohesive, visually polished, and doesn't require building everything from scratch.

2. I was spending more time editing files on remote machines, and being stuck in stock Vim or Nano was painful. I realized if I just learned Vim properly and made it my own, it would pay off in flexibility everywhere I worked.

And I was right.

I'm now completely addicted to Vim's modal editing workflow. Motions, operators, and text objects make editing _fast_ -- so fast that I feel clumsy when I have to use a traditional editor without them.

My setup is based on **LazyVim's defaults**, which I've customized only where it adds clear value. If you peek into my config, it might look like I've gone overboard -- but almost everything I've added falls into the "nice-to-have" category rather than "must-have." I'm careful to only integrate plugins that enhance something I already know how to do manually. The few keymap tweaks I've made are the exception; those are there to match how my hands naturally want to work.

With that setup, Neovim has become my full-time IDE, for both personal and work projects. I've got LSPs configured for the languages I use, auto-formatting, test runners, and build tools all running smoothly. And because everything is keyboard-driven and composable, I can move through code, refactor, and search without ever breaking flow.

Once the motions and shortcuts settle into muscle memory, it's genuinely hard to overstate how fast and intuitive it feels.

## [LazyGit](https://github.com/jesseduffield/lazygit)

**LazyGit** is my Git UI of choice. It hits the perfect balance between having access to the full power of Git without needing to memorize its arcane command syntax, and being able to see everything that's going on visually.

It handles the basics -- staging and unstaging changes, committing, pulling, and pushing -- but also makes the advanced stuff easy. Interactive rebases, staging individual hunks, managing stashes, switching branches -- all of it's just a few keystrokes away, and all without ever touching the mouse.

It gives me the same control as the command line, but with a clear, structured view of what's changed and how it fits together.

I usually open LazyGit in one of two ways, both of which ultimately boil down to a popup. Inside **LazyVim**, `<leader>gg`opens LazyGit directly within Neovim. It's great for quick diffs or commits, though when Neovim is running in a split Tmux pane, the view can get a bit narrow. For that, I have a Tmux keybind -- `<leader>G` -- that opens LazyGit in a full-width popup across all panes, no matter how my layout is arranged.

That flexibility means I can manage Git state from anywhere, without context-switching or losing focus.

At this point, I rarely need to drop down to raw Git commands. Occasionally, in very large monorepos, LazyGit slows down a bit and I'll use Git directly, but those cases are rare.

The only customization I've made is visual -- I've themed it to match the rest of my terminal and set it to use **[Delta](https://github.com/dandavison/delta)** as the diff tool. It fits right in with the rest of my setup: clean, fast, and fully keyboard-driven.

## [Zoxide](https://github.com/ajeetdsouza/zoxide)

**Zoxide** is a relatively recent addition to my setup, but it's quickly become one of those tools I can't imagine going back to working without.

It works as a smarter replacement for the standard `cd` command. Once you've used it to navigate somewhere, Zoxide remembers that directory. From then on, you can jump back to it just by typing part of its name. For example, after visiting `~/development/my-project` once, I can just run `z devproj` and it'll take me straight there.

For a long time, I didn't really see the point -- typing full paths didn't _feel_ that painful. But eventually I realized how often I was bouncing between the same directories day after day. The real breakthrough came when I discovered the `zi` command, which opens an FZF-powered fuzzy finder listing all known directories. It removes the "magic" guesswork entirely. I can just search and jump instantly.

I also use `zoxide query` (aliased to `zq`) constantly. It's like `z`, but instead of changing directories, it returns the full path it matched to. That's perfect for scripts or one-off commands where I want to _use_ a path as a search query without moving into it.

One of the most powerful use cases is parameter expansion. If I want to open Neovim in a specific project, instead of manually `cd`ing into it, I can run something like:

```bash
    nvim $(zq myproj)
```

That one-liner uses Zoxide's search to expand to the full path automatically.

And that's just the start. Like several other tools in this setup, Zoxide ends up getting used _by_ other utilities -- for example, through FZF integration -- making it a quiet but indispensable layer in the overall system.

## [FZF](https://github.com/junegunn/fzf) + [Ripgrep](https://github.com/BurntSushi/ripgrep)

**FZF** and **Ripgrep** are everywhere in my setup. They're not flashy tools on their own, but they're the foundation that makes almost everything else fast and fluid.

**Ripgrep** (`rg`) is a modern replacement for `grep`: it searches through files blazingly fast, respecting `.gitignore` files and optimized for developer workflows. I use it both directly and indirectly, often without even realizing it, since it powers search in tools like Neovim and other terminal UIs.

**FZF**, on the other hand, is the universal fuzzy finder. It's the UI layer that lets me pick anything -- files, commands, directories, Git branches, sessions -- just by typing a few letters.

It shows up everywhere:

- Inside **Neovim/LazyVim**, where it powers file and text search.
- In my **shell**, for navigating command history or recently used directories.
- In **LazyGit**, to fuzzy find repositories.
- And in **Sesh**, to quickly jump between open sessions.

FZF has become such a deep part of my workflow that it's almost invisible -- it's just how I find things now. Paired with Ripgrep, it turns the terminal into something that's not only powerful, but _immediately accessible_.

They're small tools, but they punch far above their weight.

## Oh My Posh

**Oh My Posh** handles my shell prompt, and while it might look like a purely aesthetic choice, it's actually a big quality-of-life improvement.

The real value isn't in how it looks, it's in how consistent and maintainable it is. I've done manual prompt customization in Bash before, and it becomes unreadable almost immediately. Even for Bash, which is already known for being a bit inscrutable, that's saying something.

With Oh My Posh, my prompt configuration is standardized and declarative. It's the same across every shell I use, and it behaves exactly the same on every machine. The configuration is simple and predictable, and I can tweak it without feeling like I'm defusing a bomb.

At a glance, my prompt gives me the key bits of context I care about -- current directory, Git branch and status, and even which shell I'm running -- all color-coded and cleanly presented. It's fast, rock solid, and stays out of the way.

It's one of those small things that you stop noticing entirely until you have to use a system without it.

## [Delta](https://github.com/dandavison/delta), [Eza](https://github.com/eza-community/eza), [Bat](https://github.com/sharkdp/bat), and [Yazi](https://github.com/sxyazi/yazi)

These four tools fall into what I think of as the _quality-of-life_ category. They don't redefine how I work, but they make the experience smoother, faster, and a little more enjoyable.

I spend a lot of time looking at diffs these days, especially as more and more of my code is written by AI that I then review. **Delta** makes that experience far better. It's my default Git difftool, and it's also what **LazyGit** uses behind the scenes. I configure it once, and I get consistent, syntax-highlighted diffs everywhere: clear, colorful, and easy to parse.

**Eza** is a modern replacement for `ls`. It adds visual niceties like icons, tree views, and control over recursion depth. I've aliased `ls` to `eza`, and most of the time I forget I'm even using it. It makes directory listings just a bit more readable without changing how I work.

Same story with **Bat**, which replaces `cat`. It adds syntax highlighting and line numbers when displaying files, but otherwise behaves exactly like `cat`. It's another one of those small upgrades that quietly improves the default experience.

**Yazi** is a bit different -- it's a full terminal-based file browser. I don't use it constantly, but when I do, it's invaluable. It's fast, powerful, and great for when I'm spelunking through unfamiliar directory trees. It lets me copy, move, rename, and preview files inline, all without leaving the terminal.

The common thread between all these tools is speed and simplicity. They each follow the Unix philosophy of doing one thing and doing it well, often improving on utilities that have existed for decades. I can absolutely get things done without them — it's just slower and clunkier.

Combined, they make the terminal a place that feels as powerful and polished as any modern IDE. And because I've standardized my color themes across everything, it all looks cohesive too.

## [Sesh](https://github.com/joshmedeski/sesh) + [TWM](https://github.com/vinnymeller/twm)

**Sesh** is what ties my whole terminal environment together. It manages my **Tmux** sessions -- the backbone of how I work -- and gives me a clean, consistent way to move between projects.

Most of my sessions are defined by working directories. I've configured Sesh so that its picker doesn't just list open Tmux sessions, but also directories tracked by **Zoxide**. That means if I pick a Zoxide directory, Sesh automatically creates a new Tmux session there, naming it after the directory. It's seamless: one action to jump into any project, whether it already exists or not.

I use Sesh almost exclusively through its **popup window in Tmux**, which makes it fast to open, fuzzy find a project, and jump right in without breaking focus.

Alongside Sesh, I also use **TWM (Tmux Workspace Manager)**, which adds another layer of automation on top. TWM scans directories I've configured and automatically detects projects based on certain markers: a `.git` directory, a `package.json` file, etc. When I launch it, it presents a fuzzy finder list (powered by **FZF**) of projects I can narrow down interactively.

Once I select a project, TWM automatically spins up a Tmux session and applies a specific layout depending on the type of project, all without me lifting a finger.

Together, Sesh and TWM handle nearly all of my session and project management. I don't have to remember where things live or how they're configured, I just pick what I want to work on, and everything else falls into place.

It's the final layer that makes my terminal setup feel like a real, integrated environment rather than a collection of separate tools.

## Putting It All Together

The terminal can be as minimal or as complex as you make it. For a long time, I treated it as a tool of last resort, a place to run a few commands and then get back to a "real" environment like VS Code. But somewhere along the way, it stopped being just a shell and became _the_ environment.

The tools I've described here -- from **Stow** to **Tmux**, **Neovim**, **LazyGit**, **Zoxide**, **FZF**, and everything in between -- weren't things I adopted all at once. Each solved one small problem. But together, they've grown into a cohesive system that's fast, consistent, and surprisingly pleasant to use.

That doesn't mean everyone needs this exact setup. The best setups are personal -- they grow over time, one improvement at a time, as you find the friction points that matter to you. If a tool adds clarity or speed, keep it. If it adds complexity or gets in the way, drop it.

This isn't about collecting tools for their own sake; it's about building an environment that helps you think less about how you work, and more about what you're working on.
