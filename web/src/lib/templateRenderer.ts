import Handlebars from "handlebars";

interface RenderOptions {
	html: string;
	variables: Record<string, unknown>;
}

/**
 * Renders an HTML template using Handlebars.
 *
 * Supports:
 * - `{{variable}}` - Simple variable replacement
 * - `{{#each items}}...{{/each}}` - Loop over arrays
 * - `{{#if condition}}...{{else}}...{{/if}}` - Conditionals
 * - `{{@index}}`, `{{@first}}`, `{{@last}}` - Loop context variables
 *
 * @param options - The render options containing html template and variables
 * @returns The rendered HTML string
 */
export function renderTemplate({ html, variables }: RenderOptions): string {
	try {
		const template = Handlebars.compile(html);
		return template(variables);
	} catch (error) {
		console.error("Template rendering failed:", error);
		// Return original HTML if compilation fails to prevent blank previews
		return html;
	}
}
