import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { templatesApi } from "@/lib/api/modules/templates";
import { DEFAULT_TEMPLATE_HTML, DEFAULT_TEMPLATE_VARIABLES } from "@/lib/constants/templates";
import { transformVariablesToRecord } from "@/lib/transformers/template.transformer";

const createTemplateSchema = z.object({
	name: z.string().min(1, "Name is required").max(150),
	description: z.string().max(300).optional(),
	type: z.enum(["invoice", "receipt"]),
});

type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;

interface CreateTemplateDialogProps {
	onTemplateCreated?: () => void;
}

export function CreateTemplateDialog({ onTemplateCreated }: CreateTemplateDialogProps) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { getToken } = useAuth();

	const form = useForm<CreateTemplateFormValues>({
		resolver: zodResolver(createTemplateSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "invoice",
		},
	});

	const onSubmit = async (values: CreateTemplateFormValues) => {
		try {
			const token = await getToken();
			const result = await templatesApi.create(
				{
					...values,
					html_content: DEFAULT_TEMPLATE_HTML,
					variables: transformVariablesToRecord(DEFAULT_TEMPLATE_VARIABLES),
				},
				token
			);

			if (result.success && result.data) {
				setOpen(false);
				form.reset();
				onTemplateCreated?.();
				navigate(`/my-templates/${result.data.id}/edit`);
			}
		} catch (error) {
			console.error("Failed to create template:", error);
			// You might want to set a form error here if needed
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="w-full sm:w-auto">
					<Plus className="h-4 w-4" />
					Create Template
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Template</DialogTitle>
					<DialogDescription>
						Start with a professional layout. You can customize the design and variables in the
						editor.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Modern Invoice" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief description of this template..."
											className="resize-none"
											{...field}
										/>
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
									<FormLabel>Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="invoice">Invoice</SelectItem>
											<SelectItem value="receipt">Receipt</SelectItem>
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
								Create Template
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
