import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import type { Template } from "@/types/template.types";

interface TemplateCardProps {
	template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(template.id);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy template ID:", error);
		}
	};

	return (
		<Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 py-0">
			<CardContent className="p-0">
				{/* Thumbnail Preview Area */}
				<div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
					<div className="text-center space-y-2 p-6">
						<div className="text-4xl font-bold text-primary/20">
							{template.type === "invoice" ? "📄" : "🧾"}
						</div>
						<p className="text-xs text-muted-foreground uppercase tracking-wider">
							{template.type}
						</p>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 p-0 pt-2 px-3 pb-3">
				<div className="w-full space-y-1">
					<CardTitle className="text-sm">{template.name}</CardTitle>
					<p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
				</div>

				{/* Template ID with Copy Button */}
				<div className="w-full flex items-center justify-between gap-2 rounded-md bg-muted p-2">
					<code className="text-xs text-muted-foreground font-mono flex-1 truncate">
						{template.id}
					</code>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						onClick={handleCopy}
						aria-label="Copy template ID"
					>
						{copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
