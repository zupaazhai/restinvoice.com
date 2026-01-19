interface TemplatePreviewProps {
	html: string;
}

export function TemplatePreview({ html }: TemplatePreviewProps) {
	return (
		<div className="flex h-full items-start justify-center overflow-auto rounded-xl bg-muted/50 p-4 lg:p-8">
			<div className="h-full w-full max-w-[850px] overflow-hidden rounded-xl bg-card shadow-lg">
				<iframe
					srcDoc={html}
					title="Template Preview"
					className="h-full w-full border-none"
					sandbox="allow-scripts"
				/>
			</div>
		</div>
	);
}
