import React from 'react'
import "./index.sass"
import ReviwePage from '../../components/review-page'
import ScheduleComponent from '../../components/schedule-component'
const SchedulePage = ({allSelectedTrigger, pagesData, isPageSelected, triggersData}:SchedulePage) => {
  return (
    <div className='schedule-page--wrapper' >
      <div className="schedule-container">
        <div className="schedule-number-container">
            <p className='schedule-number text-xl--b' >1</p>
            <div className="schedule-connection-line"></div>
        </div>
          <ReviwePage allSelectedTrigger={allSelectedTrigger} pagesData={pagesData} isPageSelected={isPageSelected} triggersData={triggersData} />
      </div>
      <div className="schedule-container">
        <div className="schedule-number-container">
            <p className='schedule-number text-xl--b' >2</p>
        </div>
          <ScheduleComponent/>
      </div>
      
    </div>
  )
}

export default SchedulePage
