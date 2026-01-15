import { FolderHeart, Plus } from "lucide-react";
import { TemplateList } from "@/components/templates/TemplateList";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import type { Template } from "@/types/template.types";

// Mock data - will be replaced with API call later
const mockUserTemplates: Template[] = [
	{
		id: "user-custom-01",
		name: "My Custom Invoice",
		description: "Personalized invoice template with my brand colors",
		type: "invoice",
		isSystem: false,
	},
	{
		id: "user-custom-02",
		name: "Project Receipt",
		description: "Receipt template for project-based work",
		type: "receipt",
		isSystem: false,
	},
];

export function MyTemplatesPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={FolderHeart}
				title="My Templates"
				description="Your customized templates for invoices and receipts"
				action={
					<Button variant="default" className="w-full sm:w-auto">
						<Plus className="h-4 w-4" />
						Create Template
					</Button>
				}
			/>
			<TemplateList
				templates={mockUserTemplates}
				emptyStateTitle="No Custom Templates Yet"
				emptyStateDescription="Create your first template by customizing a system template."
				editable
			/>
		</div>
	);
}
