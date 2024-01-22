import { useEffect, useState } from 'react'
import {
  AlertPopup,
  AlertPopupHeader,
  AlertPopupBody,
  AlertPopupFooter,
  Button,
  useModal,
} from "@attrybtech/attryb-ui"
import bg from "../../assets/images/pricing-popup-background.svg"
import {Switch} from '@attrybtech/attryb-ui';
import PricingCard from './pricing-card';
import AppPopup from '../app-popup';
import "./pricing.sass"
import xCrossDefault from "../../assets/images/x-close.svg"
import xCrossHover from "../../assets/images/x-cross-white.svg"
import PricingPopupBackground from "../../assets/images/pricing-popup-background.svg"


export default function Pricing({ handleBuyClick, handleBackAction, annualPlans=[], monthlyPlans=[], productId, monthlyPlanPrices }: any) {

  const { modalState, modalRef, exitModal, showModal } = useModal()
  // const { containerId, accountId, variantId, templateId } = useParams();
   const [openModal, setOpenModal] = useState(true)
   const [togglePeriod, setTogglePeriod] = useState<boolean>(false)

  const modalCancelHandler: () => void = () => {
    exitModal()
  }
  function check () {
    handleBackAction()
  }
  const handlePeriodToggle = () =>  setTogglePeriod(!togglePeriod)
  
  const PopupHeader = () => {
    return (
      <div className='pricing-popup--header'>
        <div className="cross-image--wrapper" onClick={() => check()}>
          <div className="default-image">
            <img src={xCrossDefault} className="cross-default" alt="" />
          </div>
          <div className="hover-image">
            <img src={xCrossHover} className='cross-hover' alt="" />
          </div>
        </div>
        <div className="header-heading--container">
          <div className="heading-badge-wrapper">
            <p className='text-sm'>Pricing Plans</p>
          </div>
          <div className="pricing-heading-wrapper">
            <h1 className='display-lg--sb' >Pricing for all sizes</h1>
          </div>
          <div className="supporting-text-wrapper">
            <h2 className='text-xl' >Simple, transparent pricing that grows with you. Try any plan for free for the first 7 days.</h2>
          </div>
        </div>
        <div className="toggle-pricing-period">
          <div className="toggle--wrapper">
            <p className='text-md' >Monthly</p>
            <Switch value={togglePeriod} onClick={() => handlePeriodToggle()} ></Switch>
            <p className='text-md' >Annually</p>
          </div>
        </div>
      </div>
    )
  }
  const PopupBody = () => {
    return (
      <div className="pricing-cards--wrapper">
        { togglePeriod ?
          annualPlans.map((plan : Plan , index:number) => (
             <PricingCard key={plan.planId} plan={plan} handleBuyClick={handleBuyClick} productId={productId} index={index} discountedPrice={monthlyPlanPrices} /> 
           ))
           : 
           monthlyPlans.map((plan : Plan , index:number) => (
            <PricingCard key={plan.planId} plan={plan} handleBuyClick={handleBuyClick} productId={productId} index={index} /> 
          ))
        }
      </div>
    )
  }
  const PopupFooter = () => {
    return (
      <></>)
  }

  return (
    <div className="pricing-plans-popup--wrapper">
      <AppPopup header={<PopupHeader/>} body={<PopupBody/>} footer={<PopupFooter/>} openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  )
}
