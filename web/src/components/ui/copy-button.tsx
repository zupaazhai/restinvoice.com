import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface CopyButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	value: string;
}

export function CopyButton({ value, className, variant = "outline", size = "icon", ...props }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn(
				"shrink-0 transition-all",
				copied && "border-green-500 text-green-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20",
				className
			)}
			onClick={handleCopy}
			aria-label={copied ? "Copied" : "Copy to clipboard"}
			type="button"
			{...props}
		>
			{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
		</Button>
	);
}
