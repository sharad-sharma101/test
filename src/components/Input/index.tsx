import React, { useState } from "react"
import "./index.sass"

interface InputProps {
	placeholder?: string
	value: string | number
	error?: { message: string }
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const AppInput: React.FC<InputProps> = ({
	placeholder = "",
	value = "",
	onChange,
	onKeyDown,
	error,
	...props
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (onKeyDown) onKeyDown(event)
	}

	return (
		<>
			<div className={`${isFocused && "is-focused"} form-feild`}>
				<input
					type="text"
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					className="app-input"
					onFocus={(): void => setIsFocused(true)}
					onBlur={(): void => setIsFocused(false)}
					onKeyDown={handleOnKeyDown}
					{...props}
				/>
			</div>
			{error && error.message && <span className="error_text input">{error.message}</span>}
		</>
	)
}

export default AppInput