import { Link } from 'react-router'
import { Button } from '~/components/button'

type Props = {
	title: string
	message: string
}

export function ErrorRoot({ title, message }: Props) {
	return (
		<main className='flex min-h-screen w-screen flex-col items-center justify-center gap-6 p-4'>
			<div className='flex flex-col items-center gap-4 text-center'>
				<h1 className='font-bold text-3xl md:text-6xl'>{title}</h1>
				<p className='max-w-md text-muted-foreground text-sm'>{message}</p>
			</div>
			<Button asChild variant='default'>
				<Link to='/'>Return Home</Link>
			</Button>
		</main>
	)
}
