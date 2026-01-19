import { Editor, type Monaco } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { Dracula } from "@/lib/monaco-themes";

interface TemplateCodeEditorProps {
	value: string;
	onChange: (value: string) => void;
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
					loading={
						<div className="flex h-full w-full items-center justify-center bg-card text-muted-foreground">
							<Loader2 className="animate-spin" />
						</div>
					}
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
