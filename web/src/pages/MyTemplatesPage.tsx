import { useAuth } from "@clerk/clerk-react";
import { FolderHeart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTemplateDialog } from "@/components/templates/CreateTemplateDialog";
import { TemplateList } from "@/components/templates/TemplateList";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { templatesApi } from "@/lib/api/modules/templates";
import type { Template } from "@/types/template.types";

export function MyTemplatesPage() {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { getToken, isLoaded } = useAuth();

	useEffect(() => {
		const fetchTemplates = async () => {
			if (!isLoaded) return;
			try {
				setIsLoading(true);
				const token = await getToken();
				const data = await templatesApi.list(token);
				setTemplates(data);
			} catch (err) {
				console.error("Failed to fetch user templates:", err);
				setError("Failed to load your templates. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTemplates();
	}, [isLoaded, getToken]);

	if (error) {
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
				<div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				icon={FolderHeart}
				title="My Templates"
				description="Your customized templates for invoices and receipts"
				action={<CreateTemplateDialog onTemplateCreated={() => window.location.reload()} />}
			/>
			<TemplateList
				templates={templates}
				emptyStateTitle="No Custom Templates Yet"
				emptyStateDescription="Create your first template by customizing a system template."
				editable
				isLoading={isLoading}
			/>
		</div>
	);
}
