import { combineHeaders } from './misc'

/**
 * API request options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
	params?: Record<string, string>
	body?: unknown
}

/**
 * API response structure
 */
export type ApiResponse<T> = {
	data: T
	error: string | null
	raw: Response
}

/**
 * Core fetch handler with error handling and response processing
 */
async function fetcher<T>(
	path: string,
	method: string,
	options: RequestOptions = {},
): Promise<ApiResponse<T>> {
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

	const baseUrl = typeof window === 'undefined' ? process.env.API_URL : window.ENV.API_URL
	const url = new URL(`${baseUrl}${path}`)

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.append(key, value)
		}
	}

	try {
		const response = await fetch(url.toString(), {
			method,
			headers: finalHeaders,
			body: body ? JSON.stringify(body) : undefined,
			credentials: 'include',
		})

		// Handle error responses
		if (!response.ok) {
			const res = await response.json()
			return {
				data: null as T,
				error: res.error.message ?? 'Sorry, something went wrong',
				raw: response,
			}
		}

		// Handle successful responses
		const contentType = response.headers.get('content-type') ?? ''
		const isJson = contentType.includes('application/json')
		const data = isJson ? await response.json() : await response.text()

		return {
			data: data as T,
			error: null,
			raw: response,
		}
	} catch {
		return {
			data: null as T,
			error: 'Sorry, something went wrong',
			raw: new Response(),
		}
	}
}

/**
 * Creates API method functions with optional default headers
 */
function initMethods(headers: HeadersInit = {}) {
	return {
		get: <T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
			fetcher<T>(path, 'GET', {
				...options,
				headers: combineHeaders(headers, options?.headers),
			}),

		post: <T>(
			path: string,
			body?: unknown,
			options?: RequestOptions,
		): Promise<ApiResponse<T>> =>
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

		patch: <T>(
			path: string,
			body?: unknown,
			options?: RequestOptions,
		): Promise<ApiResponse<T>> =>
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
	}
}

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
export function client(request: Request | null) {
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
