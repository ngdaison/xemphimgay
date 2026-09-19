export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  meta?: any;
  requestId?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
