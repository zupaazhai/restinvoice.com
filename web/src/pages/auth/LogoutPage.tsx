import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

export function LogoutPage() {
	const { signOut } = useClerk();

	useEffect(() => {
		signOut({ redirectUrl: "/" });
	}, [signOut]);

	return null;
}
