import { Home } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export function DashboardPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={Home}
				title="Dashboard"
				description="Welcome to REST Invoice - Your invoice generation platform"
			/>

			{/* Placeholder Content */}
			<div className="flex h-96 items-center justify-center rounded-lg bg-muted">
				<span className="text-muted-foreground">Dashboard Content Coming Soon</span>
			</div>
		</div>
	);
}
