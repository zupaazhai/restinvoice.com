import { Home, Zap, Calendar, Coins } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CodeExamples } from "@/components/dashboard/CodeExamples";

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

			{/* Stats Section */}
			<section>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<StatsCard
						icon={Zap}
						title="API Calls Today"
						value={stats.apiCallsToday.toLocaleString()}
						description="Invoices generated today"
					/>
					<StatsCard
						icon={Calendar}
						title="API Calls This Month"
						value={stats.apiCallsThisMonth.toLocaleString()}
						description="Total for January 2026"
					/>
					<StatsCard
						icon={Coins}
						title="Credits Remaining"
						value={stats.creditsRemaining.toLocaleString()}
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
