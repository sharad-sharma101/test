import React from 'react'
import "./index.sass"
import { useNavigate,useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { useSelector } from 'react-redux'


type Props = {
    index: number ,
    stageName: string ,
    instruction: string,
    route:string,
  
}


const ProgressStep = ({index , stageName , instruction,route}: Props) => {

  const {isVariantLoading , variantName , completedStep, displayType , delay , impressionsType , frequencyCount , maxImpressionsType ,frequencySession , coolingperiod , overlapType}=useSelector((store:any)=>store.templateConfigs)
  

 const location=useLocation()
  const nav=useNavigate()

  function handleStepStage () {
    // if(completedStep.step==4&&index==4)return 'completely'
    if(isVariantLoading) {
      return ""
    }
    if(completedStep.step == index) {
      return "uncompletely"
    } else if(completedStep.step >= index ) {
      return "completely"
    } else {
      return ""
    }
  }

  const handleNavigate=(selectedRoute:string)=>{
    if((displayType && delay<=0) || (impressionsType.value==='Limited' && frequencyCount <= 0) || ( maxImpressionsType.value==='Limited' && frequencySession <= 0) || (overlapType === 'QUEUE' && coolingperiod <= 0)){
      return;
   }
        if(completedStep.step>=index && variantName.trim().length > 0){
        nav(selectedRoute)
      }
  }
  const handleCurrentTabActiveColor=(r:string)=>{
    let path=location.pathname.split("/").pop()
    if(isVariantLoading)return ""

    if(path===r){
      return "current-tab-active-color"
    }
    else if(completedStep.step == index||isVariantLoading) {
      return "uncompletely"
    } else if(completedStep.step > index ) {
      return "completely"
    } else {
      return ""
    }
  }
  return (
   <>
 <div onClick={()=>handleNavigate(route)} className={`progress-step--wrapper ${handleStepStage()} `}>
        <h1 className={`progress-stage ${handleCurrentTabActiveColor(route)}  text-lg--md`} >
            {stageName}
        </h1>
        <h2  className={`progress-step-instruction ${handleCurrentTabActiveColor(route)}  text-sm`} >
        {instruction}
        </h2>
        {/* <div className='uncompleted-half-div'></div> */}
      
    </div>
   </>
  )
}

export default ProgressStep
