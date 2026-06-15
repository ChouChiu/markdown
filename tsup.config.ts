import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  external: [
    "react",
    "react-dom",
    "react-markdown",
    "react-syntax-highlighter",
    "rehype-github-alerts",
    "rehype-katex",
    "rehype-raw",
    "remark-emoji",
    "remark-gfm",
    "remark-math",
    "lucide-react",
    "@iconify/react",
    "katex",
  ],
  clean: true,
  outDir: "dist",
  target: "es2020",
  platform: "browser",
  treeshake: true,
})
