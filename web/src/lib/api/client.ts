export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl?: string) {
		this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || "http://localhost:8787";
	}

	async get<T>(path: string, options?: RequestInit & { token?: string | null }): Promise<T> {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options?.headers,
		};

		if (options?.token) {
			(headers as Record<string, string>).Authorization = `Bearer ${options.token}`;
		}

		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}

		return response.json();
	}

	async post<T>(
		path: string,
		body: unknown,
		options?: RequestInit & { token?: string | null }
	): Promise<T> {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options?.headers,
		};

		if (options?.token) {
			(headers as Record<string, string>).Authorization = `Bearer ${options.token}`;
		}

		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			method: "POST",
			headers,
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
		}

		return response.json();
	}

	async delete<T>(path: string, options?: RequestInit & { token?: string | null }): Promise<T> {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options?.headers,
		};

		if (options?.token) {
			(headers as Record<string, string>).Authorization = `Bearer ${options.token}`;
		}

		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			method: "DELETE",
			headers,
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.statusText}`);
		}

		return response.json();
	}
}

export const client = new ApiClient();
