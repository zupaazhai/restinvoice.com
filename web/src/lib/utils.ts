import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNumber(
	value: number | string,
	options: {
		style?: "decimal" | "currency" | "percent" | "unit" | "compact";
		currency?: string;
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
	} = {}
) {
	const number = typeof value === "string" ? Number.parseFloat(value) : value;

	if (Number.isNaN(number)) {
		return value.toString();
	}

	const { style = "decimal", ...otherOptions } = options;

	if (style === "compact") {
		return new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
			...otherOptions,
		}).format(number);
	}

	return new Intl.NumberFormat("en-US", {
		style: style as "decimal" | "currency" | "percent" | "unit",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		...otherOptions,
	}).format(number);
}
