import type { ApiKey } from "@/types/api-key.types";
import type { PaginatedResponse } from "@/types/pagination.types";
import { client } from "../client";

export interface CreateApiKeyRequest {
	name: string;
	expires_in?: string;
}

export interface CreateApiKeyResponse {
	key: string; // The secret key, only returned on creation
	id: string; // Public reference
	name: string;
	user_id: string;
	created_at: number;
	expired_at: number | null;
}

// Raw API types matching server response
interface RawApiKey {
	id: string; // public id/ref
	ref: string;
	name: string;
	user_id: string;
	created_at: number;
	expired_at: number | null;
}

export const apiKeysApi = {
	list: async (params?: { page?: number; per_page?: number; token?: string | null }) => {
		const response = await client.get<PaginatedResponse<RawApiKey>>("/v1/api-keys", {
			...params,
			token: params?.token,
		});

		return {
			...response,
			data: response.data.map((key) => ({
				id: key.ref,
				name: key.name,
				// token is not returned in list
				expiresAt: key.expired_at ? new Date(key.expired_at * 1000).toISOString() : null,
				createdAt: new Date(key.created_at * 1000).toISOString(),
			})) as ApiKey[],
		};
	},

	create: (data: CreateApiKeyRequest, token?: string | null) =>
		client.post<{ success: boolean; data: CreateApiKeyResponse }>("/v1/api-keys", data, { token }),

	revoke: (id: string, token?: string | null) =>
		client.delete<{ success: boolean }>(`/v1/api-keys/${id}`, { token }),
};
