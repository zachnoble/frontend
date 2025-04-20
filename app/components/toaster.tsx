import { useEffect } from 'react'
import toast, { Toaster as ToasterPrimitive, useToasterStore } from 'react-hot-toast'
import { ClientOnly } from '~/lib/ssr/client-only'

export function Toaster() {
	const { toasts } = useToasterStore()

	const maxToasts = 5

	useEffect(() => {
		toasts
			.filter((t) => t.visible)
			.filter((_, i) => i >= maxToasts)
			.forEach((t) => toast.dismiss(t.id))
	}, [toasts])

	return <ClientOnly fallback={null}>{() => <ToasterPrimitive />}</ClientOnly>
}
