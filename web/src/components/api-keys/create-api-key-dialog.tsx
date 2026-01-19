import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Key } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { apiKeysApi } from "@/lib/api/modules/api-keys";
import type { ApiKey } from "@/types/api-key.types";

const formSchema = z.object({
	name: z.string().min(1, "Name is required").max(150, "Name must be less than 150 characters"),
	expiresIn: z.enum(["7d", "30d", "60d", "180d", "1y", "never"]),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateApiKeyDialogProps {
	children?: React.ReactNode;
	onCreate?: (apiKey: ApiKey) => void;
}

import { useAuth } from "@clerk/clerk-react";

export function CreateApiKeyDialog({ children, onCreate }: CreateApiKeyDialogProps) {
	const { getToken } = useAuth();
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<"form" | "loading" | "success">("form");
	const [generatedKey, setGeneratedKey] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			expiresIn: "1y",
		},
	});

	const onSubmit = async (data: FormValues) => {
		setStep("loading");
		try {
			const token = await getToken();
			const response = await apiKeysApi.create(
				{
					name: data.name,
					expires_in: data.expiresIn,
				},
				token
			);

			const newKey = response.data;

			setGeneratedKey(newKey.key);
			setStep("success");

			if (onCreate) {
				onCreate({
					id: newKey.id,
					name: newKey.name,
					token: newKey.key, // API returns 'key' as the secret
					expiresAt: newKey.expired_at ? new Date(newKey.expired_at * 1000).toISOString() : null,
					createdAt: new Date(newKey.created_at * 1000).toISOString(),
				});
			}
		} catch (error) {
			console.error("Failed to create API key:", error);
			// TODO: Show error toast
			setStep("form"); // Go back to form on error
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && step === "loading") {
			return;
		}
		if (newOpen) {
			setStep("form");
			setGeneratedKey(null);
			// specific for react-hook-form to ensure fresh state
			form.reset({
				name: "",
				expiresIn: "1y",
			});
			form.clearErrors();
		}
		setOpen(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="default" className="w-full sm:w-auto">
						<Key className="h-4 w-4" />
						Create API Key
					</Button>
				)}
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[500px]"
				showCloseButton={step !== "loading"}
				onInteractOutside={(e) => {
					if (step === "loading") e.preventDefault();
				}}
				onEscapeKeyDown={(e) => {
					if (step === "loading") e.preventDefault();
				}}
			>
				{step === "form" || step === "loading" ? (
					<>
						<DialogHeader>
							<DialogTitle>Create API Key</DialogTitle>
							<DialogDescription>
								Create a new API key to authenticate your requests.
							</DialogDescription>
						</DialogHeader>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Key Name</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. Production Server"
													{...field}
													disabled={step === "loading"}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="expiresIn"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expires In</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={step === "loading"}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select expiration" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="7d">1 Week</SelectItem>
													<SelectItem value="30d">1 Month</SelectItem>
													<SelectItem value="60d">2 Months</SelectItem>
													<SelectItem value="180d">6 Months</SelectItem>
													<SelectItem value="1y">1 Year (Default)</SelectItem>
													<SelectItem value="never">Never Expires</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter>
									<Button
										variant="ghost"
										type="button"
										onClick={() => setOpen(false)}
										disabled={step === "loading"}
									>
										Cancel
									</Button>
									<Button type="submit" isLoading={step === "loading"}>
										<Key className="h-4 w-4" />
										Generate Key
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</>
				) : (
					<>
						<div className="flex flex-col items-center justify-center pt-4">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
								<Check className="h-6 w-6" />
							</div>
							<DialogHeader>
								<DialogTitle className="text-center">API Key Generated</DialogTitle>
								<DialogDescription className="text-center">
									Your new API key has been created successfully.
								</DialogDescription>
							</DialogHeader>
						</div>

						<div className="space-y-4 py-2">
							<Alert variant="warning">
								<AlertTriangle className="h-4 w-4" />
								<AlertTitle>Save this key securely</AlertTitle>
								<AlertDescription>
									For security reasons, you will not be able to view this key again. If you lose it,
									you will need to generate a new one.
								</AlertDescription>
							</Alert>

							<div className="space-y-2">
								<Label>API Key</Label>
								<CopyInput value={generatedKey || ""} className="w-full" />
							</div>
						</div>

						<DialogFooter>
							<Button onClick={() => setOpen(false)} className="w-full sm:w-auto">
								Done
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
