import React from "react"
import ButtonLoader from "../../assets/images/Loaders/button-loader-light.svg"
import "./index.sass"

interface ButtonProps {
	label?: string
	icon?: string
	// size:string,
	type?: string
	isLoading?: boolean
	styles?: {
		[key: string]: string
	}
	onClick: (e: any) => void
	className?: string
	suffix?: string
	prefix?: string
	disabled?:boolean
	loading?:boolean
}

const Button: React.FC<ButtonProps> = ({
	label = "",
	type = "",
	styles = {},
	onClick,
	className,
	prefix = "",
	suffix = "",
	disabled=false,
	loading=false,
	...props
}) => {

	const getLoaderIcon = () => {
        return <img className="LoadingIcon" src={ButtonLoader} alt="Loading" />
    }

	return (
		<button
			className={`${className} button ${type} ${disabled ? 'disabled' : 'active' } ${loading ? "button-loading" : ''}`}
			style={styles}
			onClick={onClick}
			{...props}
		>
		{loading ? getLoaderIcon() :	<>
			{prefix && (
				<div className="button-prefix-icon">
					<img src={prefix} />
				</div>
			)}
			{label}
			{suffix && (
				<div className="button-prefix-icon">
					<img src={suffix} />
				</div>
			)}
			</>}
		</button>
	)
}

export default Button