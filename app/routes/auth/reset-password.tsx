import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigation } from 'react-router'
import { parseFormData, useRemixForm } from 'remix-hook-form'
import { redirectWithToast } from 'remix-toast'
import { z } from 'zod'
import { Button } from '~/components/button'
import { FieldError } from '~/components/field'
import { TextField } from '~/components/field'
import { Form } from '~/components/form'
import { PasswordInput } from '~/components/password-input'
import { client } from '~/lib/api/middleware.server'
import { handleError } from '~/lib/errors.server'
import type { Route } from './+types/reset-password'
import { AuthLayout } from './components/layout'
import { schemas } from './utils/schemas'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'Reset Password',
		},
		{
			name: 'description',
			content: 'Set your new password',
		},
	]
}

export async function action({ request, context }: Route.ActionArgs) {
	try {
		const api = client(context)

		await api.post('/auth/reset-password', await parseFormData(request))

		return redirectWithToast('/login', {
			type: 'success',
			message: 'You can now login with your new password.',
		})
	} catch (error) {
		return handleError(error, context)
	}
}

export function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url)
	const token = url.searchParams.get('token')
	const email = url.searchParams.get('email')

	if (!token || !email) {
		return redirectWithToast('/login', {
			type: 'error',
			message: 'Invalid reset link, please request a new one.',
		})
	}

	return {
		email,
		token,
	}
}

export default function ResetPassword({ loaderData: { email, token } }: Route.ComponentProps) {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm({
		resolver: zodResolver(
			z
				.object({
					token: z.string(),
					email: schemas.email,
					password: schemas.password,
					confirmPassword: schemas.confirmPassword,
				})
				.refine((data) => data.password === data.confirmPassword, {
					message: "Passwords don't match",
					path: ['confirmPassword'],
				}),
		),
		defaultValues: {
			email,
			token,
		},
	})

	return (
		<AuthLayout>
			<div className='mb-8 text-center'>
				<h1 className='font-bold text-2xl'>Reset Password</h1>
				<p className='mt-2 text-muted text-sm'>Enter your new password below.</p>
			</div>

			<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input type='hidden' {...register('email')} />
				<input type='hidden' {...register('token')} />

				<TextField isInvalid={Boolean(errors.password)} aria-label='New Password'>
					<PasswordInput {...register('password')} placeholder='New Password' />
					<FieldError>{errors.password?.message}</FieldError>
				</TextField>

				<TextField
					isInvalid={Boolean(errors.confirmPassword)}
					aria-label='Confirm Password'
				>
					<PasswordInput
						{...register('confirmPassword')}
						placeholder='Confirm Password'
					/>
					<FieldError>{errors.confirmPassword?.message}</FieldError>
				</TextField>

				<Button type='submit' isPending={loading} isDisabled={loading}>
					Reset Password
				</Button>

				<span className='text-center'>
					<Link
						to='/login'
						className='text-muted text-xs underline-offset-4 hover:underline'
					>
						Back to Login
					</Link>
				</span>
			</Form>
		</AuthLayout>
	)
}
