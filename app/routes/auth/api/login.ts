import { replace } from 'react-router'
import { api } from '~/lib/api'
import { formDataToObject } from '~/lib/misc'

export const login = async (formData: FormData) => {
	const body = await formDataToObject(formData)

	const {
		error,
		raw: { headers },
	} = await api.post('/login', body)

	if (error) return { error }

	// login successful, create redirect response
	const response = replace('/dashboard')

	// forward the sessionId cookie from the API response to the browser
	const setCookieHeader = headers.get('set-cookie')

	if (!setCookieHeader) {
		// somehow missing set-cookie header, return error
		return {
			error: {
				message: 'Something went wrong signing you in',
				fields: undefined,
			},
		}
	}

	// append the set-cookie header to the response
	response.headers.append('Set-Cookie', setCookieHeader)

	return response
}
