import type { unstable_RouterContextProvider } from 'react-router'
import { getErrorMessage } from './errors'
import { logger } from './logger.server'
import { toastError } from './toasts/middleware.server'

export function handleError(error: unknown, context: unstable_RouterContextProvider) {
	// log the error on the server
	logger.error(error)

	// get user friendly error message
	const errorMessage = getErrorMessage(error)

	// show toast
	toastError(context, errorMessage)

	// return error message
	return { error: errorMessage }
}
