import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that adds `target="_blank"` and `rel="noopener noreferrer"`
 * to external links (href starting with `http` or `https`).
 */
export function rehypeExternalLinks(): (tree: Root) => void {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			if (node.tagName !== "a") return;

			const href = node.properties?.href;
			if (typeof href === "string" && /^https?:\/\//.test(href)) {
				const existingRel =
					typeof node.properties?.rel === "string" ? node.properties.rel : "";
				const rels = new Set(existingRel.split(/\s+/).filter(Boolean));
				rels.add("noopener");
				rels.add("noreferrer");
				node.properties = {
					...node.properties,
					target: "_blank",
					rel: [...rels].join(" "),
				};
			}
		});
	};
}
