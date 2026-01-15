import { UserButton, useUser } from "@clerk/clerk-react";

interface UserMenuProps {
	userName?: string;
	userEmail?: string;
	avatarUrl?: string;
}

export function UserMenu({
	userName: _userName,
	userEmail: _userEmail,
	avatarUrl: _avatarUrl,
}: UserMenuProps) {
	// We can use Clerk's hook to get user data if we wanted to display it custom,
	// but the requirement is to use standard Clerk components.
	// UserButton handles the menu, avatar, user info, and sign out automatically.
	const { isLoaded, isSignedIn } = useUser();

	if (!isLoaded || !isSignedIn) return null;

	return <UserButton />;
}
