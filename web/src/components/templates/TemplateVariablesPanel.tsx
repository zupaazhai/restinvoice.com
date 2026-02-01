import { Calendar, Clock, FileText, ImageIcon, Palette, Pencil, Type } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import type { TemplateVariable } from "@/types/template.types";
import { VariableDialog } from "./VariableDialog";

interface TemplateVariablesContentProps {
	variables: TemplateVariable[];
	onVariableChange: (id: string, value: string) => void;
	onAddVariable: (variable: Omit<TemplateVariable, "value">) => void;
	onEditVariable: (oldId: string, variable: Omit<TemplateVariable, "value">) => void;
	onDeleteVariable: (id: string) => void;
}

const getVariableIcon = (variable: TemplateVariable) => {
	if (variable.type === "color") return Palette;
	if (variable.type === "image") return ImageIcon;
	if (variable.type === "date") return Calendar;
	if (variable.type === "datetime") return Clock;
	return Type;
};

/**
 * Reusable content component for template variables form.
 * Used in both desktop sidebar and mobile Sheet.
 */
export function TemplateVariablesContent({
	variables,
	onVariableChange,
	onAddVariable,
	onEditVariable,
	onDeleteVariable,
}: TemplateVariablesContentProps) {
	const [editingVariable, setEditingVariable] = useState<TemplateVariable | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const handleEditClick = (variable: TemplateVariable) => {
		setEditingVariable(variable);
		setIsEditDialogOpen(true);
	};

	const handleEditSave = (updatedVariable: Omit<TemplateVariable, "value">) => {
		if (editingVariable) {
			onEditVariable(editingVariable.id, updatedVariable);
		}
		setIsEditDialogOpen(false);
		setEditingVariable(null);
	};

	const handleDelete = () => {
		if (editingVariable) {
			onDeleteVariable(editingVariable.id);
		}
		setIsEditDialogOpen(false);
		setEditingVariable(null);
	};

	return (
		<>
			<div className="border-b border-border p-4">
				<h3 className="flex items-center gap-2 font-semibold text-foreground">
					<FileText className="h-4 w-4 text-muted-foreground" />
					Template Variables
				</h3>
				<p className="mt-1 text-xs text-muted-foreground">Inject dynamic values for testing</p>
			</div>

			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{/* Add Variable Button - before first variable */}
				<VariableDialog mode="create" existingVariables={variables} onSave={onAddVariable} />

				{/* Edit Dialog - shared for all variables (controlled, no trigger) */}
				<VariableDialog
					mode="edit"
					variable={editingVariable ?? undefined}
					existingVariables={variables}
					onSave={handleEditSave}
					onDelete={handleDelete}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					trigger={null}
				/>

				{variables.map((variable) => {
					const Icon = getVariableIcon(variable);
					return (
						<div key={variable.id} className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor={`var-${variable.id}`}
									className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
								>
									<Icon className="h-3 w-3" />
									{variable.label}
								</label>
								<code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
									{`{{${variable.id}}}`}
								</code>
							</div>

							<div className="flex items-center gap-2">
								<div className="flex-1">
									{(() => {
										switch (variable.type) {
											case "color":
												return (
													<ColorPicker
														value={variable.value}
														onChange={(value) => onVariableChange(variable.id, value)}
													/>
												);
											case "date":
												return (
													<DatePicker
														value={variable.value}
														onChange={(value) => onVariableChange(variable.id, value)}
													/>
												);
											case "datetime":
												return (
													<DateTimePicker
														value={variable.value}
														onChange={(value) => onVariableChange(variable.id, value)}
													/>
												);
											default:
												return (
													<Input
														id={`var-${variable.id}`}
														type="text"
														value={variable.value}
														onChange={(e) => onVariableChange(variable.id, e.target.value)}
													/>
												);
										}
									})()}
								</div>
								{/* Edit button for variable */}
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 shrink-0"
									onClick={() => handleEditClick(variable)}
								>
									<Pencil className="h-4 w-4" />
									<span className="sr-only">Edit {variable.label}</span>
								</Button>
							</div>
						</div>
					);
				})}

				<div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
					<h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
						<FileText className="h-3 w-3" />
						How to use variables
					</h4>
					<p className="text-[11px] leading-relaxed text-muted-foreground">
						Use double curly braces to insert variables into your HTML. Example:{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono">
							{'<div style="color: {{primary_color}}>'}
						</code>
					</p>
				</div>
			</div>
		</>
	);
}

interface TemplateVariablesPanelProps {
	variables: TemplateVariable[];
	onVariableChange: (id: string, value: string) => void;
	onAddVariable: (variable: Omit<TemplateVariable, "value">) => void;
	onEditVariable: (oldId: string, variable: Omit<TemplateVariable, "value">) => void;
	onDeleteVariable: (id: string) => void;
}

/**
 * Desktop sidebar wrapper for template variables.
 * Hidden on mobile (lg:hidden in parent).
 */
export function TemplateVariablesPanel({
	variables,
	onVariableChange,
	onAddVariable,
	onEditVariable,
	onDeleteVariable,
}: TemplateVariablesPanelProps) {
	return (
		<aside className="flex h-full w-80 flex-col border-l border-border bg-card">
			<TemplateVariablesContent
				variables={variables}
				onVariableChange={onVariableChange}
				onAddVariable={onAddVariable}
				onEditVariable={onEditVariable}
				onDeleteVariable={onDeleteVariable}
			/>
		</aside>
	);
}
