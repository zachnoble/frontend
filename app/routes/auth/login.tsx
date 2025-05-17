import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Link, data, useNavigation } from 'react-router'
import { parseFormData, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Button } from '~/components/button'
import { FieldError, Input, TextField } from '~/components/field'
import { PasswordInput } from '~/components/password-input'
import { client } from '~/lib/api/middleware.server'
import { handleError } from '~/lib/errors.server'
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

export async function action({ request, context }: Route.ActionArgs) {
	try {
		const api = client(context)

		const {
			response: { headers },
		} = await api.post('/auth/login', await parseFormData(request))

		return data(null, {
			headers,
		})
	} catch (error) {
		return handleError(error, context)
	}
}

export default function Login() {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm({
		resolver: zodResolver(
			z.object({
				email: z.string().email('Please enter a valid email address'),
				password: z.string().min(1, 'Please enter your password'),
			}),
		),
	})

	return (
		<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
			<TextField isInvalid={Boolean(errors.email)} aria-label='Email'>
				<Input {...register('email')} type='email' placeholder='Email' />
				<FieldError>{errors.email?.message}</FieldError>
			</TextField>

			<TextField isInvalid={Boolean(errors.password)} aria-label='Password'>
				<PasswordInput {...register('password')} placeholder='Password' />
				<FieldError>{errors.password?.message}</FieldError>
			</TextField>

			<Button type='submit' isPending={loading} isDisabled={loading}>
				Login
			</Button>

			<span className='text-center'>
				<Link
					to='/register'
					className='text-muted text-xs underline-offset-4 hover:underline'
				>
					Don't have an account? Register
				</Link>
			</span>
		</Form>
	)
}
