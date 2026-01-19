import { useAuth } from "@clerk/clerk-react";
import { LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";
import { TemplateList } from "@/components/templates/TemplateList";
import { PageHeader } from "@/components/ui/page-header";
import { templatesApi } from "@/lib/api/modules/templates";
import type { Template } from "@/types/template.types";

export function TemplatesPage() {
	const { getToken } = useAuth();
	const [templates, setTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				setIsLoading(true);
				const token = await getToken();
				const data = await templatesApi.listSystem(token);
				setTemplates(data);
			} catch (err) {
				console.error("Failed to fetch templates:", err);
				setError("Failed to load templates. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTemplates();
	}, [getToken]);

	if (error) {
		return (
			<div className="space-y-6">
				<PageHeader
					icon={LayoutTemplate}
					title="Templates"
					description="Browse and manage invoice templates for your business"
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
				icon={LayoutTemplate}
				title="Templates"
				description="Browse and manage invoice templates for your business"
			/>
			<TemplateList templates={templates} isLoading={isLoading} />
		</div>
	);
}
