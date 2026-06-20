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
			const { rel: existingRel, ...cleanProps } = stripNode(props);
			const isExternal = href?.startsWith("http");

			let rel: string | undefined;
			if (isExternal) {
				const existing = typeof existingRel === "string" ? existingRel : "";
				const rels = new Set(existing.split(/\s+/).filter(Boolean));
				rels.add("noopener");
				rels.add("noreferrer");
				rel = [...rels].join(" ");
			}

			return (
				<a
					href={href}
					{...cleanProps}
					{...(isExternal ? { target: "_blank", rel } : {})}
				>
					{children}
				</a>
			);
		},
	};
}
