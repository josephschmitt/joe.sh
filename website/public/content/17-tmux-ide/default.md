Title: Tmux Is My IDE
----
Short: Tmux IDE
----
Subtitle: How I realized my text editor is just one part of a larger system
----
Date: Nov 26, 2025
----
Status: Draft
----

Text:


In my [previous post about terminal tools](https://joe.sh/terminal-tools), I detailed the specific utilities that make up my daily workflow: Neovim, LazyGit, Zoxide, FZF, and others. While that list covers the "what," it fails to capture the "how." Listing individual binaries doesn't explain how a terminal environment can replace the cohesive experience of a tool like VS Code or IntelliJ.

The missing link in that explanation was Tmux.

When I first transitioned to the terminal, I operated under the assumption that Neovim was the direct replacement for VS Code. I spent months configuring it to handle every aspect of my workflow. However, as the system matured, the distinction became clear. I hadn't replaced VS Code with Neovim; I had replaced it with Tmux.

Neovim is strictly a text editor. It handles code manipulation, but it relies on a surrounding system to manage the broader context of development: project switching, file management, version control, and layout orchestration. Tmux provides that system.

## Deconstructing the IDE

An Integrated Development Environment is defined by how it unifies disparate tools into a cohesive interface. If you break down the core functionality of any major IDE, you generally find these specific components:

- **Project management** (Switching between repositories)
- **File navigation** (Fuzzy finding, tree views)
- **Code search** (Global grep)
- **Version control** (Diffs, staging, history)
- **Terminal** (Command execution)
- **Layout management** (Splits, tabs, windows)

My terminal setup implements every one of these features, but rather than being bundled into a monolithic application, they are distinct components orchestrated by Tmux.

## The Architecture

The architecture of this "IDE" places Tmux as the framework that holds everything together.

```
┌─────────────────────────────────────────────────────────────────┐
│  Tmux (The Framework)                                           │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │ Session Manager  │  │ Popup System     │  │ Smart Layouts│   │
│  │ (Sesh + TWM)     │  │ (Standardized)   │  │ (Adaptive)   │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Main Workspace                                          │    │
│  │                                                         │    │
│  │  ┌───────────────────┬────────────┐                     │    │
│  │  │                   │            │                     │    │
│  │  │   Neovim          │  OpenCode  │                     │    │
│  │  │   (Editor)        │  (AI)      │                     │    │
│  │  │                   │            │                     │    │
│  │  │                   ├────────────┤                     │    │
│  │  │                   │            │                     │    │
│  │  │                   │  Shell     │                     │    │
│  │  │                   │            │                     │    │
│  │  └───────────────────┴────────────┘                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Integrated Tools (Popups)                                │   │
│  │                                                          │   │
│  │  • LazyGit (Ctrl-s G)    • Yazi (Ctrl-s Z)               │   │
│  │  • Television (Ctrl-s f) • Quick Shell (Ctrl-s c)        │   │
│  │  • SSH Manager (Ctrl-s @)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

By mapping these features to specific Tmux keybindings and scripts, the boundaries between the tools disappear.

| IDE Feature | Implementation |
|-------------|----------|
| **Project Switcher** | `Ctrl-s o` → Television (Sesh) |
| **Branch Workspace** | `workmux add <branch>` |
| **File Explorer** | `Ctrl-s Z` → Yazi popup |
| **Fuzzy File Search** | `Ctrl-s f` → Television (files) |
| **Full-Text Search** | `Ctrl-s g` → Television (ripgrep) |
| **Git Panel** | `Ctrl-s G` → LazyGit popup |
| **Integrated Terminal** | Tmux panes (native) |
| **Split Editor** | `Ctrl-s V/S` → Adaptive layouts |
| **Quick Command** | `Ctrl-s c` → Quick shell |

## Standardized Popups and RPC

The most critical integration in this system is the popup architecture. I use a centralized script to standardize the dimensions and behavior of all floating windows. Whether I am opening a git interface, a file browser, or a fuzzy finder, the interaction model remains consistent.

However, terminal popups often suffer from a specific usability issue: nested editing. If you open a file manager in a popup and select a file, the default behavior is to open the editor *inside* that popup. This creates a nested state that breaks the workflow.

To solve this, I implemented a "popup-aware" editor wrapper. When a tool running inside a popup attempts to open a file, the wrapper detects the context and redirects the command. It locates the Neovim instance running in the background pane and uses RPC to open the file there, automatically closing the popup in the process.

```bash
# Simplified logic for the popup-aware editor
if [ -n "$TMUX_IN_POPUP" ]; then
  # Tell the main Neovim instance to open the file via RPC
  nvim --server $SOCKET --remote-send ":e $FILE<CR>"
else
  # Just open it normally
  nvim $FILE
fi
```

This small piece of glue code is what makes the system feel like a unified application rather than a disjointed collection of CLI tools.

## Session and Project Management

In a traditional IDE, you open a project folder. In Tmux, I map projects to **Sessions**.

I use a tool called **Sesh** to manage these contexts. When I trigger the session picker (`Ctrl-s o`), it presents a unified list of active Tmux sessions and every directory tracked by `zoxide`. Selecting a directory automatically initializes a new session for that project if one doesn't exist.

For more complex environments, I use **TWM (Tmux Workspace Manager)**. TWM scans the target directory for specific markers (like `package.json` or `Cargo.toml`) and applies a pre-defined window layout. This acts as a template system, ensuring that a Node.js project always opens with the editor and server logs in the correct split, while a Rust project might open with a different configuration.

### Parallel Workflows with Workmux

I have also integrated **[Workmux](https://github.com/raine/workmux)** to handle multitasking within a single repository. Workmux pairs Git worktrees with Tmux windows, allowing for isolated development environments for different branches.

Running `workmux add feature-branch` creates a new linked worktree in a separate directory and spins up a dedicated Tmux window for it. This copies the environment configuration—including installing or linking dependencies—so the new workspace is immediately ready for use. I can switch between fixing a bug in one window and developing a feature in another without stashing changes or invalidating build caches.

## Adaptive Layouts

Managing window splits manually is tedious. To automate this, I wrote a script bound to `Ctrl-s V` that calculates the current terminal width and applies the most appropriate layout:

- **< 210 columns:** 50/50 vertical split.
- **> 210 columns:** Main editor pane takes focus, with a smaller sidebar.
- **> 310 columns:** Three-column layout.

This adaptability ensures that the workspace remains usable regardless of whether I am working on a laptop screen or a large external monitor.

## The Component Ecosystem

The remaining functionality is provided by purpose-built tools, integrated via simple keybindings:

- **LazyGit (Ctrl-s G):** A terminal UI for Git that handles complex operations like interactive rebasing and partial staging.
- **Yazi (Ctrl-s Z):** An asynchronous file manager that allows for rapid filesystem navigation.
- **Television (Ctrl-s f/g):** A Rust-based fuzzy finder that I use for file searching, grepping, and session switching.
- **SSH Manager (Ctrl-s @):** A custom script that parses `~/.ssh/config` to manage remote connections, ensuring that remote Tmux sessions are attached correctly without nesting.

## Conclusion

This setup requires significant initial configuration. My dotfiles repository has grown into a complex suite of scripts and configuration files. However, the result is a development environment that is entirely owned, composed of interchangeable parts, and capable of running identically on a local machine or a remote server.

By treating Tmux as the IDE and Neovim as a component, I have built a system that is tailored exactly to my requirements.

---

The full configuration is available in [my dotfiles repo](https://github.com/josephschmitt/dotfiles).

If you have questions or want to discuss terminal workflows, [ping me on Twitter](https://twitter.com/intent/tweet?screen_name=josephschmitt&text=Re%3A%20Tmux%20is%20My%20IDE).
