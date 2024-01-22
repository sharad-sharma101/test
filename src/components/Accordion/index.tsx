import React, { useState } from "react"
import ChevronIcon from "../../assets/images/chevron-down.svg"
import "./index.sass"

interface AccordionProps {
	heading: string
	children?: React.ReactNode | JSX.Element | null,
	defaultOpen?:boolean
}


const Accordion: React.FC<AccordionProps> = ({ heading = "", children, defaultOpen=false }) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

	return (
		<div className="accordion-container">
			<div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
				<span>{heading}</span>
				<div className={`accordion-chevron ${isOpen && "-rotate"}`}>
					<img src={ChevronIcon} alt="chevron icon" />
				</div>
			</div>
			<div className={`${isOpen && "-open"} accordion-body`}>{isOpen && <>{children}</>}</div>
		</div>
	)
}

export default Accordion
