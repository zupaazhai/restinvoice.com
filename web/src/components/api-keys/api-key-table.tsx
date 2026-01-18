import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import type { ApiKey } from "@/types/api-key.types";

interface ApiKeyTableProps {
	apiKeys: ApiKey[];
	onDelete: (id: string) => void;
}

export function ApiKeyTable({ apiKeys, onDelete }: ApiKeyTableProps) {
	return (
		<div className="rounded-md border bg-card text-card-foreground shadow-sm">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="md:w-[40%]">Name</TableHead>
						<TableHead className="hidden md:table-cell md:w-[30%]">Expired At</TableHead>
						<TableHead className="w-[100px] md:w-[30%] text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{apiKeys.map((key) => (
						<TableRow key={key.id}>
							<TableCell className="max-w-[150px] sm:max-w-[250px] md:max-w-[400px]">
								<div className="truncate font-medium" title={key.name}>
									{key.name}
								</div>
								<div className="text-muted-foreground block text-xs md:hidden mt-0.5">
									Expires: {key.expiresAt ? formatDateTime(key.expiresAt) : "Never"}
								</div>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								{key.expiresAt ? formatDateTime(key.expiresAt) : "Never"}
							</TableCell>
							<TableCell className="text-right">
								<ConfirmDialog
									trigger={
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
										>
											<Trash className="h-4 w-4" />
											<span className="sr-only">Delete</span>
										</Button>
									}
									title="Are you absolutely sure?"
									description={
										<>
											This action cannot be undone. This will permanently delete the API key &quot;
											{key.name}&quot; and revoke its access immediately.
										</>
									}
									confirmText="Delete"
									variant="destructive"
									onConfirm={async () => onDelete(key.id)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
