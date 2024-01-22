import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.sass";
import CheckIcon from "../../assets/images/check-icon.svg";

import { useEffect } from "react";
import { Button } from "@attrybtech/attryb-ui";

type Props = {
  imageScrActive: string;
  imageScrInactive: string;
  title: string;
  description: string;
  onclickFunction: () => void;
  buttonTitle: string;
  completedStep: boolean;
  activeState: boolean;
  isLoading?:boolean,
  loadingState?:boolean
};

const HorizontalInfoCard = ({
  imageScrActive,
  imageScrInactive,
  title,
  description,
  onclickFunction,
  buttonTitle,
  completedStep,
  activeState,
  isLoading,
  loadingState,
}: Props) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(completedStep);

  const handleNextStepClick = () => {
    onclickFunction();
    setIsCompleted(true);
  };

  return (
    <div
      className={`${
        activeState ? "" : "inactive--onboarding-card"
      } card-of-step-onboarding`}
    >
      <div className="card-of-step-right-div">
        <div className="icon-of-step-wrapper">
          { isLoading ? <Skeleton width = {"3rem"} height={"3rem"} containerClassName="icon-of-step-wrapper" borderRadius={"8px"}/> : <img src={activeState ? imageScrActive : imageScrInactive} alt="" />}
        </div>
        <div className="step-body-instruction-wrapper">
          <p className="step-body-instruction-title text-md--sb active-step-title">
          {isLoading ? <Skeleton width = {"10.2317rem"} height = {"1.218rem"} containerClassName="step-body-instruction-title active-step-title" baseColor="#ebebeb"/> : <>{title} </>}
          </p>
          <p className="step-body-instruction-description text-sm active-step-description">
          {isLoading ? <Skeleton width = {"21.0387rem"} height= {".8123rem"} containerClassName="step-body-instruction-description active-step-description" /> :  <>{description}</>}
          </p>
        </div>
      </div>
      <div className="btn-for-instruction-wrapper">
     { isLoading ?  <Skeleton width={"10rem"} height={"1.9398rem"} containerClassName = "btn-for-instruction-wrapper"/> :  <>
        {completedStep ? (
          <div className="check-icon__wrapper">
            <img src={CheckIcon} alt="" />
          </div>
        ) : (
          <Button variant="outline" state={loadingState?"loading":''} style={{width:"10rem", textAlign:"center",justifyContent:"center"}} onClick={handleNextStepClick}>
{buttonTitle}
          </Button>
         
        )}
      </>  }
      </div>
    </div>
  );
};

export default HorizontalInfoCard;
