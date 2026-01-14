import { Coins } from "lucide-react";

interface CreditDisplayProps {
	credits: number;
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
	const formattedCredits = credits.toLocaleString();

	return (
		<div className="flex items-center gap-2 text-sm">
			<Coins className="h-4 w-4 text-muted-foreground" />
			<span className="text-muted-foreground">Credits:</span>
			<span className="font-medium text-foreground">{formattedCredits}</span>
		</div>
	);
}
