import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TemplateVariable, TemplateVariableType } from "@/types/template.types";

type VariableDialogMode = "create" | "edit";

interface VariableDialogProps {
	mode?: VariableDialogMode;
	variable?: TemplateVariable;
	existingVariables: TemplateVariable[];
	onSave: (variable: Omit<TemplateVariable, "value">) => void;
	onDelete?: () => void;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const variableNameRegex = /^[a-z][a-z0-9_]*$/;

const variableSchema = z.object({
	label: z.string().min(1, "Label is required").max(100, "Label must be less than 100 characters"),
	name: z
		.string()
		.min(1, "Variable name is required")
		.max(50, "Variable name must be less than 50 characters")
		.regex(
			variableNameRegex,
			"Variable name must start with a lowercase letter and can only contain lowercase letters, numbers, and underscores"
		),
	type: z.enum(["text", "date", "datetime", "color", "repeat_items"]),
});

type VariableFormValues = z.infer<typeof variableSchema>;

interface LabelWithTooltipProps {
	label: string;
	description: string;
}

function LabelWithTooltip({ label, description }: LabelWithTooltipProps) {
	return (
		<div className="flex items-center gap-1.5">
			<FormLabel>{label}</FormLabel>
			<Tooltip>
				<TooltipTrigger asChild>
					<Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs">
					<p>{description}</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

export function VariableDialog({
	mode = "create",
	variable,
	existingVariables,
	onSave,
	onDelete,
	trigger,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: VariableDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = controlledOpen ?? internalOpen;
	const setOpen = controlledOnOpenChange ?? setInternalOpen;
	const isEditMode = mode === "edit";
	const originalName = variable?.id;

	const form = useForm<VariableFormValues>({
		resolver: zodResolver(variableSchema),
		defaultValues: {
			label: "",
			name: "",
			type: "text",
		},
	});

	// Reset form when variable changes or dialog opens
	useEffect(() => {
		if (isOpen) {
			if (isEditMode && variable) {
				form.reset({
					label: variable.label,
					name: variable.id,
					type: variable.type as VariableFormValues["type"],
				});
			} else {
				form.reset({
					label: "",
					name: "",
					type: "text",
				});
			}
		}
	}, [isOpen, isEditMode, variable, form]);

	const onSubmit = (values: VariableFormValues) => {
		// Check for duplicate variable name (only if name changed in edit mode)
		if (!isEditMode || values.name !== originalName) {
			const isDuplicate = existingVariables.some(
				(v) => v.id.toLowerCase() === values.name.toLowerCase()
			);

			if (isDuplicate) {
				form.setError("name", {
					type: "manual",
					message: "A variable with this name already exists",
				});
				return;
			}
		}

		onSave({
			id: values.name,
			label: values.label,
			type: values.type as TemplateVariableType,
		});

		setOpen(false);
		form.reset();
	};

	const handleDelete = () => {
		onDelete?.();
		setOpen(false);
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	const defaultTrigger = isEditMode ? (
		<Button variant="ghost" size="icon" className="h-8 w-8">
			<Pencil className="h-4 w-4" />
			<span className="sr-only">Edit variable</span>
		</Button>
	) : (
		<Button variant="outline" size="sm" className="w-full">
			<Plus className="h-4 w-4" />
			Add Variable
		</Button>
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{trigger === null ? null : trigger !== undefined ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : (
				<DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Edit Variable" : "Add New Variable"}</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update this template variable."
							: "Create a new template variable to use in your template."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<LabelWithTooltip
										label="Label"
										description="The display name for this variable in the variables panel."
									/>
									<FormControl>
										<Input placeholder="e.g. Customer Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<LabelWithTooltip
										label="Variable Name"
										description="Used in template as {{variable_name}}. Must start with a lowercase letter and contain only lowercase letters, numbers, and underscores."
									/>
									<FormControl>
										<Input placeholder="e.g. customer_name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<LabelWithTooltip
										label="Type"
										description="Determines the input type in the variables panel."
									/>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="text">Text</SelectItem>
											<SelectItem value="date">Date</SelectItem>
											<SelectItem value="datetime">Date & Time</SelectItem>
											<SelectItem value="color">Color</SelectItem>
											<SelectItem value="repeat_items" disabled>
												Repeat Items (Coming Soon)
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="flex-row justify-between gap-2 pt-4">
							{isEditMode && onDelete && (
								<Button
									type="button"
									variant="destructive"
									onClick={handleDelete}
									disabled={form.formState.isSubmitting}
								>
									<Trash2 className="h-4 w-4" />
									Delete
								</Button>
							)}
							<div className="flex flex-1 justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
									disabled={form.formState.isSubmitting}
								>
									Cancel
								</Button>
								<Button type="submit" isLoading={form.formState.isSubmitting}>
									{isEditMode ? (
										<>
											<Pencil className="h-4 w-4" />
											Update Variable
										</>
									) : (
										<>
											<Plus className="h-4 w-4" />
											Add Variable
										</>
									)}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
