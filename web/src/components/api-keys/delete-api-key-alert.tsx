import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteApiKeyAlertProps {
	apiKeyId: string;
	apiKeyName: string;
	onDelete: (id: string) => Promise<void>;
}

export function DeleteApiKeyAlert({ apiKeyId, apiKeyName, onDelete }: DeleteApiKeyAlertProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await onDelete(apiKeyId);
			setOpen(false);
		} catch (error) {
			console.error("Failed to delete API key:", error);
			// Ideally show error toast here
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (isLoading) return; // Prevent closing while loading
		setOpen(newOpen);
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
					disabled={isLoading}
				>
					<Trash className="h-4 w-4" />
					<span className="sr-only">Delete</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent
				onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
				// @ts-expect-error: Radix primitive prop that might not be exposed by Shadcn wrapper types perfectly
				onInteractOutside={(e: Event) => isLoading && e.preventDefault()}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the API key &quot;
						{apiKeyName}&quot; and revoke its access immediately.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Delete"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
