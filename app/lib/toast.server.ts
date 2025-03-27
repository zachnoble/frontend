import { createCookieSessionStorage, redirect, replace } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { privateConfig } from '~/config'
import { combineHeaders } from './misc'

export const toastKey = 'toast'

const ToastSchema = z.object({
	id: z.string().default(() => uuidv4()),
	title: z.string().optional(),
	description: z.string().optional(),
	type: z.enum(['foreground', 'background']).default('foreground'),
})

export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

export const toastSessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'en_toast',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [privateConfig.SIGNATURE],
	},
})

export async function redirectWithToast(url: string, toast: ToastInput, init?: ResponseInit) {
	return redirect(url, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	})
}

export async function replaceWithToast(url: string, toast: ToastInput, init?: ResponseInit) {
	return replace(url, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	})
}

export async function createToastHeaders(toastInput: ToastInput) {
	const toast = ToastSchema.parse(toastInput)
	const session = await toastSessionStorage.getSession()
	session.flash(toastKey, toast)
	const cookie = await toastSessionStorage.commitSession(session)
	return new Headers({ 'set-cookie': cookie })
}

export async function getToast(request: Request) {
	const session = await toastSessionStorage.getSession(request.headers.get('cookie'))
	const result = ToastSchema.safeParse(session.get(toastKey))
	const toast = result.success ? result.data : null
	return {
		toast,
		headers: toast
			? new Headers({
					'set-cookie': await toastSessionStorage.destroySession(session),
				})
			: null,
	}
}
