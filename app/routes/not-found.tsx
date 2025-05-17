import { Link } from 'react-router'
import { Button } from '~/components/button'
import type { Route } from './+types/not-found'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: '404 - Not Found',
			description: 'The page you are looking for no longer exists.',
		},
	]
}

export default function NotFound() {
	return (
		<main className='flex min-h-[100dvh] w-screen flex-col items-center justify-center gap-6 py-12'>
			<div className='flex flex-col items-center gap-4 text-center'>
				<h1 className='font-bold text-3xl md:text-6xl'>404 Not Found</h1>
				<p className='max-w-md text-muted text-sm'>
					The page you are looking for no longer exists.
				</p>
			</div>
			<Button asChild>
				<Link to='/'>Return Home</Link>
			</Button>
		</main>
	)
}
