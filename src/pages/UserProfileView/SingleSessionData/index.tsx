import React, { useEffect, useRef, useState } from 'react'
import SingleEventData from '../../../components/SingleEventData'
import chevronDown from "/src/assets/event-screen/chevron-down.svg"
import hourGlass from "/src/assets/event-screen/hourglass.svg"

import "./index.sass"
import { convertTimeToUtcZone, getTimeInMinutes } from '../../../utils/helpers'

const SingleSessionData = ({lastSession,events,sessionId,duration,Date,currentSelectedEvent,sendCurrentEvent,accordian}:SessionDataProps) => {

    const [showChildrens,setShowChildrens]=useState(true)
    const  gameRef=useRef(null)

    const [height,setHeight]=useState("0px")
    useEffect(()=>{
      
    },[showChildrens,height,events])
    
  return (
    <>
       <div  className='event-time-line-items-wrapper'>
           
           <div className='final-wrapper-event-stream'>
         
           <div style={{display:"flex",flexDirection:"column",alignContent:"center"}}>
               
                 <div className={'dot-connector-event'}></div>
                 {!lastSession&&<div className={'dot-connection-line'}>
                 </div>}
                </div>
           <div style={{display:"flex",flexDirection:"column",width:'100%'}}>
           <div onClick={()=>{if(!accordian)setShowChildrens(!showChildrens)}} className='event-time-line-header-bar'>
                            
                           {!accordian&& <div className='event-session-id-wrapper'>
                               
                                       <div className='time-wrapper-parent'>
                                            <div className='hourglass-image-wrapper'>
                                                <img src={hourGlass} alt="hourglass" />
                                            </div>
                                           <p className='text-sm--md'>{getTimeInMinutes(duration)}</p>
                                        </div>
                
                                        <p className='text-sm--md session-date-text'>{convertTimeToUtcZone(Date)[0][1]+" "+convertTimeToUtcZone(Date)[0][0]+" "+convertTimeToUtcZone(Date)[1]}</p>
                            </div>}
                            <div className='session-header-id-wrapper'>
                                <p className='text-sm--sb'>{accordian?sessionId:"Session Id"}<span className='text-sm--md'>{accordian?"": ` : ${sessionId}`}</span></p>
                                {!accordian&&<div>
                                    <div className={!showChildrens?'chevron-dropdown-event-close':'chevron-dropdown-event'}>
                                                <img src={chevronDown} alt="chevron-down" />
                                    </div> 
                                </div>}
                            </div>
                          </div>
                         {<div ref={gameRef}   className={!lastSession?'all-events-list-wrapper':`all-events-list-wrapper-no-margin`}>
                              {showChildrens&&events&&events.map((el,index)=><><SingleEventData accordian={accordian} onClick={(el:any)=>sendCurrentEvent(el)} event={el} selectedEvent={el?.id===currentSelectedEvent?.id} lastEvent={events.length-1==index} {...el}/></>)}
                          </div>}
                          </div>
           </div>
        </div>
    </>
  )
}

export default SingleSessionData
