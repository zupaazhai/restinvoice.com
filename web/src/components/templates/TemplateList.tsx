import { Search } from "lucide-react";
import { useState } from "react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateSkeleton } from "@/components/templates/TemplateSkeleton";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Template, TemplateType } from "@/types/template.types";

type FilterType = "all" | TemplateType;

interface TemplateListProps {
	/** Array of templates to display */
	templates: Template[];
	/** Custom empty state title */
	emptyStateTitle?: string;
	/** Custom empty state description */
	emptyStateDescription?: string;
	/** When true, clicking template thumbnail navigates to edit page */
	editable?: boolean;
	/** Loading state */
	isLoading?: boolean;
}

export function TemplateList({
	templates,
	emptyStateTitle = "No Templates Found",
	emptyStateDescription = "Try adjusting your search or filter to find what you're looking for.",
	editable = false,
	isLoading = false,
}: TemplateListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<FilterType>("all");

	// Loading State
	if (isLoading) {
		return (
			<div className="space-y-6">
				{/* Loading Filter Bar */}
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="w-full md:w-64">
						<div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
					</div>
					<div className="w-full md:w-80">
						<div className="h-10 w-full rounded-md bg-muted animate-pulse" />
					</div>
				</div>
				{/* Loading Grid */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are static
						<TemplateSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	// Filter templates based on search query and type
	const filteredTemplates = templates.filter((template) => {
		const matchesType = typeFilter === "all" || template.type === typeFilter;
		const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesType && matchesSearch;
	});

	const handleClearFilters = () => {
		setSearchQuery("");
		setTypeFilter("all");
	};

	return (
		<div className="space-y-6">
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
						<TemplateCard
							key={template.id}
							template={template}
							linkTo={editable ? `/my-templates/${template.id}/edit` : undefined}
						/>
					))}
				</div>
			) : (
				<Empty className="min-h-[400px] border border-border bg-card">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Search />
						</EmptyMedia>
						<EmptyTitle>{emptyStateTitle}</EmptyTitle>
						<EmptyDescription>{emptyStateDescription}</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<button
							type="button"
							onClick={handleClearFilters}
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
