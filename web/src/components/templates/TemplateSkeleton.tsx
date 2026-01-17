import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSkeleton() {
	return (
		<Card className="rounded-xl border py-0 gap-4 overflow-hidden">
			{/* Thumbnail Skeleton */}
			<CardContent className="p-0">
				<div className="aspect-[4/3] w-full bg-muted/20 relative">
					<Skeleton className="h-full w-full rounded-none" />
				</div>
			</CardContent>

			{/* Footer Skeleton */}
			<CardFooter className="flex-col items-start gap-2 p-0 px-3 pb-3">
				{/* Title and Description */}
				<div className="w-full space-y-1">
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-3 w-3/4" />
				</div>

				{/* ID Bar Skeleton */}
				<div className="w-full flex items-center justify-between gap-2 rounded-md bg-muted p-2">
					<Skeleton className="h-3 w-24" />
					<Skeleton className="h-8 w-8 rounded-md" />
				</div>
			</CardFooter>
		</Card>
	);
}
