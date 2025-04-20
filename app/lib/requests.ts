export async function formDataToObject(request: Request | FormData) {
	const formData = request instanceof FormData ? request : await request.formData()
	return Object.fromEntries(formData)
}

export function combineHeaders(...headers: Array<HeadersInit | null | undefined>) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue

		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}

export function getCookieFromRequest(request: Request, key: string) {
	try {
		const cookie = request.headers.get('Cookie')
		if (!cookie) return null
		const parsed = cookie.split('; ').find((row) => row.startsWith(`${key}=`))
		if (!parsed) return null
		return parsed.split('=')[1]
	} catch {
		return null
	}
}
