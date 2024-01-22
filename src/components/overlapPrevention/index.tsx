import React, { useState, useEffect } from "react";
import "./index.sass";
import NumberInputComponent from "../number-input";
import ConfigurationAccordion from "../ConfigurationAccordion";
import InstructionPopup from "./instruction-popup";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setOverlapType,setCoolingPeriod } from "../../features/templates/template-slice";
import { OVERLAP_VARIABLE } from "../../utils/constants";

const OverlapPrevention = () => {
  const dispatch = useAppDispatch()
  const [openModal, setopenModal] = useState(false);
  function handleOverpalType(str: string) {
    dispatch(setOverlapType(str))
  }
  function handleCoolingPeriod(num: number) {
    dispatch(setCoolingPeriod(num))
  }
  function handleModal() {
    setopenModal(true)
  }
  function closeModal () {
    setopenModal(false)
  }
  return (
    <div className="overlap-page-container">
      <ConfigurationAccordion
        heading="Overlap Prevention"
        subHeading="What to do If another Use Case of the same type is already on the screen or has been displayed recently"
        children={OverlapPreventionComponent(handleOverpalType,handleCoolingPeriod)}
        instruction="How it works?"
        defaultOpen={true}
        handleInstruction={handleModal}
      />
      { openModal && <InstructionPopup handleCross={closeModal} /> }
    </div>
  );
};

export default OverlapPrevention;

const OverlapPreventionComponent = (handleOverpalType:any , handleCoolingPeriod:any) => {
  const {coolingperiod,overlapType}=useAppSelector((store:any)=>store.templateConfigs)
  
  return (
      <div className="overlap-body--data">
        <div className="overlap-data-wrapper">
          
        <div className={overlapType === OVERLAP_VARIABLE.queue ? "input-container-second container-active" : "input-container-second"} onClick={() => handleOverpalType(OVERLAP_VARIABLE.queue)}>
          <div className="input-first">
            <div className="radio-input-wrapper">
              <input
                className="radio-input-circle"
                checked={overlapType === OVERLAP_VARIABLE.queue }
                type="radio"
                name="overlap-check"
                value=""
              />
            </div>
            <h2 className="text-md radio-input-heading">Show in sequence after a Cooldown Period of</h2>
          </div>
          <div className="input-second">
            <NumberInputComponent handleChangeNumber={handleCoolingPeriod} numberValue={coolingperiod}/>
          </div>
          <div className="input-third">
            <h2 className="text-md radio-input-heading">seconds</h2>
          </div>
        </div>
          <div className={overlapType === OVERLAP_VARIABLE.NotInCurrentSession ? "input-container-first container-active" : "input-container-first"} onClick={() => handleOverpalType(OVERLAP_VARIABLE.NotInCurrentSession)}>
          <div className="overlap-input-content">
            <div className="radio-input-wrapper">
              <input
                className="radio-input-circle"
                checked={overlapType === OVERLAP_VARIABLE.NotInCurrentSession}
                type="radio"
                name="overlap-check"
                value=""
              />
            </div>
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Don’t show during current session</h2>
              </div>
          </div>
        </div>
        <div className={overlapType === OVERLAP_VARIABLE.show ? "input-container-first container-active" : "input-container-first"} onClick={() => handleOverpalType(OVERLAP_VARIABLE.show)}>
          <div className="overlap-input-content">
            <div className="radio-input-wrapper">
              <input
                className="radio-input-circle"
                checked={overlapType === OVERLAP_VARIABLE.show}
                type="radio"
                name="overlap-check"
                value=""
              />
            </div>
            <div className="radio-input-content">
              <h2 className="text-md radio-input-heading">Show</h2>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
