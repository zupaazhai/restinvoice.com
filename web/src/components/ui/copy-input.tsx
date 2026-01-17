import { useRef } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface CopyInputProps extends React.ComponentProps<"div"> {
	value: string;
	readOnly?: boolean;
}

export function CopyInput({ value, className, readOnly = true, ...props }: CopyInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-md bg-muted p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				className
			)}
			{...props}
		>
			<input
				ref={inputRef}
				className="flex-1 bg-transparent border-none p-0 text-sm md:text-xs font-mono text-muted-foreground focus:outline-none focus:ring-0 truncate w-full"
				value={value}
				readOnly={readOnly}
				onClick={(e) => e.currentTarget.select()}
			/>
			<CopyButton
				value={value}
				variant="ghost"
				size="icon"
				className="h-8 w-8 shrink-0"
				aria-label="Copy to clipboard"
			/>
		</div>
	);
}
