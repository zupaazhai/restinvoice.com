import type { ReactNode } from "react";
import { Header } from "./Header";

interface AuthenticatedLayoutProps {
	children: ReactNode;
	credits?: number;
	userName?: string;
	userEmail?: string;
	avatarUrl?: string;
}

export function AuthenticatedLayout({
	children,
	credits,
	userName,
	userEmail,
	avatarUrl,
}: AuthenticatedLayoutProps) {
	return (
		<div className="min-h-screen bg-background pt-16">
			<Header credits={credits} userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />
			<main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
		</div>
	);
}
