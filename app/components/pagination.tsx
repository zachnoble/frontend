import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ComponentProps, forwardRef } from 'react'
import { type ButtonProps, buttonVariants } from '~/components/button'
import { cn } from '~/lib/tailwind'

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
	<nav
		aria-label='pagination'
		className={cn('mx-auto flex w-full justify-center', className)}
		{...props}
	/>
)

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
	({ className, ...props }, ref) => (
		<ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
	),
)

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
	({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
)

type PaginationLinkProps = {
	isActive?: boolean
} & Pick<ButtonProps, 'size'> &
	ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
	<a
		aria-current={isActive ? 'page' : undefined}
		className={cn(
			buttonVariants({
				variant: isActive ? 'outline' : 'ghost',
				size,
			}),
			className,
		)}
		{...props}
	/>
)

const PaginationPrevious = ({ className, ...props }: ComponentProps<typeof PaginationLink>) => (
	<PaginationLink
		aria-label='Go to previous page'
		size='default'
		className={cn('gap-1 pl-2.5', className)}
		{...props}
	>
		<ChevronLeftIcon className='h-4 w-4' />
		<span>Previous</span>
	</PaginationLink>
)

const PaginationNext = ({ className, ...props }: ComponentProps<typeof PaginationLink>) => (
	<PaginationLink
		aria-label='Go to next page'
		size='default'
		className={cn('gap-1 pr-2.5', className)}
		{...props}
	>
		<span>Next</span>
		<ChevronRightIcon className='h-4 w-4' />
	</PaginationLink>
)

const PaginationEllipsis = ({ className, ...props }: ComponentProps<'span'>) => (
	<span
		aria-hidden
		className={cn('flex h-9 w-9 items-center justify-center', className)}
		{...props}
	>
		<DotsHorizontalIcon className='h-4 w-4' />
		<span className='sr-only'>More pages</span>
	</span>
)

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
}
