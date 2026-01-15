import { useAuth } from "@clerk/clerk-react";
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children }: { children: JSX.Element }) {
	const { isSignedIn, isLoaded } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return null;
	}

	if (!isSignedIn) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}
