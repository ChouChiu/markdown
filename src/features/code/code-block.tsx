"use client";

import prism from "prismjs";
import { createElement, useMemo } from "react";

import "../../elements/copy-code-button";
import { escapeHtml, resolveLanguage } from "../../shared/prism-utils";

// ---------------------------------------------------------------------------
// CodeBlock
// ---------------------------------------------------------------------------

export interface CodeBlockProps {
	/** Programming language identifier (e.g. "typescript", "python") */
	language: string;
	/** Raw source code to highlight */
	codeString: string;
}

/**
 * Standalone syntax-highlighted code block component.
 *
 * Uses Prism for highlighting and a `<copy-code-button>` Custom Element
 * for the copy-to-clipboard button. No external icon library required.
 *
 * For syntax highlighting colors, import a Prism theme CSS:
 *   import "prismjs/themes/prism-tomorrow.css";
 *
 * @example
 * ```tsx
 * import { CodeBlock } from "@chouchiu/markdown";
 * <CodeBlock language="typescript" codeString="const x = 1;" />
 * ```
 */
export function CodeBlock({ language, codeString }: CodeBlockProps) {
	const highlighted = useMemo(() => {
		const resolvedLang = resolveLanguage(language);
		if (resolvedLang) {
			try {
				return prism.highlight(
					codeString,
					prism.languages[resolvedLang],
					resolvedLang,
				);
			} catch {
				return escapeHtml(codeString);
			}
		}
		return escapeHtml(codeString);
	}, [language, codeString]);

	return (
		<div className="markdown-code-block">
			<div className="markdown-code-header">
				<span>{language}</span>
				{createElement("copy-code-button", { "data-code": codeString })}
			</div>
			<pre style={{ margin: 0 }}>
				<code
					className={`language-${language}`}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Prism output
					dangerouslySetInnerHTML={{ __html: highlighted }}
				/>
			</pre>
		</div>
	);
}
