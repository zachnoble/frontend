import { useEffect } from 'react'
import { Toaster as ToasterPrimitive, toast as rhToast, useToasterStore } from 'react-hot-toast'
import { ClientOnly } from '~/lib/client-only'
import type { Toast } from './types/toast'
import { toast } from './utils/toast'

const maxToasts = 4 // max number of toasts to show at once
const duration = 5000 // length a toast is visible

export function Toaster({ toastData }: { toastData: Toast | null }) {
	const { toasts } = useToasterStore()

	// render toasts which are received from the server in the root layout
	useEffect(() => {
		if (toastData) {
			toast(toastData) // custom toast fn
		}
	}, [toastData])

	// auto dismiss toasts when maxToasts is reached
	useEffect(() => {
		toasts
			.filter((t) => t.visible)
			.filter((_, i) => i + 1 >= maxToasts)
			.forEach((t) => rhToast.dismiss(t.id)) // react-hot-toast toast function
	}, [toasts])

	return (
		// only render on the client
		<ClientOnly>
			{() => <ToasterPrimitive position='top-center' toastOptions={{ duration }} />}
		</ClientOnly>
	)
}
