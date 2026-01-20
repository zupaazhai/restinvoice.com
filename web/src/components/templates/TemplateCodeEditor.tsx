import { Editor, type Monaco } from "@monaco-editor/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dracula } from "@/lib/monaco-themes";

interface TemplateCodeEditorProps {
	value: string;
	onChange: (value: string) => void;
}

function TemplateCodeEditorSkeleton() {
	// Generate stable IDs for skeleton elements (avoids array index key lint error)
	const SKELETON_LINE_COUNT = 20;
	const lineIds = Array.from({ length: SKELETON_LINE_COUNT }, (_, i) => `line-${i}`);
	const codeLineIds = Array.from({ length: SKELETON_LINE_COUNT }, (_, i) => `code-${i}`);

	return (
		<div className="flex h-full w-full flex-col bg-[#282a36] p-4">
			<div className="flex flex-1 gap-4">
				{/* Line Numbers */}
				<div className="flex w-8 flex-col gap-1.5 pt-1 text-right">
					{lineIds.map((id) => (
						<Skeleton key={id} className="ml-auto h-4 w-4 bg-white/10" />
					))}
				</div>
				{/* Code Lines */}
				<div className="flex flex-1 flex-col gap-1.5 pt-1">
					{codeLineIds.map((id) => (
						<Skeleton
							key={id}
							className="h-4 bg-white/10"
							style={{
								width: `${Math.max(20, Math.random() * 60 + 20)}%`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function TemplateCodeEditor({ value, onChange }: TemplateCodeEditorProps) {
	const handleEditorWillMount = (monaco: Monaco) => {
		monaco.editor.defineTheme("dracula", Dracula);
	};

	return (
		<div className="flex h-full flex-col gap-2 bg-muted p-4">
			<div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
				<span className="font-medium uppercase tracking-wider">Template.html</span>
				<span>Language: HTML</span>
			</div>
			<div className="h-full w-full flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
				<Editor
					height="100%"
					defaultLanguage="html"
					theme="dracula"
					value={value}
					beforeMount={handleEditorWillMount}
					onChange={(value) => onChange(value || "")}
					loading={<TemplateCodeEditorSkeleton />}
					options={{
						minimap: { enabled: true },
						fontSize: 14,
						lineNumbers: "on",
						roundedSelection: false,
						scrollBeyondLastLine: false,
						readOnly: false,
						automaticLayout: true,
						padding: { top: 16, bottom: 16 },
						fontFamily: "monospace",
					}}
				/>
			</div>
		</div>
	);
}
