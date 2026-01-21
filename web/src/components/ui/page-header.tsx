import type { LucideIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface PageHeaderProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function PageHeader({ icon: Icon, title, description, action }: PageHeaderProps) {
	useEffect(() => {
		document.title = `${title} - RestInvoice`;
	}, [title]);

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Icon className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h1 className="text-lg font-semibold tracking-tight lg:text-xl">{title}</h1>
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
			</div>
			{action && <div className="w-full sm:w-auto">{action}</div>}
		</div>
	);
}
