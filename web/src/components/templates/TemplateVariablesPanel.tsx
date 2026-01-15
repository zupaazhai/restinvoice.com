import { FileText, ImageIcon, Palette, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TemplateVariable } from "@/types/template.types";

interface TemplateVariablesPanelProps {
	variables: TemplateVariable[];
	onVariableChange: (id: string, value: string) => void;
}

export function TemplateVariablesPanel({
	variables,
	onVariableChange,
}: TemplateVariablesPanelProps) {
	const getVariableIcon = (variable: TemplateVariable) => {
		if (variable.type === "color") return Palette;
		if (variable.type === "image") return ImageIcon;
		return Type;
	};

	return (
		<aside className="flex h-full w-80 flex-col border-l border-border bg-card">
			<div className="border-b border-border p-4">
				<h3 className="flex items-center gap-2 font-semibold text-foreground">
					<FileText className="h-4 w-4 text-muted-foreground" />
					Template Variables
				</h3>
				<p className="mt-1 text-xs text-muted-foreground">Inject dynamic values for testing</p>
			</div>

			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{variables.map((variable) => {
					const Icon = getVariableIcon(variable);
					return (
						<div key={variable.id} className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor={`var-${variable.id}`}
									className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
								>
									<Icon className="h-3 w-3" />
									{variable.label}
								</label>
								<code className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
									{`{{${variable.id}}}`}
								</code>
							</div>

							{variable.type === "color" ? (
								<div className="flex gap-2">
									<input
										id={`var-${variable.id}`}
										type="color"
										value={variable.value}
										onChange={(e) => onVariableChange(variable.id, e.target.value)}
										className="h-9 w-10 cursor-pointer rounded-md border-0 bg-transparent p-0"
									/>
									<Input
										type="text"
										value={variable.value}
										onChange={(e) => onVariableChange(variable.id, e.target.value)}
										className="flex-1"
										aria-label={`${variable.label} hex value`}
									/>
								</div>
							) : (
								<Input
									id={`var-${variable.id}`}
									type="text"
									value={variable.value}
									onChange={(e) => onVariableChange(variable.id, e.target.value)}
								/>
							)}
						</div>
					);
				})}

				<div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
					<h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
						<FileText className="h-3 w-3" />
						How to use variables
					</h4>
					<p className="text-[11px] leading-relaxed text-muted-foreground">
						Use double curly braces to insert variables into your HTML. Example:{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono">
							{'<div style="color: {{primary_color}}>'}
						</code>
					</p>
				</div>
			</div>
		</aside>
	);
}
