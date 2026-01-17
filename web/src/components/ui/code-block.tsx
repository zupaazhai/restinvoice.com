import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
	language: string;
	code: string;
	className?: string;
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
	return (
		<div className={cn("relative overflow-hidden rounded-xl", className)}>
			<CopyButton
				value={code}
				variant="ghost"
				size="icon-sm"
				className="absolute right-3 top-3 z-10 text-white hover:text-white hover:bg-white/20"
				aria-label="Copy code"
			/>
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
