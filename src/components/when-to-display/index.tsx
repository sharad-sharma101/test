import React, { useState , useEffect} from "react";
import "./index.sass";
import NumberInputComponent from "../number-input";
import ConfigurationAccordion from "../ConfigurationAccordion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setDelay , setDisplayType} from "../../features/templates/template-slice";

const WhenToDisplay = () => {
  const dispatch = useAppDispatch();
  function handleDelayInput (num: number) {
    dispatch(setDelay(num*1000))
  }
  function handleDisplayType (str: boolean) {
    dispatch(setDisplayType(str))
  }
  return (
    <div className="display-page-container">
      <ConfigurationAccordion
        heading="When to Display?"
        subHeading="Choose whether to display the Use Case immediately or after some delay"
        children={displayCheck( handleDelayInput , handleDisplayType)}
        defaultOpen={true}
      />
    </div>
  );
};
   
export default WhenToDisplay;

const displayCheck = (handleDelayInput:any , handleDisplayType:any) => {
  const {delay , displayType}=useAppSelector((store:any)=>store.templateConfigs)
  const handleClick = (val:any) => {
    handleDisplayType(val)
  };
  
  return (
      <div className="display-body--data">
        <div className="display-data-wrapper">
          <div className={displayType ? "input-container-first" : "input-container-first container-active" } onClick={() => handleClick(false)}>
          <div className="display-input-content">
            <div className="radio-input-wrapper">
              <input
                className="radio-input-circle"
                checked={!displayType}
                type="radio"
                name="display-check"
                value=""
              />
            </div>
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Immediately after all conditions are met</h2>
            </div>
          </div>
        </div>
        <div className={displayType ? "input-container-second container-active" : "input-container-second"} onClick={() => handleClick(true)}>
          
          <div className="input-first">
            <div className="radio-input-wrapper">
              <input
                className="radio-input-circle"
                checked={displayType}
                type="radio"
                name="display-check"
                value=""
              />
            </div>
          </div>
          <div className="input-second">
            <NumberInputComponent handleChangeNumber={handleDelayInput} numberValue={delay ? (delay/1000) : 1}/>
          </div>
          <div className="input-third">
            <h2 className="text-md radio-input-heading">seconds after all the Trigger conditions are met </h2>
          </div>
          
        </div>
      </div>
    </div>
  );
};
