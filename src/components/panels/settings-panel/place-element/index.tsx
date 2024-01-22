import React,{useState} from 'react'
import {Button} from "@attrybtech/attryb-ui"
import "./index.sass"

interface Props {
  onClick:(status:string)=>void
}

export const PlaceElementButton:React.FC<Props> = ({onClick}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  const handleOnClick = () =>{
    onClick(isPressed ? "UNSUBSCRIBE" : "SUBSCRIBE")
    setIsPressed(!isPressed)
  }

  return (
    <div className="placement-selector-btn" >
        <Button onClick={handleOnClick} variant="subtle"  data-pressed={isPressed} >Place Element</Button>
    </div>
  )
}
