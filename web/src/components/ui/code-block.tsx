import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
	language: string;
	code: string;
	className?: string;
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={cn("relative overflow-hidden rounded-xl", className)}>
			<Button
				variant="ghost"
				size="icon-sm"
				className="absolute right-3 top-3 z-10 text-white hover:text-white hover:bg-white/20"
				onClick={handleCopy}
				aria-label={copied ? "Copied" : "Copy code"}
			>
				{copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
			</Button>
			<SyntaxHighlighter
				language={language}
				style={vscDarkPlus}
				customStyle={{
					margin: 0,
					padding: "1.5rem",
					fontSize: "0.875rem",
					lineHeight: "1.6",
				}}
				wrapLines={true}
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}
