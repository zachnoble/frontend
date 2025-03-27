import { combineHeaders } from './misc'

/**
 * API request options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
	params?: Record<string, string>
	body?: unknown
}

/**
 * Successful API response structure
 */
export type ApiSuccessResponse<T> = {
	data: T
	error: null
	ok: true
	raw: Response
}

export type FieldError = {
	message: string
}

export type FieldErrors = Record<string, FieldError>

/**
 * Error API response structure
 */
export type ApiErrorResponse = {
	data: null
	error: {
		message: string
		status: number
		fields?: FieldErrors
	}
	ok: false
	raw: Response
}

/**
 * Combined API response type
 */
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Base URL for API requests
const BASE_URL = typeof window === 'undefined' ? process.env.API_URL : window.ENV.API_URL

/**
 * Constructs a complete URL with query parameters
 */
const buildUrl = (path: string, params?: Record<string, string>): string => {
	const url = new URL(`${BASE_URL}${path}`)

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.append(key, value)
		}
	}

	return url.toString()
}

/**
 * Core fetch handler with error handling and response processing
 */
const fetcher = async <T>(
	path: string,
	method: string,
	options: RequestOptions = {},
): Promise<ApiResponse<T>> => {
	const { headers = {}, body, params } = options

	const finalHeaders = new Headers({
		'Content-Type': 'application/json',
	})

	if (headers instanceof Headers) {
		for (const [key, value] of headers.entries()) {
			finalHeaders.append(key, value)
		}
	} else {
		for (const [key, value] of Object.entries(headers)) {
			finalHeaders.append(key, String(value))
		}
	}

	const url = buildUrl(path, params)

	try {
		const response = await fetch(url, {
			method,
			headers: finalHeaders,
			body: body ? JSON.stringify(body) : undefined,
			credentials: 'include',
		})

		// Handle error responses
		if (!response.ok) {
			try {
				const err = await response.json()
				const message = err?.error?.message || 'Sorry, something went wrong'
				const fields =
					(err?.error?.fields as Record<string, { message: string }>) || undefined

				return {
					data: null,
					error: {
						message,
						fields,
						status: response.status,
					},
					ok: false,
					raw: response,
				}
			} catch {
				// Fallback if error response isn't valid JSON
				return {
					data: null,
					error: {
						message: 'Sorry, something went wrong',
						status: response.status,
					},
					ok: false,
					raw: response,
				}
			}
		}

		// Handle successful responses
		const contentType = response.headers.get('content-type') || ''
		const isJson = contentType.includes('application/json')
		const data = isJson ? await response.json() : await response.text()

		return {
			data: data as T,
			error: null,
			ok: true,
			raw: response,
		}
	} catch {
		// Default error response for unexpected errors
		return {
			data: null,
			error: {
				message: 'Sorry, something went wrong',
				status: 500,
			},
			ok: false,
			raw: new Response(),
		}
	}
}

/**
 * Creates API method functions with optional default headers
 */
const initMethods = (headers: HeadersInit = {}) => ({
	get: <T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
		fetcher<T>(path, 'GET', {
			...options,
			headers: combineHeaders(headers, options?.headers),
		}),

	post: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
		fetcher<T>(path, 'POST', {
			...options,
			body,
			headers: combineHeaders(headers, options?.headers),
		}),

	put: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
		fetcher<T>(path, 'PUT', {
			...options,
			body,
			headers: combineHeaders(headers, options?.headers),
		}),

	patch: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
		fetcher<T>(path, 'PATCH', {
			...options,
			body,
			headers: combineHeaders(headers, options?.headers),
		}),

	delete: <T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
		fetcher<T>(path, 'DELETE', {
			...options,
			headers: combineHeaders(headers, options?.headers),
		}),
})

/**
 * Creates an API instance which forwards auth headers from the server
 *
 * Example usage:
 *
 *```ts
 * const api = client(request)
 * const response = await api.get('/users')
 *```
 *
 */
export const client = (request: Request | null) => {
	const headers: HeadersInit = {}

	if (request) {
		// pass whatever you want from the request to the remote server
		const cookie = request.headers.get('cookie')
		if (cookie) {
			headers.Cookie = cookie
		}
	}

	return initMethods(headers)
}

/**
 * Default API instance without forwarded headers
 *
 * Example usage:
 *
 *```ts
 * const response = await api.get('/users')
 *```
 */
export const api = initMethods()
