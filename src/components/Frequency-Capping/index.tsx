import React, { useState, useEffect } from "react";
import "./index.sass";
import NumberInputComponent from "../number-input";
import ConfigurationAccordion from "../ConfigurationAccordion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setFrequencyCount , setFrequencySession, setFrequencyObjectType , setMaxImpressionsType , setImpressionsType } from "../../features/templates/template-slice";
import { FREQUENCY_OPTIONS } from "../../utils/constants";
import FrequencyDropDown from "./Frequency-Limit";


const FrequencyCapping = () => {
  const dispatch = useAppDispatch()
  function handleChangeTimes(num: number) {
    dispatch(setFrequencyCount(num))
  }
  function handleChangeSeesion(num: number) {
    dispatch(setFrequencySession(num))
  }
  function handleChangeObjectType(str: string) {
    dispatch(setFrequencyObjectType(str))
  }
  function handleImpressionsType(obj: Object) {
    dispatch(setImpressionsType(obj))
  }
  function handleMaxImpressionsType(obj: Object) {
    dispatch(setMaxImpressionsType(obj))
  }
  return (
    <div className="frequency-page-container">
      <ConfigurationAccordion
        heading="Frequency Capping"
        subHeading="Limit the number of interactions per user and time frame"
        children={FrequencyCappingBody(handleChangeTimes ,handleChangeSeesion, handleChangeObjectType , handleImpressionsType , handleMaxImpressionsType )}
        defaultOpen={true}
      />
    </div>
  );
};

export default FrequencyCapping;

const FrequencyCappingBody = (handleChangeTimes:any, handleChangeSession:any, handleChangeObjectType:any , handleImpressionsType:any , handleMaxImpressionsType:any) => {
  const {frequencyCount , frequencySession , maxImpressionsType , impressionsType }=useAppSelector((store:any)=>store.templateConfigs)

  useEffect(()=>{
    if(maxImpressionsType?.value==="Not Limited" && impressionsType?.value==="Not Limited"){
      handleChangeObjectType(FREQUENCY_OPTIONS.none)
    } else {
      handleChangeObjectType(FREQUENCY_OPTIONS.frequencyCount)
    }
  },[maxImpressionsType , impressionsType])

  return ( 
      <div className="frequency-body--data">
        <div className="frequency-data-wrapper">
          <div className={"input-container-first container-active"}>
          <div className="frequency-input-content">
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Frequency is </h2>
            </div>
            <FrequencyDropDown selectedItem={handleImpressionsType} activeRow={ impressionsType} />
            { impressionsType?.value==="Not Limited" ? <></> : (
                <>  
                <div className="radio-input-content">
                  <h2 className="text-md radio-input-heading">to </h2>
                </div>
                <NumberInputComponent handleChangeNumber={handleChangeSession} numberValue={frequencySession}/>
                <div className="radio-input-content">
                  <h2 className="text-md radio-input-heading">per session</h2>
                </div>
                </>
            )}
          </div>
        </div>
        <div className={"input-container-first container-active"} >
        <div className="frequency-input-content">
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Maximum display per Visitor is </h2>
            </div>
            <FrequencyDropDown selectedItem={handleMaxImpressionsType} activeRow={maxImpressionsType}/>
            { maxImpressionsType?.value==="Not Limited" ? <></> : (
                <>
                        <div className="radio-input-content">
                        <h2 className="text-md radio-input-heading">to</h2>
                      </div>
                      <NumberInputComponent handleChangeNumber={handleChangeTimes} numberValue={frequencyCount}/>
                      <div className="radio-input-content">
                        <h2 className="text-md radio-input-heading">times</h2>
                      </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
