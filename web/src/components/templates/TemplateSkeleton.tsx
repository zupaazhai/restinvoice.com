import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSkeleton() {
	return (
		<Card className="rounded-xl border py-0 gap-4 overflow-hidden">
			{/* Thumbnail Skeleton */}
			<CardContent className="p-0">
				<div className="aspect-[3/4] w-full bg-muted/20 relative">
					<Skeleton className="h-full w-full rounded-none" />
				</div>
			</CardContent>

			{/* Footer Skeleton */}
			<CardFooter className="px-3 pb-3 flex flex-col gap-2 items-start">
				<div className="flex w-full items-center justify-between gap-2">
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-4 w-4 rounded-full" />
				</div>
				<Skeleton className="h-3 w-full" />
			</CardFooter>
		</Card>
	);
}
