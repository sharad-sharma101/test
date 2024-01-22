//@ts-nocheck
import React from 'react'
import "./index.sass"
import ProfileInfoBox from '../ProfileInfoBox'
import KpiCard from '../kpi-card'
const HeaderWithData = ({title,data}) => {
  return (
    <div className='header-box-with-data-wrapper'>
      <div className='header-box-with-data'>
      <p className='text-md--sb'>{title}</p>
    </div>
    {/* 20 upar 20 neetch right 8 */}
    <div className='header-box-data-information-wrapper'>
      {data.map((el)=><div className='header-info-items-wrapper' key={el._id}><ProfileInfoBox {...el}/></div>)}
    </div>

    </div>
  )
}

export default HeaderWithData
