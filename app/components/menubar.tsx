import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import {
	type ComponentProps,
	type ComponentPropsWithoutRef,
	type ComponentRef,
	type HTMLAttributes,
	forwardRef,
} from 'react'
import { cn } from '~/lib/tailwind'

function MenubarMenu({ ...props }: ComponentProps<typeof MenubarPrimitive.Menu>) {
	return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({ ...props }: ComponentProps<typeof MenubarPrimitive.Group>) {
	return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({ ...props }: ComponentProps<typeof MenubarPrimitive.Portal>) {
	return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({ ...props }: ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
	return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({ ...props }: ComponentProps<typeof MenubarPrimitive.Sub>) {
	return <MenubarPrimitive.Sub data-slot='menubar-sub' {...props} />
}

const Menubar = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Root>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Root
		ref={ref}
		className={cn(
			'flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm',
			className,
		)}
		{...props}
	/>
))

const MenubarTrigger = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-3 py-1 font-medium text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
			className,
		)}
		{...props}
	/>
))

const MenubarSubTrigger = forwardRef<
	ComponentRef<typeof MenubarPrimitive.SubTrigger>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
		inset?: boolean
	}
>(({ className, inset, children, ...props }, ref) => (
	<MenubarPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
			inset && 'pl-8',
			className,
		)}
		{...props}
	>
		{children}
		<ChevronRightIcon className='ml-auto h-4 w-4' />
	</MenubarPrimitive.SubTrigger>
))

const MenubarSubContent = forwardRef<
	ComponentRef<typeof MenubarPrimitive.SubContent>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.SubContent
		ref={ref}
		className={cn(
			'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-[--radix-menubar-content-transform-origin] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in',
			className,
		)}
		{...props}
	/>
))

const MenubarContent = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Content>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.Content
			ref={ref}
			align={align}
			alignOffset={alignOffset}
			sideOffset={sideOffset}
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-[--radix-menubar-content-transform-origin] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in',
				className,
			)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
))

const MenubarItem = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Item>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className,
		)}
		{...props}
	/>
))

const MenubarCheckboxItem = forwardRef<
	ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<MenubarPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<MenubarPrimitive.ItemIndicator>
				<CheckIcon className='h-4 w-4' />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.CheckboxItem>
))

const MenubarRadioItem = forwardRef<
	ComponentRef<typeof MenubarPrimitive.RadioItem>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenubarPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<MenubarPrimitive.ItemIndicator>
				<DotFilledIcon className='h-4 w-4 fill-current' />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.RadioItem>
))

const MenubarLabel = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Label>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 font-semibold text-sm', inset && 'pl-8', className)}
		{...props}
	/>
))

const MenubarSeparator = forwardRef<
	ComponentRef<typeof MenubarPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-muted', className)}
		{...props}
	/>
))

const MenubarShortcut = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn('ml-auto text-muted-foreground text-xs tracking-widest', className)}
			{...props}
		/>
	)
}

export {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	MenubarSeparator,
	MenubarLabel,
	MenubarCheckboxItem,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarPortal,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarGroup,
	MenubarSub,
	MenubarShortcut,
}
