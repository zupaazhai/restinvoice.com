import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Copy, Key, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	expiresIn: z.enum(["7d", "30d", "60d", "180d", "365d", "forever"]),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateApiKeyDialog({ children }: { children?: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<"form" | "loading" | "success">("form");
	const [generatedKey, setGeneratedKey] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			expiresIn: "365d",
		},
	});

	const onSubmit = async (_data: FormValues) => {
		setStep("loading");
		// Mock API call
		setTimeout(() => {
			// Generate a fake key for demonstration
			const mockKey = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
			setGeneratedKey(mockKey);
			setStep("success");
		}, 1500);
	};

	const handleCopy = async () => {
		if (generatedKey) {
			await navigator.clipboard.writeText(generatedKey);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && step === "loading") {
			// Prevent closing while loading
			return;
		}
		setOpen(newOpen);
		if (!newOpen) {
			// Reset state when closed
			setTimeout(() => {
				setStep("form");
				setGeneratedKey(null);
				form.reset();
				setCopied(false);
			}, 300);
		}
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
				onPointerDownOutside={(e) => {
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
													<SelectItem value="365d">1 Year (Default)</SelectItem>
													<SelectItem value="forever">Never Expires</SelectItem>
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
									<Button type="submit" disabled={step === "loading"}>
										{step === "loading" ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Generating...
											</>
										) : (
											"Generate Key"
										)}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2 text-green-600">
								<ShieldCheck className="h-5 w-5" />
								API Key Generated
							</DialogTitle>
							<DialogDescription>Your new API key has been created successfully.</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-2">
							<div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
								<div className="flex gap-3">
									<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
									<div className="text-sm text-amber-800 dark:text-amber-200">
										<p className="font-medium">Save this key securely</p>
										<p className="mt-1">
											For security reasons, you will not be able to view this key again. If you lose
											it, you will need to generate a new one.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label>API Key</Label>
								<div className="flex gap-2">
									<Input
										value={generatedKey || ""}
										readOnly
										className="font-mono text-muted-foreground bg-muted"
										onClick={(e) => e.currentTarget.select()}
									/>
									<Button
										variant="outline"
										size="icon"
										className={cn(
											"shrink-0 transition-all",
											copied && "border-green-500 text-green-500 hover:text-green-500"
										)}
										onClick={handleCopy}
									>
										{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
									</Button>
								</div>
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
