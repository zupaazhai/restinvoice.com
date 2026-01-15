import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
	icon: LucideIcon;
	title: string;
	value: string | number;
	description?: string;
}

export function StatsCard({ icon: Icon, title, value, description }: StatsCardProps) {
	return (
		<Card className="rounded-xl border py-6 gap-4">
			<CardContent className="px-6">
				<div className="flex items-center gap-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<Icon className="h-5 w-5 text-primary" />
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-muted-foreground">{title}</span>
						<span className="text-2xl font-semibold tracking-tight">{value}</span>
						{description && <span className="text-xs text-muted-foreground">{description}</span>}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
