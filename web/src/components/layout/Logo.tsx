import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
	return (
		<Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
			<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
				<FileText className="h-5 w-5 text-primary-foreground" />
			</div>
			<span className="text-lg font-semibold">REST Invoice</span>
		</Link>
	);
}
