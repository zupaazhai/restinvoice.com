export type TemplateType = "invoice" | "receipt";

export type TemplateVariableType = "color" | "text" | "date" | "datetime" | "image";

export interface TemplateVariable {
	id: string;
	label: string;
	type: TemplateVariableType;
	value: string;
}

export interface Template {
	id: string;
	slug: string;
	name: string;
	description?: string;
	type?: TemplateType; // The API implementation doesn't seem to enforce type enum yet, but let's keep it optional
	isSystem?: boolean; // Not in API schema but used in frontend mock
	thumbnail?: string;
	html_content: string;
	variables?: Record<string, unknown> | string; // Can be JSON string or object
	created_at?: number;
	updated_at?: number;
}

export interface CreateTemplateRequest {
	name: string;
	description?: string;
	html_content: string;
	variables?: Record<string, unknown>;
}

export interface UpdateTemplateRequest {
	name?: string;
	description?: string;
	html_content?: string;
	variables?: Record<string, unknown>;
}
