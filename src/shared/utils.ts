import { isValidElement } from "react";

/** Strip the `node` prop that react-markdown injects into every component. */
export function stripNode<T extends Record<string, unknown>>(
	props: T,
): Omit<T, "node"> {
	const { node, ...rest } = props;
	return rest as Omit<T, "node">;
}

/** Recursively extract plain text from React children. */
export function extractText(children: React.ReactNode): string {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (Array.isArray(children)) return children.map(extractText).join("");
	if (isValidElement(children)) {
		return extractText(
			(children.props as { children?: React.ReactNode }).children,
		);
	}
	return "";
}

export { slugify } from "./slugify";
