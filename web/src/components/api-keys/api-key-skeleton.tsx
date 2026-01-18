import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function ApiKeySkeleton() {
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
					{[...Array(5)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static content
						<TableRow key={i}>
							<TableCell>
								<Skeleton className="h-5 w-[150px] md:w-[250px]" />
								<Skeleton className="h-3 w-[100px] mt-1 md:hidden" />
							</TableCell>
							<TableCell className="hidden md:table-cell">
								<Skeleton className="h-5 w-[120px]" />
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end">
									<Skeleton className="h-8 w-8 rounded-md" />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
