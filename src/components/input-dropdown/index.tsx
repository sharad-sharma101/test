import React from 'react'
import { InputField } from '@attrybtech/attryb-ui'
import "./index.sass"

type Props= {
    inputValue: number , 
    unitValue : string,
    callBackFunction: (str:string) => void , 
    placeholderInput: string
}

const TriggerInput = ({inputValue , unitValue , callBackFunction , placeholderInput}: Props) => {
  return (
    <div className='trigger-input--wrapper'>
      <div className="trigger-input--container">
      {/* <InputField
            value={inputValue }
            placeholder={placeholderInput}
            onChange={(event:  React.ChangeEvent<HTMLInputElement>) => callBackFunction(event.target.value)}
        /> */}
        <input type="number" className="text-sm" inputMode='numeric' pattern="[0-9]*" value={inputValue} placeholder={placeholderInput} onChange={(e)=>callBackFunction(e.target.value)} />
        <div className="unitvalue-wrapper">
            <p className='text-sm--md'>{unitValue}</p>
        </div>
      </div>
    </div>
  )
}

export default TriggerInput
