import { Logo } from "./Logo"
import { CreditDisplay } from "./CreditDisplay"
import { UserMenu } from "./UserMenu"

interface HeaderProps {
  credits?: number
  userName?: string
  userEmail?: string
  avatarUrl?: string
}

export function Header({
  credits = 1000,
  userName,
  userEmail,
  avatarUrl,
}: HeaderProps) {
  const navItems = [
    { label: "Templates", href: "/templates" },
    { label: "API Key", href: "/api-key" },
  ]

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Credit + User Menu */}
        <div className="flex items-center gap-4">
          <CreditDisplay credits={credits} />
          <UserMenu
            userName={userName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </header>
  )
}
