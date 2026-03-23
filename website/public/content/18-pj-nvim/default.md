Title: pj.nvim - Project Finder for Neovim
Short: pj.nvim
Subtitle: Project finder that discovers projects automatically, including nested ones in monorepos
Date: Feb 2, 2026
Status: Published

Text:

I've been working on [pj](https://github.com/josephschmitt/pj), a CLI tool in Go for discovering projects across your filesystem. It looks for markers like `.git`, `package.json`, `go.mod`, `Cargo.toml`, etc.

A few things I'm happy with:

* **It's fast** - Results are cached so after the first scan, opening the picker is instant. No waiting for directory traversal every time.
* **Lists all projects** - Add one or more search paths to show all your projects. Most project pickers require you to navigate to or open a project first. pj shows you everything available in your search paths, even if you've never opened it
* **Finds nested projects** - Point it at a monorepo and it'll find all the packages inside, not just the root. It searches recursively for project markers at configurable depths.
* **Configurable markers** - Comes with some reasonable defaults for popular project types, but you can customize what counts as a "project" in your setup. Working with a weird stack? Add your own markers.
* **Nerd Font icons per marker** - Each marker can have its own icon, so your Go projects get a gopher, Rust projects get a crab, etc. Makes scanning the list way faster visually.

[pj.nvim](https://github.com/josephschmitt/pj.nvim) brings that into Neovim. It works with [Snacks](https://github.com/folke/snacks.nvim), [Telescope](https://github.com/nvim-telescope/telescope.nvim), [fzf-lua](https://github.com/nvim-telescope/telescope.nvim), or [television](https://github.com/alexpasmantier/tv.nvim?tab=readme-ov-file), use whatever picker you already have installed.

```lua
{
  "josephschmitt/pj.nvim",
  -- Make sure to add your chosen picker as a dependency
  dependencies = { "folke/snacks.nvim" },
  keys = { { "<leader>fp", "<cmd>Pj<cr>", desc = "Find Projects" } },
  opts = {},
}
```

Configure your search paths once in `~/.config/pj/config.yaml`:

```yaml
search_paths:
  - ~/work
  - ~/projects

# Optionally define some additional markers
markers:
  - my-foxy-project.toml
icons:
  my-foxy-project.toml: 🦊
```

You can even use pj as a tmux popup with fzf-tmux or television to quickly open a project in a tmux session.

Give it a try, would love to know what you think.

**UPDATE**: Wow this got a lot more interest than I was expecting! I've added a couple of quick follow-up features and fixes:
- Fixed auto-close not working
- Fixed curl/wget install instructions in `pj` readme
- Added support for mini.pick as a picker
- Added auto-download for pj binary if you don't already have it installed
- Added auto-update for auto-installed pj binary

If you have more suggestions, please let me know!
