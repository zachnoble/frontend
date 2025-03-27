import { api } from '~/lib/api'
import { formDataToObject } from '~/lib/misc'
import { replaceWithToast } from '~/lib/toast.server'
import { login } from './login'

export const register = async (formData: FormData) => {
	const body = await formDataToObject(formData)

	// try to register the user
	const { error } = await api.post('/register', body)

	// failed to register, return error
	if (error) return { error }

	// register successful, try to login the user as well
	const res = await login(formData)

	// successful login response, redirect to dashboard
	if (res instanceof Response) {
		return replaceWithToast(
			'/dashboard',
			{
				title: 'Account created!',
				description: "You've successfully created an account.",
			},
			res,
		)
	}

	// automatic login failed, send to login page with register success toast
	return replaceWithToast('/login', {
		title: 'Account created!',
		description: 'You can now log in to your account.',
	})
}
