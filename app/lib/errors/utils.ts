export function parseError(error: unknown) {
	if (typeof error === 'string') {
		return error
	}

	if (error instanceof Object && error !== null && 'message' in error) {
		return error.message
	}

	return 'Uh oh, something went wrong'
}
