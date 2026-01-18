import { Loader2 } from "lucide-react";
import { type ReactNode, useState } from "react";
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

interface ConfirmDialogProps {
	trigger: ReactNode;
	title: string;
	description: ReactNode;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
	onConfirm: () => Promise<void>;
}

export function ConfirmDialog({
	trigger,
	title,
	description,
	confirmText = "Continue",
	cancelText = "Cancel",
	variant = "default",
	onConfirm,
}: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await onConfirm();
			setOpen(false);
		} catch (error) {
			console.error("Failed to confirm action:", error);
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
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent
				onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
				// @ts-expect-error: Radix primitive prop that might not be exposed by Shadcn wrapper types perfectly
				onInteractOutside={(e: Event) => isLoading && e.preventDefault()}
			>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						className={
							variant === "destructive"
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: ""
						}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{confirmText}...
							</>
						) : (
							confirmText
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
