import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutPage() {
	const navigate = useNavigate();

	useEffect(() => {
		// Clear mock auth token
		localStorage.removeItem("auth_mock_token");
		// Redirect to login
		navigate("/login", { replace: true });
	}, [navigate]);

	return null; // Or a spinner/loading state if desired
}
