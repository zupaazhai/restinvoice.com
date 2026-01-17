import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
						<TableHead>Name</TableHead>
						<TableHead>Expired At</TableHead>
						<TableHead className="w-[100px] text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{apiKeys.map((key) => (
						<TableRow key={key.id}>
							<TableCell className="font-medium">{key.name}</TableCell>
							<TableCell>
								{key.expiresAt
									? new Intl.DateTimeFormat("en-US", {
											dateStyle: "medium",
											timeStyle: "short",
										}).format(new Date(key.expiresAt))
									: "Never"}
							</TableCell>
							<TableCell className="text-right">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
									onClick={() => onDelete(key.id)}
								>
									<Trash className="h-4 w-4" />
									<span className="sr-only">Delete</span>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
