import { SignIn, useClerk } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";

function SignInSkeleton() {
	return (
		<div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
			{/* Title and description */}
			<div className="mb-8 text-center">
				<Skeleton className="mx-auto mb-3 h-8 w-64 rounded" />
				<Skeleton className="mx-auto h-5 w-80 rounded" />
			</div>

			{/* Social buttons (GitHub and Google) */}
			<div className="mb-6 grid grid-cols-2 gap-2">
				<Skeleton className="h-10 w-full rounded-md" />
				<Skeleton className="h-10 w-full rounded-md" />
			</div>

			{/* Email input */}
			<div className="mb-6 space-y-2">
				<Skeleton className="h-4 w-24 rounded" />
				<Skeleton className="h-10 w-full rounded-md" />
			</div>

			{/* Submit button */}
			<Skeleton className="mb-8 h-10 w-full rounded-md" />

			{/* Footer link */}
			<div className="text-center">
				<Skeleton className="mx-auto h-4 w-56 rounded" />
			</div>
		</div>
	);
}

export function LoginPage() {
	const clerk = useClerk();

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			{!clerk.loaded ? <SignInSkeleton /> : <SignIn />}
		</div>
	);
}
