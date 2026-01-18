import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
	page: number;
	total: number;
	onChange: (page: number) => void;
}

export function PaginationControl({ page, total, onChange }: PaginationControlProps) {
	if (total <= 1) return null;

	// Helper to generate the pagination items
	const generateItems = () => {
		const items: (number | string)[] = [];
		const showEllipsisStart = page > 3;
		const showEllipsisEnd = page < total - 2;

		if (total <= 7) {
			for (let i = 1; i <= total; i++) {
				items.push(i);
			}
		} else {
			// Always show first page
			items.push(1);

			if (showEllipsisStart) {
				items.push("ellipsis-start");
			}

			// Calculate middle range
			const start = Math.max(2, page - 1);
			const end = Math.min(total - 1, page + 1);

			// Adjust range if at edges to keep constant number of items roughly
			if (page < 4) {
				for (let i = 2; i <= 5; i++) items.push(i);
			} else if (page > total - 3) {
				for (let i = total - 4; i < total; i++) items.push(i);
			} else {
				for (let i = start; i <= end; i++) {
					items.push(i);
				}
			}

			if (showEllipsisEnd) {
				items.push("ellipsis-end");
			}

			// Always show last page
			items.push(total);
		}

		return Array.from(new Set(items));
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (page > 1) onChange(page - 1);
						}}
						className={page <= 1 ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>

				{generateItems().map((item) => {
					if (typeof item === "string") {
						return (
							<PaginationItem key={item}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}
					return (
						<PaginationItem key={item}>
							<PaginationLink
								href="#"
								isActive={page === item}
								onClick={(e) => {
									e.preventDefault();
									onChange(item);
								}}
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (page < total) onChange(page + 1);
						}}
						className={page >= total ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
