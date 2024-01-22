import React, { useEffect } from "react"
import XIcon from "../../assets/images/x-black.svg"
import "./index.sass"

interface Props {
	id?: string
	title: string
	className?: string
	titleIcon?: string
	width?: string
	closeDialog: () => void
	children: React.ReactNode | string
	footerChildren?: React.ReactNode | string
}

const DialogBox: React.FC<Props> = ({
	id = "dialog",
	title = "Title",
	closeDialog,
	className = "",
	titleIcon,
	width = "auto",
	footerChildren,
	children,
}) => {
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key.toLowerCase() === "Escape".toLowerCase()) {
			//ESC
			closeDialog()
		}
	}

	// const getTittleIcon = () => {
	// 	if (typeof titleIcon !== "string") return titleIcon
	// 	return <img className="titleIcon" src={titleIcon} alt="Loading" />
	// }

	return (
		<div
			className={"dialogbox-background"}
			id={id}
			// style={{ display: dialogBox ? "unset" : "none" }}
		>
			<div
				className={`dialogbox-container ${className}`}
				style={width ? { width: `${width}` } : {}}
			>
				{title && (
					<div className="dialog-box-block">
						<div className="dialog-box-block-title">
							{titleIcon && (
								<img className="titleIcon" src={titleIcon} alt="Loading" />
							)}
							<div className="dialog-title d-medium">{title}</div>
						</div>
						<button
							className="dialogbox-closebtn"
							onClick={() => {
								closeDialog()
							}}
						>
							<img src={XIcon} />
						</button>
					</div>
				)}
				<div className="dialog-content">{children}</div>
				{footerChildren && <div className={`dialogbox-footer`}>{footerChildren}</div>}
			</div>
		</div>
	)
}

export default DialogBox