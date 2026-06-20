/** Convert a heading string into a URL-safe slug. */
export function slugify(text: string): string {
	const slug = text
		.toLowerCase()
		.replace(/<[^>]*>/g, "")
		.replace(/\*\*/g, "")
		.replace(/\*/g, "")
		.replace(/`/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.trim();
	return slug || "heading";
}
