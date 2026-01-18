import { useAuth } from "@clerk/clerk-react";
import { Key } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ApiKeySkeleton } from "@/components/api-keys/api-key-skeleton";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { apiKeysApi } from "@/lib/api/modules/api-keys";
import type { ApiKey } from "@/types/api-key.types";
import type { PaginationMeta } from "@/types/pagination.types";

export function ApiKeysPage() {
	const { getToken } = useAuth();
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [meta, setMeta] = useState<PaginationMeta | null>(null);

	const fetchKeys = useCallback(async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			const response = await apiKeysApi.list({ page, per_page: 10, token });
			setApiKeys(response.data);
			setMeta(response.meta);
		} catch (error) {
			console.error("Failed to fetch API keys:", error);
		} finally {
			setIsLoading(false);
		}
	}, [page, getToken]);

	useEffect(() => {
		fetchKeys();
	}, [fetchKeys]);

	const handleCreate = () => {
		// Start by adding the new key to the list temporarily if we are on page 1,
		// otherwise refreshing would be better.
		// For simplicity, just refresh the list to ensure correct order/pagination
		setPage(1);
		fetchKeys();
	};

	const handleDelete = async (id: string) => {
		try {
			const token = await getToken();
			await apiKeysApi.revoke(id, token);
			// Refresh list after deletion
			fetchKeys();
		} catch (error) {
			console.error("Failed to revoke API key:", error);
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				icon={Key}
				title="API Keys"
				description="Manage your API keys for authentication"
				action={<CreateApiKeyDialog onCreate={handleCreate} />}
			/>

			{isLoading ? (
				<ApiKeySkeleton />
			) : apiKeys.length > 0 ? (
				<div className="space-y-6">
					<ApiKeyTable apiKeys={apiKeys} onDelete={handleDelete} />

					{meta && meta.last_page > 1 && (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											if (page > 1) setPage(page - 1);
										}}
										className={page <= 1 ? "pointer-events-none opacity-50" : ""}
									/>
								</PaginationItem>

								{/* Simple pagination logic: show current page */}
								{/* In a real app we might want to show range of pages */}
								<PaginationItem>
									<PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
										{page}
									</PaginationLink>
								</PaginationItem>

								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											if (page < meta.last_page) setPage(page + 1);
										}}
										className={page >= meta.last_page ? "pointer-events-none opacity-50" : ""}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</div>
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
