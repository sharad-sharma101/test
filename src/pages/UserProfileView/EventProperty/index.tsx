
import React from 'react'
import "./index.sass"
const EventProperty:React.FC<EventPropertyProps> = ({title,value,withLine}) => {
  return (
    <>
      <div className={`${withLine?`event-id-text-wrapper-with-line`:`event-id-text-wrapper`}`}>
                <p   className='text-xs--md text'>{title}</p>
                <p className='text-xs text-second'>{value}</p>
            </div>
    </>
  )
}

export default EventProperty
