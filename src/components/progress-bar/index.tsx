import {useState , useEffect} from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.sass"

type Props = {

  stepCompleted: number;
  totalStep: number;
  startingPoint: number;
  heading: String;
  showStep: boolean;
  isLoading?:boolean;
  showOnlyBarLine?:boolean;
};

const ProgressBar = ({stepCompleted , totalStep , startingPoint , heading , showStep, isLoading, showOnlyBarLine=false} : Props) => {
    const perStepBasis = (100 - startingPoint) / totalStep ;
    const [progressBarWidth, setProgressBarWidth] = useState(perStepBasis)
    useEffect(() => {
      setProgressBarWidth((perStepBasis * stepCompleted) + startingPoint);
    }, [stepCompleted])
    
    return (
      <>
{showOnlyBarLine ? <>    <div className="progress-bar-of-steps" >
     {
       <>
        {isLoading ? <Skeleton  /> : <div className="progress-of-steps" style={{width : `${progressBarWidth}%`}} ></div>}
        {!isLoading ? <Skeleton  /> : <div className="remaining-progress-of-steps" style={{width : `${100 - progressBarWidth}%`}} ></div>}
       </> }
    </div></>:       <>
      <div className="header-of-progress_bar--wrapper">
        <div className="heading-of-sub-heading--wrapper">
            <p className='text-lg--sb' > {isLoading ? <Skeleton width={"11.6043rem"} height={"1.4213rem"} /> : <>{heading}</> }</p>
        </div>
        <div className="progress-step-completed--wrapper">
        <p className='text-xs--md'> { isLoading ? <Skeleton width={"4.2658rem"} height={".9135rem"} /> : <>{  showStep ? `${stepCompleted}/${totalStep} Completed ` : '' }</>}</p>
        </div>
    </div>
    <div className="progress-bar-of-steps" >
     {
       <>
        {isLoading ? <Skeleton  /> : <div className="progress-of-steps" style={{width : `${progressBarWidth}%`}} ></div>}
        {!isLoading ? <Skeleton  /> : <div className="remaining-progress-of-steps" style={{width : `${100 - progressBarWidth}%`}} ></div>}
       </> }
    </div>
    </>}
    </>
  )
}

export default ProgressBar
