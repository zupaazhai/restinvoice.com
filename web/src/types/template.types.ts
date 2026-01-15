export type TemplateType = "invoice" | "receipt";

export interface Template {
	id: string;
	name: string;
	description: string;
	type: TemplateType;
	isSystem: boolean;
	thumbnail?: string;
}
