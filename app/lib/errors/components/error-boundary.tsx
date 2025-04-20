import { Links } from 'react-router'
import { Meta } from 'react-router'
import { Scripts } from 'react-router'
import { ErrorRoot } from './root'

export function ErrorBoundary() {
	return (
		<html lang='en' className='dark'>
			<head>
				<title>Error</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body>
				<ErrorRoot
					title='Uh, oh!'
					message='Something went wrong. Please try again later.'
				/>
				<Scripts />
			</body>
		</html>
	)
}
