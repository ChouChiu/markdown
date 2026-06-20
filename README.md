# @chouchiu/markdown

Framework-agnostic Markdown renderer — GFM, syntax highlighting, GitHub Alerts, KaTeX math.

Ships **rehype plugins** (works with Astro, VitePress, unified, etc.) + **React components**.

## Install

```bash
npm install @chouchiu/markdown
```

## Quick start

### React

```tsx
import { MarkdownRenderer } from "@chouchiu/markdown";
import "@chouchiu/markdown/styles.css";
// Import a Prism theme for syntax highlighting:
import "prismjs/themes/prism-tomorrow.css";

export default function Page() {
  return (
    <div className="blog-module">
      <MarkdownRenderer content="# Hello **world**" />
    </div>
  );
}
```

### Astro

```js
// astro.config.mjs
import {
  rehypeCodeBlock,
  rehypeExternalLinks,
  rehypeHeadingIds,
  rehypeTableWrapper,
  rehypeTaskListCheckbox,
} from "@chouchiu/markdown/plugins";

export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeCodeBlock(),
      rehypeHeadingIds(),
      rehypeExternalLinks(),
      rehypeTableWrapper(),
      rehypeTaskListCheckbox(),
    ],
  },
});
```

Then apply the styles in your global CSS:

```css
@import "@chouchiu/markdown/styles.css";
/* For dark mode support */
@import "prismjs/themes/prism-tomorrow.css";
```

### Generic unified pipeline

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import {
  rehypeCodeBlock,
  rehypeHeadingIds,
} from "@chouchiu/markdown/plugins";

const html = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  // Our plugins (before rehype-raw)
  .use(rehypeCodeBlock())
  .use(rehypeHeadingIds())
  // Upstream plugins
  .use(rehypeRaw)
  .use(rehypeStringify)
  .process("# Hello world\n\n```ts\nconst x = 1;\n```");

console.log(String(html));
```

> **Important**: `rehypeCodeBlock()` emits raw HTML nodes for syntax-highlighted code. Make sure `rehype-raw` runs **after** it in your pipeline.

---

## API

### React: `<MarkdownRenderer />`

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `string` | required | Raw markdown to render. |
| `components` | `Components` | — | Custom element overrides (react-markdown `Components`). User values take priority. |

```tsx
import { MarkdownRenderer } from "@chouchiu/markdown";
import type { Components } from "react-markdown";

const custom: Components = {
  h2: ({ children, ...props }) => (
    <h2 {...props} data-toc>{children}</h2>
  ),
};

<MarkdownRenderer content={md} components={custom} />
```

The `theme` prop from v1.x has been removed. Syntax highlighting is now done via Prism at build-time. Import a Prism CSS theme instead.

### React: `<CodeBlock />`

Standalone syntax-highlighted code block (uses Prism + `<copy-code-button>` Custom Element).

```tsx
import { CodeBlock } from "@chouchiu/markdown";
import "prismjs/themes/prism-tomorrow.css";

<CodeBlock language="typescript" codeString="const x: number = 1;" />
```

### Rehype Plugins

All plugins are available from `@chouchiu/markdown/plugins`:

| Plugin | Description |
|---|---|
| `rehypeCodeBlock(opts?)` | Prism syntax highlighting + language label + copy button |
| `rehypeHeadingIds()` | Auto-generated `id` on h1–h6 from text content |
| `rehypeExternalLinks()` | `target="_blank"` on external links |
| `rehypeTableWrapper()` | Wraps tables in responsive scroll container |
| `rehypeTaskListCheckbox()` | Enhances GFM task-list checkboxes |

#### `rehypeCodeBlock(options)`

```ts
interface RehypeCodeBlockOptions {
  /** Include copy-code-button in header. Default: true */
  copyButton?: boolean;
}
```

#### `rehypeHeadingIds()`

Factory function — call it to get a fresh plugin instance with its own slug dedup counter. Call once per render.

### Custom Element: `<copy-code-button>`

Framework-agnostic copy-to-clipboard button. Auto-registers on import.

```js
// Import as side-effect (auto-registers <copy-code-button>)
import "@chouchiu/markdown/elements";
```

```html
<!-- Usage -->
<copy-code-button data-code="const x = 1;"></copy-code-button>
```

The element renders inline SVG icons (copy / check) inside a Shadow DOM. No external icon library required.

---

## Styling

All selectors are scoped under `.blog-module`. Wrap content in `<div className="blog-module">` to apply styles. No Tailwind dependency.

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

### Prism theme

Import a Prism CSS theme for syntax highlighting colors:

```css
@import "prismjs/themes/prism-tomorrow.css";
```

Available themes: `prism`, `prism-tomorrow`, `prism-coy`, `prism-funky`, `prism-okaidia`, `prism-solarizedlight`, `prism-twilight`, etc.

---

## Migrating from v1.x

- The `theme` prop on `MarkdownRenderer` and `CodeBlock` is removed. Import a Prism CSS theme instead.
- `react-syntax-highlighter` is no longer a dependency. `prismjs` is used directly.
- `lucide-react` and `@iconify/react` are no longer dependencies. Icons are inline SVGs inside a Custom Element Shadow DOM.
- New exports: `@chouchiu/markdown/plugins` (rehype plugins) and `@chouchiu/markdown/elements` (Custom Element).

## License

MIT
