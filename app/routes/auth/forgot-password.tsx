import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link, useNavigation } from 'react-router'
import { parseFormData, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Button } from '~/components/button'
import { FieldError } from '~/components/field'
import { Input } from '~/components/field'
import { TextField } from '~/components/field'
import { Form } from '~/components/form'
import { ArrowRightIcon } from '~/components/icons/outline/arrow-right'
import { EmailIcon } from '~/components/icons/outline/email'
import { client } from '~/lib/api/middleware.server'
import { requireGuest } from '~/lib/auth/middleware.server'
import { handleError } from '~/lib/errors.server'
import type { Route } from './+types/forgot-password'
import { AuthLayout } from './components/layout'
import { schemas } from './utils/schemas'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'Forgot your password?',
		},
		{
			name: 'description',
			content: 'Request a password reset',
		},
	]
}

const schema = z.object({
	email: schemas.email,
	recaptchaToken: schemas.recaptchaToken,
})

export async function action({ request, context }: Route.ActionArgs) {
	try {
		const api = client(context)

		const data = await parseFormData<z.infer<typeof schema>>(request)
		await api.post('/auth/forgot-password', data)

		return {
			email: data.email,
		}
	} catch (error) {
		return handleError(error, context)
	}
}

export function loader({ context }: Route.LoaderArgs) {
	return requireGuest(context)
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const email = actionData && 'email' in actionData ? actionData.email : undefined

	const {
		handleSubmit,
		formState: { errors },
		register,
		setValue,
	} = useRemixForm({
		resolver: zodResolver(schema),
	})

	if (email) {
		return (
			<AuthLayout wide>
				<div className='flex flex-col items-center justify-center'>
					<EmailIcon className='size-9' />
					<h1 className='py-2 font-bold text-xl'>Check your email</h1>
					<div className='pb-4 text-center text-muted text-sm'>
						<p>We just sent a link to reset your password to {email}.</p>
					</div>
					<Button asChild>
						<Link to='/login'>
							Go to Login <ArrowRightIcon />
						</Link>
					</Button>
				</div>
			</AuthLayout>
		)
	}

	return (
		<AuthLayout>
			<div className='mb-8 text-center'>
				<h1 className='font-bold text-2xl'>Forgot your password?</h1>
				<p className='mt-2 text-muted text-sm'>
					Enter your email and we'll send you a link to reset your password.
				</p>
			</div>

			<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextField isInvalid={Boolean(errors.email)} aria-label='Email'>
					<Input {...register('email')} type='email' placeholder='Email' />
					<FieldError>{errors.email?.message}</FieldError>
				</TextField>

				<GoogleReCaptcha onVerify={(token) => setValue('recaptchaToken', token)} />

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
