interface Props {
	errors: string[] | null | undefined
}

export const ErrorMessage = ({ errors }: Props) => {
	if (errors)
		return (
			<p className='text-red-500 text-sm' aria-label='alert'>
				{errors.map((error) => (
					<span key={error}>
						{error}
						<br />
					</span>
				))}
			</p>
		)

	return null
}
