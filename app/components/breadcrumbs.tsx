import {
	type LinkProps,
	Breadcrumb as RACBreadcrumb,
	type BreadcrumbProps as RACBreadcrumbProps,
	Breadcrumbs as RACBreadcrumbs,
	type BreadcrumbsProps as RACBreadcrumbsProps,
	composeRenderProps,
} from 'react-aria-components'
import { twMerge } from 'tailwind-merge'
import { ChevronRightIcon } from './icons/outline/chevron-right'
import { Link } from './link'

export function Breadcrumbs<T extends object>({ className, ...props }: RACBreadcrumbsProps<T>) {
	return <RACBreadcrumbs {...props} className={twMerge('flex gap-1', className)} />
}

type BreadcrumbProps = RACBreadcrumbProps & LinkProps

export function Breadcrumb(props: BreadcrumbProps) {
	return (
		<RACBreadcrumb
			{...props}
			className={composeRenderProps(
				props.className as RACBreadcrumbProps['className'],
				(className) => {
					return twMerge('flex items-center gap-1', className)
				},
			)}
		>
			<Link
				{...props}
				className={({ isDisabled, isHovered }) => {
					return twMerge(
						'underline underline-offset-2',
						isDisabled && 'opacity-100',
						!isHovered && 'decoration-muted',
					)
				}}
			/>
			{props.href && <ChevronRightIcon className='size-4 text-muted' />}
		</RACBreadcrumb>
	)
}
