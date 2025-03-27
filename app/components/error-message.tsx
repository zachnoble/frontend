interface Props {
	message: string | null | undefined
}

export const ErrorMessage = ({ message }: Props) => {
	if (message)
		return (
			<p className='text-red-500 text-sm' aria-label='alert'>
				{message.split('\n').map((line) => (
					<span key={line}>
						{line}
						<br />
					</span>
				))}
			</p>
		)

	return null
}
