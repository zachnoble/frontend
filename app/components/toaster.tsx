import { useToast } from '~/components/hooks/use-toast'
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '~/components/toast'

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => (
				<Toast key={id} {...props} className='my-1.5'>
					<div className='grid gap-1'>
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose />
				</Toast>
			))}
			<ToastViewport />
		</ToastProvider>
	)
}
