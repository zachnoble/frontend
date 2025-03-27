import { type ClassValue, clsx } from 'clsx'
import { redirect } from 'react-router'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formDataToObject = async (request: Request | FormData) => {
	return Object.fromEntries(request instanceof FormData ? request : await request.formData())
}

export function combineHeaders(...headers: Array<ResponseInit['headers'] | null | undefined>) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue

		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}

export const noLoader = () => redirect('/')
