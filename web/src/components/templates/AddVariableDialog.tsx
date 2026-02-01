import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Plus } from "lucide-react";
import { useState } from "react";
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

interface AddVariableDialogProps {
	existingVariables: TemplateVariable[];
	onAddVariable: (variable: Omit<TemplateVariable, "value">) => void;
}

const variableNameRegex = /^[a-z][a-z0-9_]*$/;

const addVariableSchema = z.object({
	label: z.string().min(1, "Label is required").max(100, "Label must be less than 100 characters"),
	name: z
		.string()
		.min(1, "Variable name is required")
		.max(50, "Variable name must be less than 50 characters")
		.regex(
			variableNameRegex,
			"Variable name must start with a lowercase letter and can only contain lowercase letters, numbers, and underscores"
		),
	type: z.enum(["text", "date", "datetime", "repeat_items"]),
});

type AddVariableFormValues = z.infer<typeof addVariableSchema>;

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

export function AddVariableDialog({ existingVariables, onAddVariable }: AddVariableDialogProps) {
	const [open, setOpen] = useState(false);

	const form = useForm<AddVariableFormValues>({
		resolver: zodResolver(addVariableSchema),
		defaultValues: {
			label: "",
			name: "",
			type: "text",
		},
	});

	const onSubmit = (values: AddVariableFormValues) => {
		// Check for duplicate variable name
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

		onAddVariable({
			id: values.name,
			label: values.label,
			type: values.type as TemplateVariableType,
		});

		setOpen(false);
		form.reset();
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="w-full">
					<Plus className="h-4 w-4" />
					Add Variable
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>Add New Variable</DialogTitle>
					<DialogDescription>
						Create a new template variable to use in your template.
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
											<SelectItem value="repeat_items" disabled>
												Repeat Items (Coming Soon)
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={form.formState.isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" isLoading={form.formState.isSubmitting}>
								<Plus className="h-4 w-4" />
								Add Variable
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
