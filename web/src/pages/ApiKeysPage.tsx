import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { PageHeader } from "@/components/ui/page-header";

export function ApiKeysPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={Key}
				title="API Keys"
				description="Manage your API keys for authentication"
				action={
					<Button variant="default" className="w-full sm:w-auto">
						<Key className="h-4 w-4" />
						Create API Key
					</Button>
				}
			/>

			<Empty className="min-h-[400px] border border-border bg-card">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Key />
					</EmptyMedia>
					<EmptyTitle>No API Keys Yet</EmptyTitle>
					<EmptyDescription>
						Create your first API key to start making requests to the REST Invoice API.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="default">
						<Key className="h-4 w-4" />
						Create Your First Key
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
