"use client";

import { useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { rehypeGithubAlerts } from "rehype-github-alerts";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import {
	rehypeCodeBlock,
	rehypeExternalLinks,
	rehypeHeadingIds,
	rehypeTableWrapper,
	rehypeTaskListCheckbox,
} from "../../plugins";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface MarkdownRendererProps {
	/** Raw markdown content to render */
	content: string;
	/**
	 * Custom component overrides for any HTML element rendered by react-markdown.
	 * User-provided components take precedence over default rendering.
	 * Use to inject custom rendering for elements like `div`, `code`, `a`, etc.
	 */
	components?: Components;
}

/**
 * React component that renders Markdown using a remark + rehype pipeline.
 *
 * Built-in features (all implemented as rehype plugins):
 * - GFM (tables, strikethrough, task lists, autolinks)
 * - Syntax-highlighted code blocks with copy button (Prism + Custom Element)
 * - Auto-generated heading ids
 * - External link handling (target="_blank")
 * - Responsive table wrappers
 * - GitHub Alerts
 * - KaTeX math (requires katex peer dependency)
 * - Emoji shortcodes (:smile:)
 *
 * @example
 * ```tsx
 * import { MarkdownRenderer } from "@chouchiu/markdown";
 * import "@chouchiu/markdown/styles.css";
 * // Prism theme (choose one):
 * import "prismjs/themes/prism-tomorrow.css";
 *
 * <MarkdownRenderer content="# Hello **world**" />
 * ```
 */
export function MarkdownRenderer({
	content,
	components: userComponents,
}: MarkdownRendererProps) {
	const remarkPlugins = useMemo(() => [remarkGfm, remarkEmoji, remarkMath], []);
	const rehypePlugins = useMemo(
		() => [
			// Our plugins (transform HAST before other plugins)
			rehypeCodeBlock(),
			rehypeHeadingIds(),
			rehypeExternalLinks(),
			rehypeTableWrapper(),
			rehypeTaskListCheckbox(),
			// Upstream plugins
			rehypeRaw,
			rehypeKatex,
			rehypeGithubAlerts,
		],
		[],
	);

	return (
		<div className="blog-module">
			<div className="markdown-body">
				<ReactMarkdown
					remarkPlugins={remarkPlugins}
					rehypePlugins={rehypePlugins}
					components={userComponents}
				>
					{content}
				</ReactMarkdown>
			</div>
		</div>
	);
}
