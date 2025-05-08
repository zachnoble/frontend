import {
	type unstable_MiddlewareFunction,
	type unstable_RouterContextProvider,
	unstable_createContext,
} from 'react-router'
import type { Toast } from './schema'
import { FLASH_SESSION, flashSessionValuesSchema } from './schema'
import { sessionStorage } from './session.server'

const toastContext = unstable_createContext<Toast | null>(null)
const sessionToastContext = unstable_createContext<Toast | null>(null)

export function toastMiddleware(): unstable_MiddlewareFunction {
	return async function toastMiddleware({ request, context }, next) {
		const cookie = request.headers.get('Cookie')
		const session = await sessionStorage.getSession(cookie)
		const result = flashSessionValuesSchema.safeParse(session.get(FLASH_SESSION))
		const flash = result.success ? result.data : undefined
		const toast = flash?.toast

		const headers = new Headers({
			'Set-Cookie': await sessionStorage.commitSession(session),
		})

		context.set(toastContext, toast ?? null)

		const res = await next()

		if (res instanceof Response) {
			if (toast) {
				res.headers.append('Set-Cookie', headers.get('Set-Cookie') ?? '')
			}

			const toastToSet = context.get(sessionToastContext)
			if (toastToSet) {
				const newSession = await sessionStorage.getSession(request.headers.get('Cookie'))
				newSession.flash(FLASH_SESSION, { toast: toastToSet })
				res.headers.append('Set-Cookie', await sessionStorage.commitSession(newSession))
			}
		}

		return res
	}
}

export const getToast = (context: unstable_RouterContextProvider) => {
	return context.get(toastContext)
}

export const setToast = (context: unstable_RouterContextProvider, toast: Toast | null) => {
	context.set(sessionToastContext, toast)
}

export function toastError(context: unstable_RouterContextProvider, message = 'An error occurred') {
	setToast(context, {
		type: 'error',
		message,
	})
}

export function toastSuccess(context: unstable_RouterContextProvider, message = 'Success!') {
	setToast(context, {
		type: 'success',
		message,
	})
}
