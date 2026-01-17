import type { Template } from "@/types/template.types";
import { client } from "../client";

export const templatesApi = {
	list: () => client.get<Template[]>("/v1/templates"),
	listSystem: () => client.get<Template[]>("/v1/templates/system"),
};
