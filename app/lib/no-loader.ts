import { replace } from 'react-router'

export function noLoader() {
	throw replace('/')
}
