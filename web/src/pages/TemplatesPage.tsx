import { LayoutTemplate } from "lucide-react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { PageHeader } from "@/components/ui/page-header";
import type { Template } from "@/types/template.types";

// Mock data - will be replaced with API call later
const mockTemplates: Template[] = [
	{
		id: "system-modern-01",
		name: "Modern Invoice",
		description: "Clean, minimal design perfect for tech companies and startups",
		type: "invoice",
		isSystem: true,
	},
	{
		id: "system-corporate-01",
		name: "Corporate Invoice",
		description: "Formal business style with professional layout",
		type: "invoice",
		isSystem: true,
	},
	{
		id: "system-creative-01",
		name: "Creative Invoice",
		description: "Designer-friendly layout with vibrant accents",
		type: "invoice",
		isSystem: true,
	},
	{
		id: "system-detailed-01",
		name: "Detailed Invoice",
		description: "Itemized breakdown with comprehensive tax calculations",
		type: "invoice",
		isSystem: true,
	},
	{
		id: "system-receipt-simple",
		name: "Simple Receipt",
		description: "Basic receipt for quick transactions",
		type: "receipt",
		isSystem: true,
	},
	{
		id: "system-receipt-detailed",
		name: "Detailed Receipt",
		description: "Full transaction details with customer information",
		type: "receipt",
		isSystem: true,
	},
];

export function TemplatesPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={LayoutTemplate}
				title="Templates"
				description="Browse and manage invoice templates for your business"
			/>

			{/* Template Grid - Mobile First: 2 columns → 3 columns (md) → 4 columns (lg) */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
				{mockTemplates.map((template) => (
					<TemplateCard key={template.id} template={template} />
				))}
			</div>
		</div>
	);
}
