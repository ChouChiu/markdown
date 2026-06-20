import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that wraps each `<table>` in a responsive scroll container.
 *
 * Transforms:  <table>...</table>
 * Into:  <div class="overflow-x-auto rounded-lg"><table>...</table></div>
 */
export function rehypeTableWrapper(): (tree: Root) => void {
	return (tree: Root) => {
		visit(tree, "element", (node: Element, index, parent) => {
			if (node.tagName !== "table") return;
			if (parent === undefined || index === undefined) return;

			const wrapper: Element = {
				type: "element",
				tagName: "div",
				properties: { className: ["overflow-x-auto", "rounded-lg"] },
				children: [node],
			};

			(parent as Element).children[index] = wrapper;
		});
	};
}
