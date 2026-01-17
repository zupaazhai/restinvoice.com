import type { Template } from "@/types/template.types";
import { client } from "../client";

export const templatesApi = {
	list: (token?: string | null) => client.get<Template[]>("/v1/templates", { token }),
	listSystem: () => client.get<Template[]>("/v1/templates/system"),
};
