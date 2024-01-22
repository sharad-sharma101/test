import React, { useState, useEffect } from "react";
import "./index.sass";
import ConfigurationAccordion from "../ConfigurationAccordion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCouponCode, setDiscountPercentage, setDiscountTime } from "../../features/templates/template-slice";
import TriggerInput from "../input-dropdown";


const Discounts = () => {
  const dispatch = useAppDispatch()
  function handleCouponCode (str: string){
    dispatch(setCouponCode(str))
  }
  function handleDiscountPercentage (str: any){
    dispatch(setDiscountPercentage(str))
  }
  function handleDiscountTime (str: any){
    dispatch(setDiscountTime(str))
  }

  return (
    <div className="frequency-page-container">
      <ConfigurationAccordion
        heading="Limited Time Discount Selection"
        subHeading="Select the Discount you want to give"
        children={DiscountConfig(handleCouponCode , handleDiscountPercentage , handleDiscountTime)}
        defaultOpen={true}
      />
    </div>
  );
};

export default Discounts;

const DiscountConfig = (handleCouponCode: any , handleDiscountPercentage: any , handleDiscountTime: any) => {
  const {couponCode, discountPercentage, discountTime  }=useAppSelector((store:any)=>store.templateConfigs)
  function handleCouponCodeChange(e: any){
    handleCouponCode(e.target.value)
  }
  return ( 
      <div className="frequency-body--data">
        <div className="frequency-data-wrapper">
         
        <div className={"input-container-first container-active"} >
          <div className="frequency-input-content discount-code__wrapper">
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Discount Code </h2>
            </div>
            <input type="text" onChange={(e) => handleCouponCodeChange(e) } className={`text-sm coupon-box ${ false ? 'warning-variant-name-input' : '' }`} placeholder={`${false ? 'Enter Variant Name' : '' }`} value={couponCode} />
          </div>
        </div>
        <div className={"input-container-first container-active"} >
          <div className="frequency-input-content">
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Discount Percentage </h2>
            </div>
            <div className="trigger-section__container discount-code__wrappers" >
              <TriggerInput inputValue={discountPercentage} unitValue={'%'} callBackFunction={handleDiscountPercentage} placeholderInput={'Value'} />
            </div>
          </div>
        </div>
        <div className={"input-container-first container-active"}>
          <div className="frequency-input-content">
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Valid For </h2>
            </div>
            <TriggerInput inputValue={discountTime} unitValue={'Minute(s)'} callBackFunction={handleDiscountTime} placeholderInput={'Value'} />
          </div>
        </div>
      </div>
    </div>
  );
};
