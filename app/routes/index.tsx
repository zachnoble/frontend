import { useEffect, useState } from 'react'
import { Link, useFetcher } from 'react-router'
import { Button } from '~/components/button'
import { XIcon } from '~/components/icons/outline/x'
import { MenuIcon } from '~/components/icons/solid/menu'
import { getUser } from '~/lib/auth/middleware.server'
import type { Route } from './+types/index'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'App Name',
			description: 'App Description',
		},
	]
}

export async function loader({ context }: Route.LoaderArgs) {
	const user = getUser(context)

	return {
		user,
	}
}

export default function Index({ loaderData: { user } }: Route.ComponentProps) {
	const { state, Form } = useFetcher()
	const loading = state !== 'idle'

	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto'

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isMenuOpen])

	useEffect(() => {
		function handleResize() {
			setIsMenuOpen(false)
		}
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<div>
			<header className='flex h-[65px] w-full items-center justify-center'>
				<div className='flex w-full max-w-[1400px] justify-end px-2'>
					<div>
						{/* Nav buttons for desktop view */}
						<div className='hidden gap-3 md:flex'>
							{!user && (
								<>
									<Button asChild variant='plain'>
										<Link to='/login'>Login</Link>
									</Button>

									<Button asChild>
										<Link to='/register'>Register</Link>
									</Button>
								</>
							)}
							{user && (
								<Form method='post' action='/logout'>
									<Button className='h-8' type='submit' isDisabled={loading}>
										Logout
									</Button>
								</Form>
							)}
						</div>

						{/* Menu button for mobile view */}
						{!isMenuOpen && (
							<div className='md:hidden'>
								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									type='button'
									className='p-2'
								>
									<MenuIcon className='text-foreground' width={28} height={28} />
								</button>
							</div>
						)}
					</div>
				</div>
				{isMenuOpen && (
					<div className='absolute inset-0 z-10 flex min-h-[100dvh] flex-col gap-4 bg-background'>
						<button
							onClick={() => setIsMenuOpen(false)}
							type='button'
							className='absolute top-3.5 right-2.5 p-2'
						>
							<XIcon className='text-foreground' />
						</button>
						<div className='mt-auto flex w-full flex-col gap-4 p-8'>
							{!user && (
								<>
									<Button asChild variant='secondary'>
										<Link to='/login'>Login</Link>
									</Button>

									<Button asChild>
										<Link to='/register'>Register</Link>
									</Button>
								</>
							)}
							{user && (
								<Form method='post' action='/logout'>
									<Button type='submit' className='w-full' isDisabled={loading}>
										Logout
									</Button>
								</Form>
							)}
						</div>
					</div>
				)}
			</header>
		</div>
	)
}
