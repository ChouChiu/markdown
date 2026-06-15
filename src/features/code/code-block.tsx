"use client";

import { Icon } from "@iconify/react";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export function CodeBlock({
	language,
	codeString,
	theme,
}: {
	language: string;
	codeString: string;
	theme: { [key: string]: CSSProperties };
}) {
	const [copied, setCopied] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(codeString);
			setCopied(true);
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API unavailable (non-secure context, iframe, etc.)
		}
	}, [codeString]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	return (
		<div className="markdown-code-block">
			<div className="markdown-code-header">
				<div className="flex items-center gap-2">
					<Icon icon={`devicon:${language}`} className="markdown-code-icon" />
					<span>{language}</span>
				</div>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={copied ? "Copied" : "Copy code"}
					className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:bg-white/10 hover:text-white"
				>
					{copied ? (
						<>
							<Check className="size-3" />
							<span>Copied!</span>
						</>
					) : (
						<>
							<Copy className="size-3" />
							<span>Copy</span>
						</>
					)}
				</button>
			</div>
			<SyntaxHighlighter
				language={language}
				style={theme}
				customStyle={{
					margin: 0,
					borderRadius: "0 0 var(--cm-radius) var(--cm-radius)",
					fontSize: "0.875rem",
				}}
			>
				{codeString}
			</SyntaxHighlighter>
		</div>
	);
}
