import { Link } from 'react-router'
import { Button } from '~/components/button'
import { ChevronLeftIcon } from '~/components/icons/outline/chevron-left'

export function HomeLink() {
	return (
		<div className='absolute top-5 left-5'>
			<Button asChild variant='plain'>
				<Link to='/' className=''>
					<div className='flex items-center gap-2 pr-1.5'>
						<ChevronLeftIcon className='text-muted' /> Home
					</div>
				</Link>
			</Button>
		</div>
	)
}
