import { useAuth } from "@clerk/clerk-react";
import { Code, Eye, FileEdit, Save, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TemplateCodeEditor } from "@/components/templates/TemplateCodeEditor";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import {
	TemplateVariablesContent,
	TemplateVariablesPanel,
} from "@/components/templates/TemplateVariablesPanel";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { templatesApi } from "@/lib/api/modules/templates";
import { renderTemplate } from "@/lib/templateRenderer";
import {
	transformVariablesToArray,
	transformVariablesToRecord,
} from "@/lib/transformers/template.transformer";
import type { TemplateVariable } from "@/types/template.types";

export function TemplateEditorPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getToken, isLoaded } = useAuth();

	const [mode, setMode] = useState<"preview" | "code">("preview");
	const [templateName, setTemplateName] = useState("");
	const [templateHtml, setTemplateHtml] = useState("");
	const [variables, setVariables] = useState<TemplateVariable[]>([]);
	const [isVariablesPanelOpen, setIsVariablesPanelOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const fetchTemplate = async () => {
			if (!isLoaded || !id) return;
			try {
				setIsLoading(true);
				const token = await getToken();
				const template = await templatesApi.get(id, token);

				setTemplateName(template.name);
				setTemplateHtml(template.html_content);
				setVariables(transformVariablesToArray(template.variables));
			} catch (error) {
				console.error("Failed to load template:", error);
				// toast.error("Failed to load template");
				navigate("/my-templates");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTemplate();
	}, [isLoaded, id, getToken, navigate]);

	// Render template with Handlebars
	const renderedHtml = useMemo(() => {
		const variablesRecord = Object.fromEntries(variables.map((v) => [v.id, v.value]));
		return renderTemplate({ html: templateHtml, variables: variablesRecord });
	}, [templateHtml, variables]);

	const handleVariableChange = (id: string, value: string) => {
		setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, value } : v)));
	};

	const handleAddVariable = (variable: Omit<TemplateVariable, "value">) => {
		setVariables((prev) => [
			...prev,
			{
				...variable,
				value: "", // Default empty value for the new variable
			},
		]);
	};

	const handleEditVariable = (oldId: string, updatedVariable: Omit<TemplateVariable, "value">) => {
		setVariables((prev) =>
			prev.map((v) => {
				if (v.id === oldId) {
					// Preserve the value when updating
					return {
						...updatedVariable,
						value: v.value,
					};
				}
				return v;
			})
		);
	};

	const handleDeleteVariable = (id: string) => {
		setVariables((prev) => prev.filter((v) => v.id !== id));
	};

	const handleReorderVariables = (reorderedVariables: TemplateVariable[]) => {
		setVariables(reorderedVariables);
	};

	const handleSave = async () => {
		if (!id) return;
		try {
			setIsSaving(true);
			const token = await getToken();
			await templatesApi.update(
				id,
				{
					html_content: templateHtml,
					variables: transformVariablesToRecord(variables),
				},
				token
			);
			// toast.success("Template saved successfully");
		} catch (error) {
			console.error("Failed to save template:", error);
			// toast.error("Failed to save template");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col gap-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="space-y-1">
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-48" />
					</div>
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="flex min-h-0 flex-1 gap-6">
					<div className="flex-1 overflow-hidden rounded-xl border bg-card">
						<Skeleton className="h-full w-full" />
					</div>
					<div className="hidden w-80 lg:block">
						<Skeleton className="h-full w-full rounded-xl" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col gap-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<PageHeader
					icon={FileEdit}
					title={`Edit: ${templateName}`}
					description="Customize your invoice template"
				/>

				<div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start">
					{/* Mode Toggle - Left on mobile */}
					<Tabs value={mode} onValueChange={(v) => setMode(v as "preview" | "code")}>
						<TabsList>
							<TabsTrigger value="preview">
								<Eye className="h-4 w-4" />
								Preview
							</TabsTrigger>
							<TabsTrigger value="code">
								<Code className="h-4 w-4" />
								Code
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Right side buttons group */}
					<div className="flex items-center gap-2">
						{/* Mobile Variables Panel Trigger - only in preview mode */}
						{mode === "preview" && (
							<Sheet open={isVariablesPanelOpen} onOpenChange={setIsVariablesPanelOpen}>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon" className="lg:hidden">
										<Settings className="h-4 w-4" />
										<span className="sr-only">Toggle variables panel</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="flex w-80 flex-col p-0">
									<SheetHeader className="sr-only">
										<SheetTitle>Template Variables</SheetTitle>
									</SheetHeader>
									<TemplateVariablesContent
										variables={variables}
										onVariableChange={handleVariableChange}
										onAddVariable={handleAddVariable}
										onEditVariable={handleEditVariable}
										onDeleteVariable={handleDeleteVariable}
										onReorderVariables={handleReorderVariables}
									/>
								</SheetContent>
							</Sheet>
						)}

						{/* Save Button - Icon only on mobile */}
						<Button variant="default" onClick={handleSave} isLoading={isSaving}>
							<Save className="h-4 w-4" />
							<span className="ml-2 hidden lg:inline">Save Template</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex min-h-0 flex-1 gap-6">
				{mode === "preview" ? (
					<>
						{/* Preview Area */}
						<div className="flex-1 overflow-hidden">
							<TemplatePreview html={renderedHtml} />
						</div>
						{/* Variables Sidebar - Hidden on mobile */}
						<div className="hidden lg:block">
							<TemplateVariablesPanel
								variables={variables}
								onVariableChange={handleVariableChange}
								onAddVariable={handleAddVariable}
								onEditVariable={handleEditVariable}
								onDeleteVariable={handleDeleteVariable}
								onReorderVariables={handleReorderVariables}
							/>
						</div>
					</>
				) : (
					/* Code Editor */
					<div className="flex-1 overflow-hidden">
						<TemplateCodeEditor value={templateHtml} onChange={setTemplateHtml} />
					</div>
				)}
			</div>
		</div>
	);
}
