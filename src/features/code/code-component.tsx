"use client";

import type { CSSProperties } from "react";
import type { Components, ExtraProps } from "react-markdown";
import { stripNode } from "../../shared/utils";
import { CodeBlock } from "./code-block";

/**
 * Returns { code, pre } components for react-markdown.
 * Fenced code blocks get syntax highlighting; inline code stays plain.
 *
 * @deprecated Since v2.0, fenced code blocks are handled by the rehype-code-block
 * plugin. Use `rehypeCodeBlock()` in your rehype pipeline instead.
 * This factory remains for legacy custom component usage only.
 */
export function makeCodeComponents(_syntaxTheme: {
	[key: string]: CSSProperties;
}): Pick<Components, "code" | "pre"> {
	return {
		pre({ children }) {
			return <>{children}</>;
		},
		code({
			className,
			children,
			...props
		}: React.HTMLAttributes<HTMLElement> & ExtraProps) {
			const cleanProps = stripNode(props);
			const match = /language-(\w+)/.exec(className || "");
			const language = match ? match[1] : "";
			const codeString = String(children).replace(/\n$/, "");

			if (match) {
				return <CodeBlock language={language} codeString={codeString} />;
			}

			return (
				<code className={className} {...cleanProps}>
					{children}
				</code>
			);
		},
	};
}
