import type { Appearance } from "@clerk/types";

/**
 * Clerk appearance configuration to match the design system
 * - Semantic color tokens from design-concept.md
 * - Generous spacing and prominent shadows
 */
export const clerkAppearance: Appearance = {
	variables: {
		borderRadius: "var(--radius)",
		colorPrimary: "var(--primary)",
		colorBackground: "var(--background)",
		colorInputBackground: "var(--background)",
		colorInputText: "var(--foreground)",
		colorText: "var(--foreground)",
		colorTextOnPrimaryBackground: "var(--primary-foreground)",
		colorTextSecondary: "var(--muted-foreground)",
	},
	elements: {
		// Remove rootBox shadow if it exists
		rootBox: {
			boxShadow: "none",
		},

		// Main card container - make transparent, let cardBox show
		card: {
			borderRadius: "calc(var(--radius) + 4px)", // rounded-xl = 16px
			boxShadow: "var(--shadow-sm)",
			border: "1px solid var(--border)",
			margin: "0",
			backgroundColor: "var(--card)", // Ensure white
			// Forcefully override all child borders and backgrounds
			"& *": {
				borderTop: "0 !important",
				borderBottom: "0 !important",
				backgroundImage: "none !important",
			},
			"& > *": {
				backgroundColor: "transparent",
			},
		},

		// Outer container - this contains everything including footer
		cardBox: {
			boxShadow: "none", // Let card handle shadow
			borderRadius: "calc(var(--radius) + 4px)",
			border: "none",
			backgroundColor: "transparent",
		},

		// Footer styling - white background, no separators
		footer: {
			backgroundColor: "var(--card)",
			backgroundImage: "none",
			borderTop: "0",
		},

		footerAction: {
			backgroundColor: "var(--card)",
			backgroundImage: "none",
			borderTop: "0",
		},

		footerActionText: {
			borderTop: "0",
			backgroundColor: "var(--card)",
		},

		footerActionLink: {
			color: "var(--muted-foreground)",
			"&:hover": {
				color: "var(--foreground)",
			},
		},

		// Development mode / branding section
		developerModeNotice: {
			backgroundColor: "var(--card)",
			backgroundImage: "none", // Remove stripes
			borderTop: "0",
		},

		// Main content wrapper
		main: {
			borderTop: "0",
			borderBottom: "0",
		},

		// Footer pages wrapper
		footerPages: {
			backgroundColor: "var(--card)",
			backgroundImage: "none",
			borderTop: "0",
		},

		// Card actions
		cardActions: {
			borderTop: "0",
		},

		// Divider elements
		dividerRow: {
			display: "none", // Hide dividers completely
		},

		// Primary form buttons
		formButtonPrimary: {
			borderRadius: "calc(var(--radius) - 2px)", // rounded-md
			backgroundColor: "var(--primary)",
			color: "var(--primary-foreground)",
			"&:hover": {
				backgroundColor: "var(--primary)",
				filter: "brightness(0.9)", // slightly darker on hover since we can't easily modify hsl alpha
			},
		},

		// Input fields
		formFieldInput: {
			borderRadius: "calc(var(--radius) - 2px)", // rounded-md
			backgroundColor: "var(--background)",
			borderColor: "var(--input)",
			color: "var(--foreground)",
			"&:focus": {
				borderColor: "var(--ring)",
				boxShadow: "0 0 0 2px var(--ring)", // Solid ring
			},
		},

		// Social connection buttons
		socialButtonsBlockButton: {
			borderRadius: "calc(var(--radius) - 2px)", // rounded-md
			backgroundColor: "var(--secondary)",
			color: "var(--secondary-foreground)",
			borderColor: "var(--border)",
			"&:hover": {
				backgroundColor: "var(--secondary)",
				opacity: "0.8",
			},
		},

		// Header styling
		headerTitle: {
			color: "var(--foreground)",
			fontFamily: "var(--font-sans)",
		},

		headerSubtitle: {
			color: "var(--muted-foreground)",
		},

		// Text elements
		formFieldLabel: {
			color: "var(--foreground)",
		},

		// Error states
		formFieldErrorText: {
			color: "var(--destructive)",
		},
	},
};
