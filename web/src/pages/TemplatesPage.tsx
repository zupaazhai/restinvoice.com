import { LayoutTemplate, Search } from "lucide-react";
import { useState } from "react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Template, TemplateType } from "@/types/template.types";

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

type FilterType = "all" | TemplateType;

export function TemplatesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<FilterType>("all");

	// Filter templates based on search query and type
	const filteredTemplates = mockTemplates.filter((template) => {
		const matchesType = typeFilter === "all" || template.type === typeFilter;
		const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	return (
		<div className="space-y-6">
			<PageHeader
				icon={LayoutTemplate}
				title="Templates"
				description="Browse and manage invoice templates for your business"
			/>

			{/* Filter Bar */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				{/* Type Filter Tabs */}
				<Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as FilterType)}>
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="invoice">Invoice</TabsTrigger>
						<TabsTrigger value="receipt">Receipt</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Search Input */}
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search templates..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			{/* Template Grid or Empty State */}
			{filteredTemplates.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
					{filteredTemplates.map((template) => (
						<TemplateCard key={template.id} template={template} />
					))}
				</div>
			) : (
				<Empty className="min-h-[400px] border border-border bg-card">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Search />
						</EmptyMedia>
						<EmptyTitle>No Templates Found</EmptyTitle>
						<EmptyDescription>
							Try adjusting your search or filter to find what you're looking for.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<button
							type="button"
							onClick={() => {
								setSearchQuery("");
								setTypeFilter("all");
							}}
							className="text-sm text-primary hover:underline"
						>
							Clear filters
						</button>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}
