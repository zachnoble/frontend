import { APIError } from './api/error'

export const genericErrorMessage = 'An unexpected error occured'

export function getErrorMessage(error: unknown) {
	if (error === null || error === undefined) {
		return genericErrorMessage
	}

	if (error instanceof APIError) {
		return error.message
	}

	if (error instanceof Error) {
		return genericErrorMessage
	}

	if (typeof error === 'string') {
		return error
	}

	if (error instanceof Object && 'message' in error && typeof error.message === 'string') {
		return error.message
	}

	if (error instanceof Object && 'error' in error && typeof error.error === 'string') {
		return error.error
	}

	if (
		error instanceof Object &&
		'error' in error &&
		typeof error.error === 'object' &&
		error.error !== null &&
		'message' in error.error &&
		typeof error.error.message === 'string'
	) {
		return error.error.message
	}

	return genericErrorMessage
}
