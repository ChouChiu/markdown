# AGENTS.md — @chouchiu/markdown

React component library for rendering Markdown (GFM, syntax highlighting, GitHub Alerts, KaTeX math).

## Commands

| Task | Command |
|------|---------|
| Lint | `bun run lint` (Biome) |
| Format | `bun run format` (Biome --write) |
| Typecheck | `bun run typecheck` (tsc --noEmit) |
| Full build | `bun run build` |

Run lint and typecheck before claiming work is done. There are no tests.

## Architecture

- **Pattern:** Feature-driven — one directory per markdown feature under `src/features/`
- **Package manager:** Bun
- **Entry point:** `src/index.ts` — exports `MarkdownRenderer` and `CodeBlock`
- **Build:** tsup (JS bundling, ESM + CJS) → tsc (declaration files only) → cp (CSS)
- **Linter/formatter:** Biome — tabs for indentation, double quotes for strings
- **TypeScript:** strict mode, `noUnusedLocals`, `noUnusedParameters`

### Source layout

```
src/
  features/          # feature-driven: one dir per markdown feature
    renderer/        # main MarkdownRenderer component (entry)
    code/            # CodeBlock + code component overrides
    heading/         # heading with anchor links
    link/            # link component
    table/           # table component
    checkbox/        # task list checkbox
  shared/
    utils.ts         # stripNode, extractText, slugify
  styles/
    markdown.css     # all visual styles, scoped to .blog-module
```

Each feature dir has an `index.ts` barrel export. Components are wired together in `features/renderer/markdown-renderer.tsx` via `makeXxxComponent()` factory functions.

## Key conventions

- All components use `"use client"` directive (React 19 client components).
- CSS is scoped under `.blog-module` class. Wrap content in `<div className="blog-module">` to apply styles.
- Customization via `--cm-*` CSS variables (see README for full list).
- Tailwind utility classes appear in JSX but are not required — all essential styling lives in `markdown.css`.
- `katex` is an optional peer dependency. Math works without it installed but won't render.
- `react-markdown`, `react-syntax-highlighter`, and all remark/rehype plugins are externalized in the bundle (not inlined).

## What not to do

- Don't add a test framework or CI without asking — the project intentionally has none.
- Don't inline external dependencies in the tsup bundle; they are all marked `external`.
- Don't remove the `"use client"` directive from components.
