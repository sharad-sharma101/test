import React, { useState } from "react"
import "./index.sass"

const TextInput: React.FC<TextInput> = ({
	label,
	placeholder = "",
	value = "",
	onChange,
	onKeyDown,
	error,
	state,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const handleOnBlur = () => {
    setIsFocused(false);
  };
	const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (onKeyDown) onKeyDown(event)
	}

	return (
		<><div className="text-input-container">
			<div className="input-label-text text-xs--sb">
				{label}
			</div>
			<div className={`text-input-form-field ${isFocused ? "focused" : ""}`}>
          <input
            className="input-field-area text-sm"
            type="text"
            placeholder={isFocused ? "" : placeholder}
            onChange={onChange}
            value={value}
            onKeyDown={handleOnKeyDown}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            disabled={state === "disabled"}
            {...props}
				/>
			</div>
			</div>
			{error && error.message && <span className=" error_text input error">{error.message}</span>}
		</>
	)
}

export default TextInput