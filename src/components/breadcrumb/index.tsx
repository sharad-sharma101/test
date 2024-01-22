import React from 'react'
import "./index.sass"

type Props = {
  input: string 
  isSelected : boolean
}

const Breadcrumb = ({input , isSelected}: Props) => {
  return (
    <div className={`breadcrumbs-button_wrapper ${ isSelected ? 'selected-breadcrumb-btn' : 'unselected-breadcrumb-btn' } text-sm--sb`}>
        <p>{input}</p>
    </div>
  )
}

export default Breadcrumb
