import { SignIn } from "@clerk/clerk-react";

export function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<SignIn />
		</div>
	);
}
