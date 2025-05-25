import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link, useNavigation } from 'react-router'
import { parseFormData, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Button } from '~/components/button'
import { FieldError, Input, TextField } from '~/components/field'
import { Form } from '~/components/form'
import { ArrowRightIcon } from '~/components/icons/outline/arrow-right'
import { EmailIcon } from '~/components/icons/outline/email'
import { PasswordInput } from '~/components/password-input'
import { client } from '~/lib/api/middleware.server'
import { requireGuest } from '~/lib/auth/middleware.server'
import { handleError } from '~/lib/errors.server'
import type { Route } from './+types/register'
import { AuthLayout } from './components/layout'
import { schemas } from './utils/schemas'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'Register',
		},
		{
			name: 'description',
			content: 'Create an account',
		},
	]
}

const schema = z
	.object({
		name: schemas.name,
		email: schemas.email,
		password: schemas.password,
		confirmPassword: schemas.confirmPassword,
		recaptchaToken: schemas.recaptchaToken,
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	})

export async function action({ request, context }: Route.ActionArgs) {
	try {
		const api = client(context)

		const data = await parseFormData<z.infer<typeof schema>>(request)
		await api.post('/auth/register', data)

		return {
			email: data.email,
		}
	} catch (err) {
		return handleError(err, context)
	}
}

export function loader({ context }: Route.LoaderArgs) {
	return requireGuest(context)
}

export default function Register({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation()
	const loading = navigation.state === 'submitting'

	const email = actionData && 'email' in actionData ? actionData.email : null

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
						<p>We just sent a verification link to {email}.</p>
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
			<Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextField isInvalid={Boolean(errors.name)} aria-label='Name'>
					<Input {...register('name')} placeholder='Name' />
					<FieldError>{errors.name?.message}</FieldError>
				</TextField>

				<TextField isInvalid={Boolean(errors.email)} aria-label='Email'>
					<Input {...register('email')} type='email' placeholder='Email' />
					<FieldError>{errors.email?.message}</FieldError>
				</TextField>

				<TextField isInvalid={Boolean(errors.password)} aria-label='Password'>
					<PasswordInput {...register('password')} placeholder='Password' />
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

				<GoogleReCaptcha onVerify={(token) => setValue('recaptchaToken', token)} />

				<Button type='submit' isDisabled={loading} isPending={loading}>
					Register
				</Button>

				<span className='text-center'>
					<Link
						to='/login'
						className='text-muted text-xs underline-offset-4 hover:underline'
					>
						Already have an account? Login
					</Link>
				</span>
			</Form>
		</AuthLayout>
	)
}
