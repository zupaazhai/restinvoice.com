import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import type { Template } from "@/types/template.types";

interface TemplateCardProps {
	template: Template;
	/** Optional link URL - when provided, clicking the thumbnail navigates to this URL */
	linkTo?: string;
}

export function TemplateCard({ template, linkTo }: TemplateCardProps) {

	const thumbnailContent = (
		<div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
			<div className="text-center space-y-2 p-6">
				<div className="text-4xl font-bold text-primary/20">
					{template.type === "invoice" ? "📄" : "🧾"}
				</div>
				<p className="text-xs text-muted-foreground uppercase tracking-wider">{template.type}</p>
			</div>
		</div>
	);

	return (
		<Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 py-0 gap-4">
			<CardContent className="p-0">
				{linkTo ? (
					<Link to={linkTo} className="block cursor-pointer">
						{thumbnailContent}
					</Link>
				) : (
					thumbnailContent
				)}
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 p-0 px-3 pb-3">
				<div className="w-full space-y-1">
					<CardTitle className="text-sm">{template.name}</CardTitle>
					<p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
				</div>

				{/* Template ID with Copy Button */}
				<div className="w-full flex items-center justify-between gap-2 rounded-md bg-muted p-2">
					<code className="text-xs text-muted-foreground font-mono flex-1 truncate">
						{template.id}
					</code>
					<CopyButton
						value={template.id}
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						aria-label="Copy template ID"
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
