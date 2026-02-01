import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Calendar, Clock, FileText, GripVertical, ImageIcon, Palette, Type } from "lucide-react";
import { useState } from "react";
import type { TemplateVariable } from "@/types/template.types";
import { SortableVariableItem } from "./SortableVariableItem";
import { VariableDialog } from "./VariableDialog";

interface TemplateVariablesContentProps {
	variables: TemplateVariable[];
	onVariableChange: (id: string, value: string) => void;
	onAddVariable: (variable: Omit<TemplateVariable, "value">) => void;
	onEditVariable: (oldId: string, variable: Omit<TemplateVariable, "value">) => void;
	onDeleteVariable: (id: string) => void;
	onReorderVariables?: (variables: TemplateVariable[]) => void;
}

const getVariableIcon = (variable: TemplateVariable) => {
	if (variable.type === "color") return Palette;
	if (variable.type === "image") return ImageIcon;
	if (variable.type === "date") return Calendar;
	if (variable.type === "datetime") return Clock;
	return Type;
};

/**
 * Non-sortable item for drag overlay (visual feedback while dragging)
 */
function DragOverlayItem({ variable }: { variable: TemplateVariable }) {
	const Icon = getVariableIcon(variable);
	return (
		<div className="space-y-2 rounded-lg border border-border bg-card p-2 shadow-lg">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-1 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
					<GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
					<Icon className="h-3 w-3 shrink-0" />
					<span className="truncate">{variable.label}</span>
				</div>
				<code className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
					{`{{${variable.id}}}`}
				</code>
			</div>
		</div>
	);
}

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
	onReorderVariables,
}: TemplateVariablesContentProps) {
	const [editingVariable, setEditingVariable] = useState<TemplateVariable | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = variables.findIndex((v) => v.id === active.id);
			const newIndex = variables.findIndex((v) => v.id === over.id);
			const reorderedVariables = arrayMove(variables, oldIndex, newIndex);
			onReorderVariables?.(reorderedVariables);
		}

		setActiveId(null);
	};

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

	const activeVariable = activeId ? variables.find((v) => v.id === activeId) : null;

	return (
		<>
			<div className="border-b border-border p-4">
				<h3 className="flex items-center gap-2 font-semibold text-foreground">
					<FileText className="h-4 w-4 text-muted-foreground" />
					Template Variables
				</h3>
				<p className="mt-1 text-xs text-muted-foreground">Drag labels to reorder variables</p>
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

				{/* Sortable Variables List */}
				{variables.length > 0 && (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={variables.map((v) => v.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-1">
								{variables.map((variable) => (
									<SortableVariableItem
										key={variable.id}
										variable={variable}
										onVariableChange={onVariableChange}
										onEditClick={handleEditClick}
										getVariableIcon={getVariableIcon}
									/>
								))}
							</div>
						</SortableContext>

						<DragOverlay>
							{activeVariable ? <DragOverlayItem variable={activeVariable} /> : null}
						</DragOverlay>
					</DndContext>
				)}

				<div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
					<h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
						<FileText className="h-3 w-3" />
						How to use variables
					</h4>
					<p className="text-[11px] leading-relaxed text-muted-foreground">
						Use double curly braces to insert variables into your HTML. Example:{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono">
							{'<div style="color: {{primary_color}}">'}
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
	onReorderVariables?: (variables: TemplateVariable[]) => void;
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
	onReorderVariables,
}: TemplateVariablesPanelProps) {
	return (
		<aside className="flex h-full w-80 flex-col border-l border-border bg-card">
			<TemplateVariablesContent
				variables={variables}
				onVariableChange={onVariableChange}
				onAddVariable={onAddVariable}
				onEditVariable={onEditVariable}
				onDeleteVariable={onDeleteVariable}
				onReorderVariables={onReorderVariables}
			/>
		</aside>
	);
}
