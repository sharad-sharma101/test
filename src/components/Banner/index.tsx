import React from 'react'
import "./index.sass"
import onboardingIcon from "../../assets/onboarding/featured-icon-outline.svg"
import onboardingCrossIcon from "../../assets/onboarding/x-close-onboarding.svg"
import { Button } from '@attrybtech/attryb-ui'
import { useNavigate } from 'react-router-dom'

const Banner = ({handleCrossBanner}:{handleCrossBanner:()=>void}) => {
    const nav=useNavigate()
  return (
    <div className='banner-info-variant-wrapper'>
        <div>
            
        </div>
        {/* center div */}
        <div className='banner-child-second-wrapper-info'>
            <div className='onboarding-icon-info-variant'>
                <img src={onboardingIcon} alt="" />
            </div>
                <p className='banner-text-variant-info text-sm'>Complete the <span className='highlighted-text-banner-info text-sm--b'>Onboarding</span> steps to see your Campaigns in action</p>
                <Button colorScheme="banner" onClick={()=>nav("/getting-started")} variant="outline">Go to Onboarding</Button>
        </div>
        <div onClick={handleCrossBanner} style={{padding:"var(--padding-8)",cursor:"pointer"}}>
        <div className='onboarding-cross-icon-info-variant'>
                <img src={onboardingCrossIcon} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Banner
