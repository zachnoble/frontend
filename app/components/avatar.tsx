import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react'
import { cn } from '~/lib/tailwind'

const Avatar = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Root>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
		{...props}
	/>
))

const AvatarImage = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Image>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn('aspect-square h-full w-full', className)}
		{...props}
	/>
))

const AvatarFallback = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Fallback>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			'flex h-full w-full items-center justify-center rounded-full bg-muted',
			className,
		)}
		{...props}
	/>
))

export { Avatar, AvatarImage, AvatarFallback }
