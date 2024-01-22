import React, { useState } from "react"
import ChevronIcon from "../../../../assets/event-screen/chevron-down.svg"
import "./index.sass"

interface AccordionProps {
	heading: string
	children?: React.ReactNode | JSX.Element | null,
	defaultOpen?:boolean
}


const MetaAccordion: React.FC<AccordionProps> = ({ heading = "", children, defaultOpen=true }) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

	return (
               <div className="accordion-wrapper">
                    <div className="container-header" onClick={() => setIsOpen(!isOpen)} >
                        <p className='text-md--sb' >{heading}</p>
                        <div className={`chavron-image-wrapper ${isOpen && "-rotate"}`}>
                            <img src={ChevronIcon} alt="" />
                        </div>
                    </div>
                    <div className={`traffic-data-rows-wrapper ${isOpen && "-open"}`}>
                    {isOpen && <>{children}</>}
                    </div>
    		</div>
	)
}

export default MetaAccordion