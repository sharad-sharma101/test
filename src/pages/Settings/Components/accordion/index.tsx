import React, { useState, useRef, useEffect } from "react";
import ChevronIcon from "../../../../assets/images/chevron-down.svg"
import "./index.sass"
import CaretUp from "../../../../assets/icons-v2/Icon caret-up.svg"
import CaretDown from "../../../../assets/icons-v2/Icon caret-down.svg"
import DeleteIcon from "../../../../assets/icons-v2/Icon delete.svg"
import CheckIconGrey from "../../../../assets/icons-v2/Check icongrey.svg"
import CheckIconGreen from "../../../../assets/images/check-icon-green28.svg";

import PlusIcon from "../../../../assets/icons-v2/Iconplus.svg"
import Switch from "../switch"

interface AccordionProps {
    heading: string
	children?: React.ReactNode | JSX.Element | null,
	defaultOpen?:boolean
  stepCompleted?:number
}

const Accordion: React.FC<AccordionProps> = ({ heading = "", children, defaultOpen=false, stepCompleted=0 }) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)
    const [contentHeight, setContentHeight] = useState<string | number>('0');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      }, [isOpen]);
    
      const handleToggle = () => {
        setIsOpen(!isOpen);
      };


    return (
        <>
        <div className="header-of-accordion--wrapper">
          <div className="heading-of-accordion-sub-heading--wrapper">
          <div className="heading-of-accordion-sub-heading--img">{(stepCompleted === 2) ? <img src={CheckIconGreen} alt="" /> : <img src={CheckIconGrey} alt="" />}</div>         
              <p className="text-lg--sb"> {heading} </p>
          </div>
          <div className="accordion-caret--wrapper">
                <Switch />
            <img src={DeleteIcon} alt="" />
            <div className={`accordion-caret--toggle ${isOpen ? "expanded" : ""}`} onClick={handleToggle}>
            <img src={CaretDown} alt="" />
            </div>
          </div>
      </div>

      <div
        className={`accordion-content--wrapper ${isOpen ? "open":""}`}
        style={{ 
            height: isOpen ? contentHeight : 0,
            opacity: isOpen ? 1 : 0,
         }}
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {/* {isOpen && <>{children}</>} */}
      
      </>
    )
}

export default Accordion;