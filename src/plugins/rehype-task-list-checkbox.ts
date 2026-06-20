import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that enhances GFM task-list checkboxes:
 * - Adds `type="checkbox"` and `readOnly` attributes
 * - Adds `markdown-checkbox` class for styling
 *
 * remark-gfm outputs checkboxes as `<input>` with `checked` and `disabled`
 * attributes inside `<li class="task-list-item">`.
 */
export function rehypeTaskListCheckbox(): (tree: Root) => void {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			if (node.tagName !== "input") return;

			// Only target checkboxes inside task-list items
			// remark-gfm sets checked + disabled attributes on task list inputs
			if (
				node.properties?.disabled !== undefined ||
				node.properties?.checked !== undefined
			) {
				const existingClass = node.properties?.className;
				const classNames = Array.isArray(existingClass)
					? existingClass
					: typeof existingClass === "string"
						? [existingClass]
						: [];

				node.properties = {
					...node.properties,
					type: "checkbox",
					readOnly: true,
					className: [...classNames, "markdown-checkbox"],
				};
			}
		});
	};
}
