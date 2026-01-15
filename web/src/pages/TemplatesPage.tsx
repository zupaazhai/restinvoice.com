import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { PageHeader } from "@/components/ui/page-header";

export function TemplatesPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={LayoutTemplate}
				title="Templates"
				description="Browse and manage invoice templates for your business"
			/>

			<Empty className="min-h-[400px] border border-border bg-card">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<LayoutTemplate />
					</EmptyMedia>
					<EmptyTitle>No Templates Yet</EmptyTitle>
					<EmptyDescription>
						Start by creating your first invoice template or choose from our pre-made designs.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="default">
						<LayoutTemplate className="h-4 w-4" />
						Create Template
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
