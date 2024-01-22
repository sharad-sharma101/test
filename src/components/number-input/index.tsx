// @ts-nocheck
import React,{useEffect, useState} from 'react'
import "./index.sass"
import arrowUp from "../../assets/images/arrow-up.svg"
import arrowDown from "../../assets/images/arrow-down.svg"

type Props ={
  handleChangeNumber: (str:number)=> void ,
  numberValue:number
}

const NumberInputComponent = ({handleChangeNumber, numberValue}:Props) => {

const [number, setNumber] = useState<string | number | readonly string[] | undefined>(numberValue)

    useEffect(()=>{
      handleChangeNumber(number)
    },[number])
  
  return (
    <div className='number-input-container'>
        <input className={`text-sm number-component--input ${numberValue && numberValue > 0 ? '' : 'warning-input'}`} type="number" inputMode="numeric" id="number" onChange={(e)=>setNumber(Number(e.target.value))} value={number} autoComplete="off" />
    </div>
  )
}

export default NumberInputComponent