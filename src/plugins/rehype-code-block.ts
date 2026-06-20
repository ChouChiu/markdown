import type { Element, Root, Text } from "hast";
import prism from "prismjs";
import { visit } from "unist-util-visit";
import { escapeHtml, resolveLanguage } from "../shared/prism-utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the raw code string from a HAST code element's children. */
function extractCodeString(node: Element): string {
	return node.children
		.map((child) => {
			if (child.type === "text") return (child as Text).value;
			if (child.type === "raw") return (child as { value: string }).value;
			return "";
		})
		.join("");
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export interface RehypeCodeBlockOptions {
	/**
	 * Whether to include the copy-code-button in the header.
	 * Requires the `<copy-code-button>` Custom Element to be registered.
	 * @default true
	 */
	copyButton?: boolean;
}

/**
 * Rehype plugin that syntax-highlights fenced code blocks using Prism
 * and wraps them in a styled container with a language label and optional
 * copy button.
 *
 * Highlighted code is emitted as a `raw` node — make sure `rehype-raw`
 * runs _after_ this plugin in your pipeline.
 *
 * @example
 *   // In a unified pipeline (order matters!):
 *   .use(rehypeCodeBlock())
 *   .use(rehypeRaw)
 *
 *   // In Astro config:
 *   markdown: {
 *     rehypePlugins: [rehypeCodeBlock(), rehypeRaw]
 *   }
 */
export function rehypeCodeBlock(
	options: RehypeCodeBlockOptions = {},
): (tree: Root) => void {
	const { copyButton = true } = options;

	return (tree: Root) => {
		visit(tree, "element", (node: Element, index, parent) => {
			// We're looking for <pre> that contains a single <code> child
			if (node.tagName !== "pre") return;
			if (parent === undefined || index === undefined) return;

			const codeEl = node.children.find(
				(c): c is Element => c.type === "element" && c.tagName === "code",
			);
			if (!codeEl) return;

			const classNames = codeEl.properties?.className;
			const classList: string[] = (
				Array.isArray(classNames)
					? classNames
					: typeof classNames === "string"
						? [classNames]
						: []
			) as string[];

			const langClass = classList.find((c) => c.startsWith("language-"));
			if (!langClass) return;

			const lang = langClass.slice("language-".length);
			const codeString = extractCodeString(codeEl).replace(/\n$/, "");

			// ---- Syntax highlight ----
			const resolvedLang = resolveLanguage(lang);
			let highlighted: string;
			if (resolvedLang) {
				try {
					highlighted = prism.highlight(
						codeString,
						prism.languages[resolvedLang],
						resolvedLang,
					);
				} catch {
					highlighted = escapeHtml(codeString);
				}
			} else {
				highlighted = escapeHtml(codeString);
			}

			// Replace <code> children with the highlighted raw HTML node.
			// rehype-raw (must run after this plugin) will parse it into HAST.
			const highlightedCodeEl: Element = {
				...codeEl,
				children: [{ type: "raw", value: highlighted }],
			};

			// ---- Build the wrapper structure ----
			const displayLang = lang || "text";

			const headerChildren: (Element | Text)[] = [
				{ type: "text", value: displayLang },
			];

			if (copyButton) {
				// <copy-code-button data-code="..."></copy-code-button>
				headerChildren.push({
					type: "element",
					tagName: "copy-code-button",
					properties: { "data-code": codeString },
					children: [],
				});
			}

			const header: Element = {
				type: "element",
				tagName: "div",
				properties: { className: ["markdown-code-header"] },
				children: headerChildren,
			};

			const updatedPre: Element = {
				...node,
				children: [highlightedCodeEl],
			};

			const wrapper: Element = {
				type: "element",
				tagName: "div",
				properties: { className: ["markdown-code-block"] },
				children: [header, updatedPre],
			};

			// Replace the original <pre> with the wrapper
			(parent as Element).children[index] = wrapper;
		});
	};
}
