# @chouchiu/markdown

React component for rendering Markdown — GFM, syntax highlighting, GitHub Alerts, KaTeX math.

## Install

```bash
npm install @chouchiu/markdown
```

Peer dependencies: `react` ^19.2.7, `react-dom` ^19.2.7. Optional: `katex` ^0.16.0 for math.

## Quick start

```tsx
import { MarkdownRenderer } from "@chouchiu/markdown"
import "@chouchiu/markdown/styles.css"
// If using math: import "katex/dist/katex.min.css"

export default function Page() {
  return (
    <div className="blog-module">
      <MarkdownRenderer content="# Hello **world**" />
    </div>
  )
}
```

## API

### `<MarkdownRenderer />`

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `string` | required | Raw markdown to render. |
| `theme` | `Record<string, CSSProperties>` | `nightOwl` | Prism theme. Import from `react-syntax-highlighter/dist/esm/styles/prism`. |
| `components` | `Components` | — | Custom element overrides (react-markdown `Components`). Merged: user values win over built-in defaults. |

```tsx
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

<MarkdownRenderer content={md} theme={oneDark} />
```

### Custom components

Override any HTML element rendered by react-markdown. User components take priority over the built-in ones.

```tsx
import type { Components } from "react-markdown"

const custom: Components = {
  // Replace <div> with your own wrapper
  div: ({ children, ...props }) => (
    <div {...props} className="my-custom-div">{children}</div>
  ),
  // Keep the built-in heading logic but add extra attributes
  h2: ({ children, ...props }) => (
    <h2 {...props} data-toc>{children}</h2>
  ),
  // Inject a contribution card after every <code> block
  code: ({ children, ...props }) => (
    <>
      <code {...props}>{children}</code>
      <GitHubContributions />
    </>
  ),
}

<MarkdownRenderer content={md} components={custom} />
```

### `<CodeBlock />`

Standalone syntax-highlighted code block, exported separately for direct use.

## Styling

All selectors are scoped under `.blog-module`. Wrap content in `<div className="blog-module">` to apply styles. No Tailwind dependency — all visual styling lives in `@chouchiu/markdown/styles.css`.

Override `--cm-*` CSS variables to customize:

```css
.blog-module {
  --cm-primary: #3b82f6;
  --cm-radius: 0.5rem;
  --cm-font-mono: "JetBrains Mono", monospace;
}
```

| Variable | Default | |
|---|---|---|
| `--cm-background` | `#ffffff` | Page background |
| `--cm-foreground` | `#1a1a1a` | Body text |
| `--cm-primary` | `#d97706` | Links, accent |
| `--cm-primary-foreground` | `#ffffff` | Text on primary |
| `--cm-muted` | `#f5f5f4` | Muted surface |
| `--cm-muted-foreground` | `#78716c` | Secondary text |
| `--cm-border` | `#e7e5e4` | Borders |
| `--cm-radius` | `0.875rem` | Corner radius |
| `--cm-font-sans` | `system-ui` | Body font family |
| `--cm-font-mono` | `"Fira Code"` | Code font family |

### Dark mode

Add `.dark` class to `.blog-module` or any ancestor:

```css
.blog-module.dark,
.dark .blog-module {
  --cm-background: #1c1917;
  --cm-foreground: #fafaf9;
  --cm-muted: #292524;
  --cm-muted-foreground: #a8a29e;
  --cm-border: rgba(255, 255, 255, 0.1);
}
```

### Tailwind

Components use Tailwind utility classes in JSX (`flex`, `gap-2`, `text-sm`, etc.). These are harmless if you don't use Tailwind — they won't affect layout without the matching CSS.

## License

MIT
