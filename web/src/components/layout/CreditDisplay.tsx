import { Coins } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface CreditDisplayProps {
	credits: number;
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
	const formattedCredits = formatNumber(credits);

	return (
		<div className="flex items-center gap-1.5 text-sm">
			<Coins className="h-4 w-4 text-muted-foreground" />
			<span className="font-medium text-foreground">{formattedCredits}</span>
		</div>
	);
}
