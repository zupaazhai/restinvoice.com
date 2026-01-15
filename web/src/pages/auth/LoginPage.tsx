import { Github, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = (provider: string) => {
		setIsLoading(true);
		// Simulate a delay for the "auth" process
		setTimeout(() => {
			setIsLoading(false);
			console.log(`Logging in with ${provider}`);

			// Mock successful login
			localStorage.setItem("auth_mock_token", "true");
			navigate("/");
		}, 1000);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md rounded-xl border py-6 gap-6 shadow-none">
				<CardHeader className="px-6 space-y-2 text-center">
					<CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
					<CardDescription className="text-muted-foreground">
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="px-6 grid gap-6">
					<div className="grid gap-4">
						<Button
							variant="outline"
							className="w-full gap-2"
							onClick={() => handleLogin("github")}
							disabled={isLoading}
						>
							<Github className="h-4 w-4" />
							Continue with Github
						</Button>
						<Button
							variant="outline"
							className="w-full gap-2"
							onClick={() => handleLogin("google")}
							disabled={isLoading}
						>
							{/* Google Icon SVG */}
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="google"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
							>
								<path
									fill="currentColor"
									d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
								></path>
							</svg>
							Continue with Google
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>

					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<Button
							variant="default"
							className="w-full gap-2"
							onClick={() => handleLogin("email")}
							disabled={isLoading || !email}
						>
							<Mail className="h-4 w-4" />
							Send Login Code
						</Button>
					</div>
				</CardContent>
				<CardFooter className="px-6 text-center text-sm text-muted-foreground">
					By clicking continue, you agree to our Terms of Service and Privacy Policy.
				</CardFooter>
			</Card>
		</div>
	);
}
