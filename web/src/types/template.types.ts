export type TemplateType = "invoice" | "receipt";

export type TemplateVariableType = "color" | "text" | "image";

export interface TemplateVariable {
	id: string;
	label: string;
	type: TemplateVariableType;
	value: string;
}

export interface Template {
	id: string;
	name: string;
	description: string;
	type: TemplateType;
	isSystem: boolean;
	thumbnail?: string;
}
