import type { Components } from "react-markdown";
import { stripNode } from "../../shared/utils";

/** Wraps tables in a scrollable container for responsive layouts. */
export function makeTableComponent(): Pick<Components, "table"> {
	return {
		table({ children, ...props }) {
			const cleanProps = stripNode(props);
			return (
				<div className="overflow-x-auto rounded-lg">
					<table {...cleanProps}>{children}</table>
				</div>
			);
		},
	};
}
