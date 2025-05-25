import type { unstable_RouterContextProvider } from 'react-router'
import { setToast } from 'remix-toast/middleware'
import { getErrorMessage } from './errors'
import { logger } from './logger.server'

export function handleError(error: unknown, context: unstable_RouterContextProvider) {
	// log the error on the server
	logger.error(error)

	// get user friendly error message
	const errorMessage = getErrorMessage(error)

	// show toast
	setToast(context, {
		type: 'error',
		message: errorMessage,
	})

	// return error message
	return { error: errorMessage }
}
