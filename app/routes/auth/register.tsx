import { Link, useFetcher } from 'react-router'
import { Button } from '~/components/button'
import { ErrorMessage } from '~/components/error-message'
import { Input } from '~/components/input'
import { Spinner } from '~/components/spinner'
import type { Route } from './+types/register'
import { register } from './api/register'

export const meta: Route.MetaFunction = () => {
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

export const action = async ({ request }: Route.ActionArgs) => {
	const formData = await request.formData()
	return await register(formData)
}

export default function Register({ actionData }: Route.ComponentProps) {
	const { data, state, Form } = useFetcher<typeof actionData>()

	const loading = state !== 'idle'
	const errors = data?.error.fields
	const message = errors ? undefined : data?.error.message

	return (
		<Form method='post' className='flex flex-col gap-4'>
			<Input type='text' name='name' placeholder='Name' error={errors?.name} />
			<Input type='text' name='email' placeholder='Email' error={errors?.email} />
			<Input
				type='password'
				name='password'
				placeholder='Password'
				error={errors?.password}
			/>
			<ErrorMessage message={message} />
			<Button type='submit'>{loading ? <Spinner /> : 'Register'}</Button>
			<Link
				className='mt-1 text-center text-muted-foreground text-xs underline-offset-4 hover:underline'
				to='/login'
			>
				Already have an account? Login
			</Link>
		</Form>
	)
}
