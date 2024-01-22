import React from "react"
import "./index.sass"

interface Props {
	value: string
	name?: string
	id?: string
	className?: string
	onBlur?: () => void
	onChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea: React.FC<Props> = ({
	value = "",
	name = "",
	onChange,
	id = "",
	onBlur,
	className = "",
}) => {
	const handleBlur = () => {
		if (onBlur) onBlur()
	}

	return (
		<textarea
			value={value}
			name={name}
			id={id}
			onChange={onChange}
			onBlur={onBlur}
			className={`app-textarea ${className}`}
			data-gramm="false"
			data-gramm_editor="false"
			data-enable-grammarly="false"
		></textarea>
	)
}