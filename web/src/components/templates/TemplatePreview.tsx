interface TemplatePreviewProps {
	html: string;
}

export function TemplatePreview({ html }: TemplatePreviewProps) {
	return (
		<div className="flex h-full items-start justify-center overflow-auto bg-muted/50 p-4 lg:p-8">
			<div className="w-full max-w-[850px] overflow-hidden rounded-xl bg-card shadow-xl">
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for HTML template preview
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
