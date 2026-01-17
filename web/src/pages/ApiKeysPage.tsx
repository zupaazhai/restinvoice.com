import { Key } from "lucide-react";
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog";
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
				action={<CreateApiKeyDialog />}
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
					<CreateApiKeyDialog>
						<Button variant="default">
							<Key className="h-4 w-4" />
							Create Your First Key
						</Button>
					</CreateApiKeyDialog>
				</EmptyContent>
			</Empty>
		</div>
	);
}
