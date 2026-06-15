import type { Components } from "react-markdown";

/** Wraps tables in a scrollable container for responsive layouts. */
export function makeTableComponent(): Pick<Components, "table"> {
	return {
		table({ children }) {
			return (
				<div className="overflow-x-auto rounded-lg">
					<table>{children}</table>
				</div>
			);
		},
	};
}
