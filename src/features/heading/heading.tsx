import type { Components } from "react-markdown";
import { createElement } from "react";
import { extractText, stripNode, slugify } from "../../shared/utils";

/**
 * Create heading components (h1–h6) that auto-generate an id from the text content.
 * This replaces the six near-identical handler blocks.
 */
export function makeHeadingComponents(): Pick<
	Components,
	"h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> {
	function heading(level: number) {
		const tag = `h${level}` as const;
		return function Heading({
			children,
			...props
		}: React.HTMLAttributes<HTMLElement> & { node?: unknown }) {
			const cleanProps = stripNode(props);
			const text = extractText(children);
			const id = slugify(text);
			return createElement(tag, { id, ...cleanProps }, children);
		};
	}

	return {
		h1: heading(1),
		h2: heading(2),
		h3: heading(3),
		h4: heading(4),
		h5: heading(5),
		h6: heading(6),
	};
}
