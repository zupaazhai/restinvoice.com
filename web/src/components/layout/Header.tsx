import { FolderHeart, Key, LayoutTemplate, Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ThemeToggle } from "../ui/theme-toggle";
import { CreditDisplay } from "./CreditDisplay";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
	credits?: number;
	userName?: string;
	userEmail?: string;
	avatarUrl?: string;
}

export function Header({ credits = 1000, userName, userEmail, avatarUrl }: HeaderProps) {
	const navItems = [
		{ label: "Templates", href: "/templates", icon: LayoutTemplate },
		{ label: "My Templates", href: "/my-templates", icon: FolderHeart },
		{ label: "API Keys", href: "/api-keys", icon: Key },
	];

	// State to control mobile menu
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				{/* Left: Logo */}
				<Logo />

				{/* Center: Desktop Navigation */}
				<nav className="hidden items-center gap-1 md:flex">
					{navItems.map((item) => (
						<NavLink
							key={item.href}
							to={item.href}
							className={({ isActive }) =>
								`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
									isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
								}`
							}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Right: Theme Toggle + Credit + User Menu + Mobile Nav */}
				<div className="flex items-center gap-4">
					<CreditDisplay credits={credits} />
					<div className="hidden md:block">
						<ThemeToggle />
					</div>
					<UserMenu userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />

					{/* Mobile Menu Trigger */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[280px] p-6 sm:w-[320px]">
							<div className="absolute top-4 right-16">
								<ThemeToggle />
							</div>
							<nav className="mt-8 flex flex-col gap-1">
								{navItems.map((item) => (
									<NavLink
										key={item.href}
										to={item.href}
										onClick={() => setIsOpen(false)}
										className={({ isActive }) =>
											`-mx-2 flex min-h-11 items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
												isActive ? "bg-accent text-accent-foreground" : "text-foreground"
											}`
										}
									>
										<item.icon className="h-4 w-4" />
										{item.label}
									</NavLink>
								))}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
