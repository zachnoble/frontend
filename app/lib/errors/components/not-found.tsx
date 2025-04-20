import { ErrorRoot } from './root'

export function NotFound() {
	return (
		<ErrorRoot title='404 Not Found' message='The page you are looking for no longer exists.' />
	)
}
