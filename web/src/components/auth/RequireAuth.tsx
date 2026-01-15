import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

// TODO: Replace with actual auth logic (e.g., Clerk)
// For now, we'll assume unauthenticated if a specific flag isn't set,
// OR we can just allow everything for development if the user hasn't specified.
// However, the plan said "Redirects to /login if 'unauthenticated'".
// Let's implement a fake auth check.

const useMockAuth = () => {
	// Determine if user is "signed in"
	// For testing the UI flow, we might want to default to false so we see the login page first.
	// Or check localStorage.
	const isSignedIn = localStorage.getItem("auth_mock_token") === "true";
	return { isSignedIn };
};

export function RequireAuth({ children }: { children: JSX.Element }) {
	const { isSignedIn } = useMockAuth();
	const location = useLocation();

	if (!isSignedIn) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}
