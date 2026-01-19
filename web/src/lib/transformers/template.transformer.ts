import type { TemplateVariable, TemplateVariableType } from "@/types/template.types";

/**
 * Transforms the API variables record into an array of TemplateVariable for the UI.
 * Handles both "simple key-value" and "rich metadata" formats.
 */
export function transformVariablesToArray(
	variables: Record<string, unknown> | string | undefined
): TemplateVariable[] {
	if (!variables) return [];

	let parsed: Record<string, unknown> = {};
	if (typeof variables === "string") {
		try {
			parsed = JSON.parse(variables);
		} catch {
			return [];
		}
	} else {
		parsed = variables;
	}

	return Object.entries(parsed).map(([key, value]) => {
		// specific check if the value is our rich object format
		// We use type narrowing
		if (
			typeof value === "object" &&
			value !== null &&
			"value" in value &&
			"type" in value &&
			"label" in value
		) {
			const v = value as { value: string; type: TemplateVariableType; label: string };
			return {
				id: key,
				label: v.label,
				type: v.type,
				value: v.value,
			};
		}

		// fallback for simple key-value pairs (legacy or other sources)
		return {
			id: key,
			label: key
				.split("_")
				.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
				.join(" "), // simple title case
			type: "text" as TemplateVariableType,
			value: String(value),
		};
	});
}

/**
 * Transforms an array of TemplateVariable from the UI into a Record for the API.
 * Preserves metadata (type, label).
 */
export function transformVariablesToRecord(variables: TemplateVariable[]): Record<string, unknown> {
	const record: Record<string, unknown> = {};
	for (const v of variables) {
		record[v.id] = {
			value: v.value,
			type: v.type,
			label: v.label,
		};
	}
	return record;
}
