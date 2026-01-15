interface TemplateCodeEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function TemplateCodeEditor({ value, onChange }: TemplateCodeEditorProps) {
	return (
		<div className="flex h-full flex-col gap-2 bg-muted p-4">
			<div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
				<span className="font-medium uppercase tracking-wider">Template.html</span>
				<span>Language: HTML</span>
			</div>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
				className="h-full w-full flex-1 resize-none rounded-xl border border-border bg-card p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
				placeholder="Enter your HTML template here..."
			/>
		</div>
	);
}
