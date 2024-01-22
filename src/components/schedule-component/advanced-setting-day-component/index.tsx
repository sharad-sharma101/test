import React, { useState } from 'react'
import "./index.sass"

type Props = {
  text:string
}
const SingleDayComponent = ({text}:Props) => {
    const [selected, setSelected] = useState(true)
    const handleClick =()=> {
        setSelected(!selected)
    }
  return (
    <div className={selected ? "text-lg--b single-day-container day-selected":"text-lg--b single-day-container day-not-selected"} onClick={handleClick}>{text}</div>
  )
}

export default SingleDayComponent