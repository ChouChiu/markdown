import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { slugify } from "../shared/slugify";

/**
 * Rehype plugin that adds auto-generated `id` attributes to h1–h6 headings.
 *
 * Returns a fresh plugin instance with its own slug dedup counter.
 * Call the factory once per render to avoid stale counters.
 *
 * @example
 *   // In a unified pipeline:
 *   .use(rehypeHeadingIds())
 *
 *   // In Astro config:
 *   markdown: { rehypePlugins: [rehypeHeadingIds()] }
 */
export function rehypeHeadingIds(): (tree: Root) => void {
	const counters = new Map<string, number>();

	function uniqueSlug(text: string): string {
		const base = slugify(text);
		const count = counters.get(base);
		if (count === undefined) {
			counters.set(base, 1);
			return base;
		}
		counters.set(base, count + 1);
		return `${base}-${count}`;
	}

	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			if (
				node.tagName === "h1" ||
				node.tagName === "h2" ||
				node.tagName === "h3" ||
				node.tagName === "h4" ||
				node.tagName === "h5" ||
				node.tagName === "h6"
			) {
				// Only add id if not already present
				if (!node.properties?.id) {
					const text = extractHastText(node);
					node.properties = { ...node.properties, id: uniqueSlug(text) };
				}
			}
		});
	};
}

/** Recursively extract plain text from HAST element children. */
function extractHastText(node: Element): string {
	const parts: string[] = [];
	for (const child of node.children) {
		if (child.type === "text") {
			parts.push(child.value);
		} else if (child.type === "element") {
			parts.push(extractHastText(child as Element));
		}
	}
	return parts.join("");
}
