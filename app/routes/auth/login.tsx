import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link, data, useNavigation } from 'react-router'
import { parseFormData, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Button } from '~/components/button'
import { FieldError } from '~/components/field'
import { Input } from '~/components/field'
import { TextField } from '~/components/field'
import { Form } from '~/components/form'
import { PasswordInput } from '~/components/password-input'
import { client } from '~/lib/api/middleware.server'
import { requireGuest } from '~/lib/auth/middleware.server'
import { handleError } from '~/lib/errors.server'
import type { Route } from './+types/login'
import { HomeLink } from './components/home-link'
import { AuthLayout } from './components/layout'
import { schemas } from './utils/schemas'

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

export function loader({ context }: Route.LoaderArgs) {
	return requireGuest(context)
}

export default function Login() {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const {
		handleSubmit,
		formState: { errors },
		register,
		setValue,
	} = useRemixForm({
		resolver: zodResolver(
			z.object({
				email: schemas.email,
				password: z.string().min(1, 'Please enter your password'),
				recaptchaToken: schemas.recaptchaToken,
			}),
		),
	})

	return (
		<AuthLayout>
			<HomeLink />
			<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextField isInvalid={Boolean(errors.email)} aria-label='Email'>
					<Input {...register('email')} type='email' placeholder='Email' />
					<FieldError>{errors.email?.message}</FieldError>
				</TextField>

				<TextField isInvalid={Boolean(errors.password)} aria-label='Password'>
					<PasswordInput {...register('password')} placeholder='Password' />
					<FieldError>{errors.password?.message}</FieldError>
				</TextField>

				<GoogleReCaptcha onVerify={(token) => setValue('recaptchaToken', token)} />

				<Button type='submit' isPending={loading} isDisabled={loading}>
					Login
				</Button>

				<div className='flex flex-col items-center gap-2'>
					<Link
						to='/register'
						className='text-muted text-xs underline-offset-4 hover:underline'
					>
						Don't have an account? Register
					</Link>
					<Link
						to='/forgot-password'
						className='text-muted text-xs underline-offset-4 hover:underline'
					>
						Forgot your password?
					</Link>
				</div>
			</Form>
		</AuthLayout>
	)
}
