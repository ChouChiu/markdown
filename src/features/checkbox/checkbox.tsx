import type { Components, ExtraProps } from "react-markdown";
import { stripNode } from "../../shared/utils";

/** Returns an `input` component for GFM task-list checkboxes. */
export function makeCheckboxComponent(): Pick<Components, "input"> {
	return {
		input({
			checked,
			...props
		}: React.InputHTMLAttributes<HTMLInputElement> & ExtraProps) {
			const cleanProps = stripNode(props);
			return (
				<input
					type="checkbox"
					checked={checked}
					readOnly
					className="markdown-checkbox"
					{...cleanProps}
				/>
			);
		},
	};
}
