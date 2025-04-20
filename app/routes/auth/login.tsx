import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Link, useNavigation } from 'react-router'
import { getValidatedFormData, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { Spinner } from '~/components/spinner'
import { api } from '~/lib/api'
import { setAuthCookieFromResponseHeaders } from '~/lib/auth'
import { toastError } from '~/lib/toasts/middleware.server'
import type { Route } from './+types/login'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'Login',
		},
		{
			name: 'description',
			content: 'Login to your account',
		},
	]
}

const schema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Please enter your password'),
})

type FormData = z.infer<typeof schema>

const resolver = zodResolver(schema)

export async function action({ request, context }: Route.ActionArgs) {
	const {
		errors,
		data,
		receivedValues: defaultValues,
	} = await getValidatedFormData<FormData>(request, resolver)

	if (errors) {
		return { errors, defaultValues }
	}

	const {
		response: { headers },
		error,
	} = await api.post('/auth/login', data)

	if (error) {
		return toastError(context, error)
	}

	return setAuthCookieFromResponseHeaders(headers, context)
}

export default function Login() {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm<FormData>({
		mode: 'onSubmit',
		resolver,
	})

	return (
		<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
			<Input {...register('email')} error={errors.email?.message} placeholder='Email' />
			<Input
				{...register('password')}
				type='password'
				error={errors.password?.message}
				placeholder='Password'
			/>
			<Button type='submit' disabled={loading}>
				{loading ? <Spinner /> : 'Login'}
			</Button>
			<Link
				className='mt-1 text-center text-muted-foreground text-xs underline-offset-4 hover:underline'
				to='/register'
			>
				Don't have an account? Register
			</Link>
		</Form>
	)
}
