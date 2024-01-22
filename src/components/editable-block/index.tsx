import React, {useState} from "react"
import "./index.sass"

interface EditableBlock {
	placeholder?: string
	value: string
	name?: string
	id?: string
	className?: string
	onBlur?: () => void
	onChange: (e:React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const EditableBlock: React.FC<EditableBlock> = ({
	value = "",
	name = "",
	onChange,
	id = "",
	onBlur,
	placeholder="",
	className = "",
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const handleOnFocus = () => {
		setIsFocused(true);
	  };
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
			placeholder={isFocused ? "" : placeholder}
			className={`edit-textarea text-sm ${className}`}
			data-gramm="false"
			data-gramm_editor="false"
			data-enable-grammarly="false"
			onFocus={handleOnFocus}
		></textarea>
	)
}