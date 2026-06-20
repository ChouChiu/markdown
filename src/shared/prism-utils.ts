import prism from "prismjs";

// ---------------------------------------------------------------------------
// Side-effect: load commonly used languages into prism.languages
// ---------------------------------------------------------------------------
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-diff.js";

// ---------------------------------------------------------------------------
// Language alias → Prism grammar name
// ---------------------------------------------------------------------------
const ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	jsx: "jsx",
	tsx: "tsx",
	html: "markup",
	xml: "markup",
	svg: "markup",
	sh: "bash",
	zsh: "bash",
	shell: "bash",
	py: "python",
	rs: "rust",
	yml: "yaml",
	md: "markdown",
	mdx: "markdown",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve a language identifier to a known Prism grammar name. */
export function resolveLanguage(lang: string): string | null {
	const key = lang.toLowerCase();
	const resolved = ALIASES[key] || key;
	if (resolved in prism.languages) return resolved;
	return null;
}

/** Escape HTML special characters. */
export function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
