export interface PaginationMeta {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	meta: PaginationMeta;
}
