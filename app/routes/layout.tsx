import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Suspense, useEffect, useState } from 'react'
import { Await, Link, Outlet, useFetcher } from 'react-router'
import { Button } from '~/components/button'
import { Skeleton } from '~/components/skeleton'
import { getUser } from '~/lib/auth'
import type { Route } from './+types/layout'

export async function loader({ request }: Route.LoaderArgs) {
	return {
		user: getUser(request),
	}
}

export default function Layout({ loaderData: { user } }: Route.ComponentProps) {
	const { state, Form } = useFetcher()
	const loading = state !== 'idle'

	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		// Prevent scrolling when menu is open
		document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto'

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isMenuOpen])

	useEffect(() => {
		// Close menu when window is resized
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
				<div className='flex w-full max-w-[1400px] justify-end px-4'>
					<Suspense
						fallback={
							<div className='flex gap-4'>
								{/* Show skeleton for desktop view */}
								<div className='hidden gap-3 md:flex'>
									<Skeleton className='h-8 w-24' />
									<Skeleton className='h-8 w-24' />
								</div>
								{/* Show skeleton for mobile view */}
								<div className='md:hidden'>
									<Skeleton className='h-6 w-6' />
								</div>
							</div>
						}
					>
						<Await resolve={user}>
							{(user) => (
								<div>
									{/* Nav buttons for desktop view */}
									<div className='hidden gap-3 md:flex'>
										{!user && (
											<>
												<Button asChild variant='ghost' className='h-8'>
													<Link to='/login'>Login</Link>
												</Button>
												<Button asChild className='h-8'>
													<Link to='/register'>Register</Link>
												</Button>
											</>
										)}
										{user && (
											<Form method='post' action='/logout'>
												<Button
													className='h-8'
													type='submit'
													disabled={loading}
												>
													Logout
												</Button>
											</Form>
										)}
									</div>

									{/* Menu button for mobile view */}
									<div className='md:hidden'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => setIsMenuOpen(!isMenuOpen)}
										>
											<HamburgerMenuIcon className='min-h-6 min-w-6' />
										</Button>
									</div>
								</div>
							)}
						</Await>
					</Suspense>
				</div>
				{isMenuOpen && (
					<div className='absolute inset-0 z-10 flex h-screen flex-col gap-4 bg-background'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsMenuOpen(false)}
							className='absolute top-4 right-4'
						>
							<Cross2Icon />
						</Button>
						<div className='mt-auto flex w-full flex-col gap-4 p-8'>
							<Suspense
								fallback={
									<div className='flex gap-4'>
										<Skeleton className='h-10 w-full' />
									</div>
								}
							>
								<Await resolve={user}>
									{(user) => (
										<>
											{!user && (
												<>
													<Button asChild className='w-full'>
														<Link to='/login'>Login</Link>
													</Button>
													<Button
														asChild
														variant='secondary'
														className='w-full'
													>
														<Link to='/register'>Register</Link>
													</Button>
												</>
											)}
											{user && (
												<Form method='post' action='/logout'>
													<Button
														className='w-full'
														type='submit'
														variant='secondary'
														disabled={loading}
													>
														Logout
													</Button>
												</Form>
											)}
										</>
									)}
								</Await>
							</Suspense>
						</div>
					</div>
				)}
			</header>
			<Outlet />
		</div>
	)
}
