import React from 'react'
import AllTriggers from '../TriggerPage/AllTriggers'
import "./index.sass"
import FrequencyCapping from '../../components/Frequency-Capping'
import WhenToDisplay from '../../components/when-to-display'
import OverlapPrevention from '../../components/overlapPrevention'
import Discounts from '../../components/discounts'

const ConfigPage = ({triggersData, setAllSelectedTrigger, allSelectedTrigger} : any) => {
  
  return (
    <div className='config-page--wrapper' >
      <div className="total-trigger-container">
        <div className="serial-number-container">
            <p className='serial-number text-xl--b' >1</p>
            <div className="connection-line"></div>
        </div>
        <AllTriggers  readOnlyMode={false} triggersData={triggersData} setAllSelectedTrigger={setAllSelectedTrigger} allSelectedTrigger={allSelectedTrigger} />
      </div>
      <div className="all-capping-container">
        <div className="serial-number-container">
            <p className='serial-number text-xl--b' >2</p>
            <div className="connection-line"></div>
        </div>
        <WhenToDisplay/>
      </div>
      <div className="all-capping-container">
        <div className="serial-number-container">
            <p className='serial-number text-xl--b' >3</p>
            <div className="connection-line"></div>
        </div>
        <FrequencyCapping/>
      </div>
      <div className="all-capping-container">
        <div className="serial-number-container">
            <p className='serial-number text-xl--b' >4</p>
            <div className="connection-line"></div>
        </div>
        <OverlapPrevention/>
      </div> 
      <div className="all-capping-container">
        <div className="serial-number-container">
            <p className='serial-number text-xl--b' >5</p>
        </div>
        <Discounts/>
      </div>
    </div>
  )
}

export default ConfigPage
