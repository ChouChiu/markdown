import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		plugins: "src/plugins/index.ts",
		elements: "src/elements/index.ts",
	},
	format: ["esm", "cjs"],
	dts: false,
	external: [
		"react",
		"react-dom",
		"react-markdown",
		"rehype-github-alerts",
		"rehype-katex",
		"rehype-raw",
		"remark-emoji",
		"remark-gfm",
		"remark-math",
		"unist-util-visit",
		"prismjs",
		"katex",
	],
	clean: true,
	outDir: "dist",
	target: "es2020",
	platform: "browser",
	treeshake: true,
});
