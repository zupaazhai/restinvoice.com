import type {
	CreateTemplateRequest,
	Template,
	UpdateTemplateRequest,
} from "@/types/template.types";
import { client } from "../client";

export const templatesApi = {
	list: async (token?: string | null) => {
		const response = await client.get<{ data: Template[] }>("/v1/templates", { token });
		// Ensure variables are parsed if they come as strings
		if (Array.isArray(response.data)) {
			return response.data.map((t) => ({
				...t,
				variables: typeof t.variables === "string" ? JSON.parse(t.variables) : t.variables,
			}));
		}
		return [];
	},
	listSystem: (token?: string | null) => client.get<Template[]>("/v1/templates/system", { token }),
	get: async (id: string, token?: string | null) => {
		const response = await client.get<{ success: boolean; data: Template }>(`/v1/templates/${id}`, {
			token,
		});
		const t = response.data;
		return {
			...t,
			variables: typeof t.variables === "string" ? JSON.parse(t.variables) : t.variables,
		};
	},
	create: async (data: CreateTemplateRequest, token?: string | null) => {
		return client.post<{ success: boolean; data: Template }>("/v1/templates", data, { token });
	},
	update: async (id: string, data: UpdateTemplateRequest, token?: string | null) => {
		return client.patch<{ success: boolean; data: Template }>(`/v1/templates/${id}`, data, {
			token,
		});
	},
	delete: async (id: string, token?: string | null) => {
		return client.delete<{ success: boolean }>(`/v1/templates/${id}`, { token });
	},
};
