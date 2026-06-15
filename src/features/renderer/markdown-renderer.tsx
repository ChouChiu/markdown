"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { rehypeGithubAlerts } from "rehype-github-alerts";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { makeCheckboxComponent } from "../checkbox";
import { makeCodeComponents } from "../code";
import { makeHeadingComponents } from "../heading";
import { makeLinkComponent } from "../link";
import { makeTableComponent } from "../table";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface MarkdownRendererProps {
	/** Raw markdown content to render */
	content: string;
	/**
	 * Prism syntax highlighting theme.
	 * Import from react-syntax-highlighter/dist/esm/styles/prism.
	 * @default nightOwl
	 */
	theme?: { [key: string]: CSSProperties };
}

export function MarkdownRenderer({
	content,
	theme = nightOwl,
}: MarkdownRendererProps) {
	const remarkPlugins = useMemo(() => [remarkGfm, remarkEmoji, remarkMath], []);
	const rehypePlugins = useMemo(
		() => [rehypeRaw, rehypeKatex, rehypeGithubAlerts],
		[],
	);

	const components = useMemo(
		() => ({
			...makeHeadingComponents(),
			...makeCodeComponents(theme),
			...makeLinkComponent(),
			...makeTableComponent(),
			...makeCheckboxComponent(),
		}),
		[theme],
	);

	return (
		<div className="blog-module">
			<div className="markdown-body">
				<ReactMarkdown
					remarkPlugins={remarkPlugins}
					rehypePlugins={rehypePlugins}
					components={components}
				>
					{content}
				</ReactMarkdown>
			</div>
		</div>
	);
}
