import type { Components, ExtraProps } from "react-markdown";
import { stripNode } from "../../shared/utils";

/** Returns an `a` component that sets target=_blank for external links. */
export function makeLinkComponent(): Pick<Components, "a"> {
	return {
		a({
			href,
			children,
			...props
		}: React.AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) {
			const cleanProps = stripNode(props);
			const isExternal = href?.startsWith("http");
			return (
				<a
					href={href}
					{...(isExternal
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
					{...cleanProps}
				>
					{children}
				</a>
			);
		},
	};
}
