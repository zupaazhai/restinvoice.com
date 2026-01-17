import { Key } from "lucide-react";
import { useState } from "react";
import { ApiKeyTable } from "@/components/api-keys/api-key-table";
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
import type { ApiKey } from "@/types/api-key.types";

const MOCK_KEYS: ApiKey[] = [
	{
		id: "1",
		name: "Development Key",
		token: "sk_test_123456789",
		expiresAt: null,
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Production Key - This is a very long name to test table responsiveness and truncation behavior on different screen sizes",
		token: "sk_live_987654321",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
		createdAt: new Date().toISOString(),
	},
	{
		id: "3",
		name: "Mobile App Key",
		token: "sk_mobile_555555555",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
		createdAt: new Date().toISOString(),
	},
];

export function ApiKeysPage() {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_KEYS);

	const handleCreate = (newKey: ApiKey) => {
		setApiKeys((prev) => [newKey, ...prev]);
	};

	const handleDelete = (id: string) => {
		setApiKeys((prev) => prev.filter((key) => key.id !== id));
	};

	return (
		<div className="space-y-6">
			<PageHeader
				icon={Key}
				title="API Keys"
				description="Manage your API keys for authentication"
				action={<CreateApiKeyDialog onCreate={handleCreate} />}
			/>

			{apiKeys.length > 0 ? (
				<ApiKeyTable apiKeys={apiKeys} onDelete={handleDelete} />
			) : (
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
						<CreateApiKeyDialog onCreate={handleCreate}>
							<Button variant="default">
								<Key className="h-4 w-4" />
								Create Your First Key
							</Button>
						</CreateApiKeyDialog>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}
