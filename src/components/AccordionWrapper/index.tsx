import React,{useState} from 'react'
import "./index.sass"
import chevronicon from "../../assets/event-screen/chevron-down.svg"


const AccordionWrapper = ({children,title}:AccordionWrapperProps) => {

    const [showChildren,setShowChildren]=useState(true)

  return (
    <div className='accordion-parent-wrapper'>
      <div onClick={()=>setShowChildren(!showChildren)} className="accordion-wrapper-header">
        <p className='text-sm--sb'>{title}</p>
        <div className={showChildren?'accordion-chevron-img-wrapper':`accordian-chevron-img-wrapper-close`}>
            <img src={chevronicon} alt="chevron-down-icon" />
        </div>
      </div>
      {showChildren&&children}
    </div>
  )
}

export default AccordionWrapper
