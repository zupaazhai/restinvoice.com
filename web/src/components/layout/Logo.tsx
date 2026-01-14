export function Logo() {
	return (
		<a href="/" className="flex items-center gap-2">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
				<span className="text-sm font-bold text-primary-foreground">RI</span>
			</div>
			<span className="text-lg font-semibold text-foreground">RestInvoice</span>
		</a>
	);
}
