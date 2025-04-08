import type { Route } from './+types'

export function meta(): Route.MetaDescriptors {
	return [
		{
			title: 'App',
		},
		{
			name: 'description',
			content: 'This is an app built with React Router.',
		},
	]
}

export default function Home() {
	return <div className='text-center'>You are home</div>
}
