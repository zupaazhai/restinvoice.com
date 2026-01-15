import { Calendar, Coins, Home, Zap } from "lucide-react";
import { CodeExamples } from "@/components/dashboard/CodeExamples";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PageHeader } from "@/components/ui/page-header";
import { formatNumber } from "@/lib/utils";

export function DashboardPage() {
	// TODO: Replace with real data from API
	const stats = {
		apiCallsToday: 42,
		apiCallsThisMonth: 1250,
		creditsRemaining: 847,
	};

	return (
		<div className="space-y-6">
			<PageHeader
				icon={Home}
				title="Dashboard"
				description="Welcome to REST Invoice - Your invoice generation platform"
			/>

			<section>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<StatsCard
						icon={Zap}
						title="API Calls Today"
						value={formatNumber(stats.apiCallsToday)}
						description="Invoices generated today"
					/>
					<StatsCard
						icon={Calendar}
						title="API Calls This Month"
						value={formatNumber(stats.apiCallsThisMonth)}
						description="Total for January 2026"
					/>
					<StatsCard
						icon={Coins}
						title="Credits Remaining"
						value={formatNumber(stats.creditsRemaining)}
						description="Available for generation"
					/>
				</div>
			</section>

			{/* Code Examples Section */}
			<section>
				<CodeExamples />
			</section>
		</div>
	);
}
