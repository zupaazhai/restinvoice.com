import { Code, Eye, FileEdit, Save, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { TemplateCodeEditor } from "@/components/templates/TemplateCodeEditor";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import {
	TemplateVariablesContent,
	TemplateVariablesPanel,
} from "@/components/templates/TemplateVariablesPanel";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TemplateVariable } from "@/types/template.types";

// Default Template Constants
const DEFAULT_TEMPLATE = `
<div style="font-family: sans-serif; color: #333; padding: 40px; background: #fff; max-width: 800px; margin: auto;">
  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px;">
    <div>
      <img src="{{logo_url}}" alt="Logo" style="height: 60px; margin-bottom: 10px; border-radius: 4px;" />
      <h1 style="margin: 0; color: {{primary_color}}; font-size: 28px;">{{company_name}}</h1>
    </div>
    <div style="text-align: right;">
      <h2 style="margin: 0; color: #666; font-size: 24px;">INVOICE</h2>
      <p style="margin: 5px 0 0; color: #999;">#INV-2024-001</p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
    <div>
      <h4 style="margin: 0 0 10px; color: {{primary_color}}; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Bill To</h4>
      <p style="margin: 0; font-weight: bold;">John Doe</p>
      <p style="margin: 4px 0; color: #666;">123 Business Lane<br/>Silicon Valley, CA 94025</p>
    </div>
    <div style="text-align: right;">
      <h4 style="margin: 0 0 10px; color: {{primary_color}}; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Details</h4>
      <p style="margin: 4px 0;"><strong>Date:</strong> Oct 24, 2024</p>
      <p style="margin: 4px 0;"><strong>Due Date:</strong> Nov 07, 2024</p>
    </div>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
    <thead>
      <tr style="border-bottom: 2px solid {{primary_color}};">
        <th style="text-align: left; padding: 12px 0; font-size: 14px; color: #666;">Description</th>
        <th style="text-align: center; padding: 12px 0; font-size: 14px; color: #666;">Quantity</th>
        <th style="text-align: right; padding: 12px 0; font-size: 14px; color: #666;">Price</th>
        <th style="text-align: right; padding: 12px 0; font-size: 14px; color: #666;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 0;">Premium Subscription Template</td>
        <td style="padding: 15px 0; text-align: center;">1</td>
        <td style="padding: 15px 0; text-align: right;">$49.00</td>
        <td style="padding: 15px 0; text-align: right;">$49.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 0;">API Access Fee</td>
        <td style="padding: 15px 0; text-align: center;">1</td>
        <td style="padding: 15px 0; text-align: right;">$10.00</td>
        <td style="padding: 15px 0; text-align: right;">$10.00</td>
      </tr>
    </tbody>
  </table>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 250px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #666;">Subtotal</span>
        <span>$59.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #666;">Tax (0%)</span>
        <span>$0.00</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #eee; font-weight: bold; font-size: 18px;">
        <span>Total</span>
        <span style="color: {{primary_color}};">$59.00</span>
      </div>
    </div>
  </div>

  <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
    {{footer_text}}
  </div>
</div>
`;

const INITIAL_VARIABLES: TemplateVariable[] = [
	{
		id: "primary_color",
		label: "Primary Color",
		type: "color",
		value: "#4f46e5",
	},
	{
		id: "company_name",
		label: "Company Name",
		type: "text",
		value: "Nexus Systems Ltd.",
	},
	{
		id: "logo_url",
		label: "Logo URL",
		type: "image",
		value: "https://api.dicebear.com/7.x/identicon/svg?seed=Nexus",
	},
	{
		id: "footer_text",
		label: "Footer Note",
		type: "text",
		value: "Thank you for your business. Terms apply.",
	},
];

export function TemplateEditorPage() {
	const [mode, setMode] = useState<"preview" | "code">("preview");
	const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
	const [variables, setVariables] = useState<TemplateVariable[]>(INITIAL_VARIABLES);
	const [isVariablesPanelOpen, setIsVariablesPanelOpen] = useState(false);

	// Inject variables into the template string
	const renderedHtml = useMemo(() => {
		let result = template;
		for (const v of variables) {
			const regex = new RegExp(`{{${v.id}}}`, "g");
			result = result.replace(regex, v.value);
		}
		return result;
	}, [template, variables]);

	const handleVariableChange = (id: string, value: string) => {
		setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, value } : v)));
	};

	return (
		<div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.12))] flex-col gap-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<PageHeader
					icon={FileEdit}
					title="Edit Template"
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
									/>
								</SheetContent>
							</Sheet>
						)}

						{/* Save Button - Icon only on mobile */}
						<Button variant="default">
							<Save className="h-4 w-4" />
							<span className="hidden lg:inline">Save Template</span>
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
							/>
						</div>
					</>
				) : (
					/* Code Editor */
					<div className="flex-1 overflow-hidden">
						<TemplateCodeEditor value={template} onChange={setTemplate} />
					</div>
				)}
			</div>
		</div>
	);
}
