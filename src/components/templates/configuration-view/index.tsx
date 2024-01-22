// @ts-nocheck
import React from 'react'
import "./index.sass"
import Sidebar from '../../sidebar'
import UseCaseCard from '../../use-case-card'

function ConfigurationView() {
  return (
    <div className="configuration-view-section" >
      <Sidebar headerChild={<div></div>} >
        <UseCaseCard showIcon={false} heading="Segment" active={true} />
        <UseCaseCard showIcon={false} heading="Variables" />
        <UseCaseCard showIcon={false} heading="Pages" />
      </Sidebar>
        <div className="configuration-view__container">
        </div>
    </div>  
  )
}

export default ConfigurationView