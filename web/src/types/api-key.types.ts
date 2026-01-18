export interface ApiKey {
	id: string;
	name: string;
	token?: string;
	expiresAt: Date | string | null;
	createdAt: Date | string;
}
