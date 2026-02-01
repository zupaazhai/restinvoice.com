import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TemplateVariable } from "@/types/template.types";

interface SortableVariableItemProps {
	variable: TemplateVariable;
	onVariableChange: (id: string, value: string) => void;
	onEditClick: (variable: TemplateVariable) => void;
	getVariableIcon: (variable: TemplateVariable) => React.ComponentType<{ className?: string }>;
}

export function SortableVariableItem({
	variable,
	onVariableChange,
	onEditClick,
	getVariableIcon,
}: SortableVariableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: variable.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const Icon = getVariableIcon(variable);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"space-y-2 rounded-lg border border-transparent p-2 transition-colors",
				isDragging && "border-border bg-accent/50 opacity-60 shadow-sm"
			)}
		>
			{/* Row 1: Drag handle + code */}
			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							ref={setActivatorNodeRef}
							{...attributes}
							{...listeners}
							className={cn(
								"flex min-w-0 flex-1 cursor-grab items-center gap-1.5 rounded px-1.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground",
								"hover:bg-accent active:cursor-grabbing"
							)}
							title="Drag to reorder"
						>
							<GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
							<Icon className="h-3 w-3 shrink-0" />
							<span className="truncate">{variable.label}</span>
						</div>
					</TooltipTrigger>
					<TooltipContent side="top" align="start">
						{variable.label}
					</TooltipContent>
				</Tooltip>

				<code className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
					{`{{${variable.id}}}`}
				</code>
			</div>

			{/* Row 2: Input + Edit button */}
			<div className="flex items-center gap-2">
				<div className="min-w-0 flex-1">
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
										className="h-8"
									/>
								);
						}
					})()}
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 shrink-0"
					onClick={() => onEditClick(variable)}
				>
					<Pencil className="h-4 w-4" />
					<span className="sr-only">Edit {variable.label}</span>
				</Button>
			</div>
		</div>
	);
}
