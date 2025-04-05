import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Link, replace, useFetcher } from 'react-router'
import { z } from 'zod'
import { Button } from '~/components/button'
import { ErrorMessage } from '~/components/error-message'
import { Input } from '~/components/input'
import { Spinner } from '~/components/spinner'
import { api } from '~/lib/api'
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
	email: z.string().email(),
	password: z.string(),
})

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema })

	if (submission.status !== 'success') {
		return submission.reply()
	}

	const {
		raw: { headers },
		error,
	} = await api.post('/auth/login', submission.value)

	if (error) {
		return submission.reply({
			formErrors: [error],
		})
	}

	const setCookieHeader = headers.get('set-cookie') ?? ''
	const response = replace('/dashboard')
	response.headers.append('Set-Cookie', setCookieHeader)

	return response
}

export default function Login() {
	const fetcher = useFetcher()
	const loading = fetcher.state !== 'idle'

	const [form, fields] = useForm({
		lastResult: fetcher.data,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<fetcher.Form
			method='post'
			id={form.id}
			onSubmit={form.onSubmit}
			noValidate
			className='flex flex-col gap-4'
		>
			<Input
				type='text'
				name={fields.email.name}
				key={fields.email.key}
				placeholder='Email'
				errors={fields.email.errors}
			/>
			<Input
				type='password'
				name={fields.password.name}
				key={fields.password.key}
				placeholder='Password'
				errors={fields.password.errors}
			/>
			<ErrorMessage errors={form.errors} />
			<Button type='submit' disabled={loading}>
				{loading ? <Spinner /> : 'Login'}
			</Button>
			<Link
				className='mt-1 text-center text-muted-foreground text-xs underline-offset-4 hover:underline'
				to='/register'
			>
				Don't have an account? Register
			</Link>
		</fetcher.Form>
	)
}
