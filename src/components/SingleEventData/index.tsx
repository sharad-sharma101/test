import React, { useEffect, useState } from 'react'
import "./index.sass"
import chevronBlack from '/src/assets/event-screen/chevron-right-event.svg'
import chevronWhite from '/src/assets/event-screen/chevron-right-white.svg'
import chevronDown from "/src/assets/event-screen/chevron-down.svg"
import { convertTimeToUtcZone } from '../../utils/helpers'
import EventProperty from '../../pages/UserProfileView/EventProperty'

const SingleEventData = ({selectedEvent,lastEvent,time,title,data,onClick,_id,event,accordian=false}:SingleEventProps) => {
const [showChildrens,setShowChildren]=useState(false)
const [heightLine,setHeightLine]=useState("")

      useEffect(()=>{
        let element1 = document?.querySelector(".accordian-event-data-wrapper");
        let element2 = document?.querySelector(".location-specific-wrapper-accordion");
        let height1: number = (element1 as HTMLElement)?.offsetHeight;
        let height2: number = (element2 as HTMLElement)?.offsetHeight;
       
        setHeightLine((height1+height2)+"px")
        if(!showChildrens){
            setHeightLine("3.7rem")
          }

          
    },[showChildrens,data])

    return (
   <>
   {!accordian?<div onClick={()=>onClick(event)} className={selectedEvent?'event-item-wrapper-selected':`event-item-wrapper`}>
    <div  className='single-event-data-wrapper'>
      <p className='text-xs session-timing-hms'>{convertTimeToUtcZone(time)[2]}</p>
      <div className='event-connector-dots-wrapper'>
        <div className='event-connector-dot'>

        </div>
       {!lastEvent&& <div className='event-connector-line'>

        </div>}
      </div>
      <p className='text-sm session-title-heading'>{title}</p>
    </div>
    <div className='event-chevron-right'>
            <img src={chevronBlack} alt="Chevron Right " />
    </div>
    <div className='event-chevron-right-active'>
            <img src={chevronWhite} alt="Chevron Left" />
    </div>
    </div>:  <div  onClick={()=>setShowChildren(!showChildrens)} className='accordian-event-data-wrapper'>
    <p   className='text-xs location-accordian-time-text'>{convertTimeToUtcZone(time)[2]}</p>
    <div className='accordian-event-data-wrapper-child-2'>
      <div className='dots-accordian-wrapper'>
        <p className='event-accordian-connector-dot'></p>
        {!lastEvent&&<p  style={{height:heightLine}} className={showChildrens?'event-accordian-connector-line':"event-accordian-connector-line-close"}></p>}
      </div>
     <div className='accordian-data-location-items-wrapper-parent' >
      <div className='accordian-data-location-items-wrapper' >
        <p  className='text-sm heading-location-title'>{title}</p>
        <div className={!showChildrens?'chevron-icon-accordian-wrapper':"chevron-icon-accordian-wrapper-close"}>
          <img src={chevronDown} alt="" />
        </div>
      </div>
          
     </div>
    </div>

    </div>}
  {showChildrens&&<div className='location-specific-wrapper-accordion'>
  <div className='dots-accordian-wrapper'>
      
        {!lastEvent&&<p className={showChildrens?'event-accordian-connector-line':"event-accordian-connector-line-close"}></p>}
      </div>
         <div >
         {data.map((el:any)=><EventProperty withLine={true} title={el.title} value={el.value}/>)}
         </div>

          </div>}
    </>
  )
}

export default SingleEventData
