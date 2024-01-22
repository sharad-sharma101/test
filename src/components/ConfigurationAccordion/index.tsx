// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import ChevronIcon from "../../assets/images/chevron-down.svg"
import "./index.sass"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import { useAppSelector } from "../../app/hooks"

interface AccordionProps {
	heading: string,
	subHeading: string
	children?: React.ReactNode | JSX.Element | null,
	defaultOpen?:boolean,
	instruction?: string ,
	handleInstruction?: () => void
}

const ConfigurationAccordion: React.FC<AccordionProps> = ({ heading = "", subHeading="", children, defaultOpen=false , instruction , handleInstruction}) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

  const {isVariantLoading}=useSelector((store:any)=>store.templateConfigs)
	const contentEl: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const [contentHeight , setContentHeight] = useState<any>()
	const {triggerArray }=useAppSelector((store)=>store.triggersConfig)

	useEffect(()=>{
		setContentHeight(contentEl.current?.querySelector(".configuration-accordion-body").offsetHeight + "px")
	},[triggerArray])
	return (
		<div className={`${isOpen && "open-accordion"} configuration-accordion-container`}>
		
			<div className={`${isOpen && "open-accordion"} schedule--container-header`}>
				<div className="header-heading-container">
					<h1 className='text-xl--sb' >{heading}</h1>
					<h2 className='text-sm' >{subHeading}</h2>
				</div>
				<div className="right-section-accordion">
					<p className="instruction_wrapper text-sm--md" onClick={handleInstruction}>{instruction}</p>
					<div onClick={() => setIsOpen(!isOpen)}  className={isOpen? 'active chevron-down-image--wrapper' : 'chevron-down-image--wrapper'}>
						<img src={ChevronIcon} alt="" />
					</div>
				</div>
        	</div>
			<div ref={contentEl} className="accordion-body-transition" style={isVariantLoading
				 ?
				  {height : "12.5rem", overflow: "hidden"} 
				  : 
				  isOpen ? { height: contentHeight} : { height: "0px", overflow: "hidden"}}>
        		{isVariantLoading&&
				<div className="accordian-loader-skeleton-wrapper" style={{height:"12.5rem"}}>
					<Skeleton className="accordian-loader-content"  />
					<Skeleton className="accordian-loader-content"  />
					<Skeleton className="accordian-loader-content"  />

				</div>
				}
				<div className={`${isOpen && "open-accordion"} configuration-accordion-body`} >{!isVariantLoading && children}</div>
			</div>
		</div>	
	)
}

export default ConfigurationAccordion
