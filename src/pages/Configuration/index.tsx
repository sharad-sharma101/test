import ProgressStep from '../../components/progress-step'
import './index.sass'
import variantIcon from "../../assets/template-library/variant.svg"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import cross from "../../assets/template-library/cross.svg"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {ConfigurationCrossPopup} from "./popup/index"
import { progressSteps } from '../../components/editor/constants'
import { EditableContentText, Badge } from '@attrybtech/attryb-ui'
import DOMPurify from "dompurify"
import { useAppSelector , useAppDispatch } from '../../app/hooks'
import crossImage from "/src/assets/configuration-data/x-close.svg"
import { setReduxTemplateSliceEmpty, setVariantName } from '../../features/templates/template-slice'
import { setReduxTriggersSliceEmpty } from '../../features/triggers/triggers-slice';
import { setAlertVisible } from '../../features/globalConfigs/global-slice';

 
type Props = {
  currentIndex: number 
  reference : string | null
  saveConfiguration: any
  lastStep:string,
}

export default function Configuration({currentIndex, reference, saveConfiguration, lastStep } : Props) {
  type Step = {
    stageName: string ,
    stageInstruction: string,
    route:string
  }
  const {variantObject , variantName, validateButtons }=useAppSelector((store:any)=>store.templateConfigs)
  const {isChanged }=useAppSelector((store:any)=>store.globalConfig)
  const {statusTabTitle} = useAppSelector((store:any)=>store.coreFeaturesSlice)
  const [showCrossIconPopup, setshowCrossIconPopup] = useState(false);
  const dispatch = useAppDispatch()

  const handleCrossPopup = () => {
    if(validateButtons){
      dispatch(setAlertVisible({content:"End time should be greater than Start time",theme:"danger",visible:true}))
      return;
    }
    if(!isChanged){
      navigate(`/my-campaigns/${variantObject?.campaignId?._id}?status=${statusTabTitle}`)
      dispatch(setReduxTemplateSliceEmpty())
      dispatch(setReduxTriggersSliceEmpty())
    }else{
      setshowCrossIconPopup((prevState) => !prevState);
    }
  };
  const navigate = useNavigate();

  return (
    <>
    <div className="configuration-section" >
      <div className="configuration-main-head">
        <div className="variant-container">
          <div className="variant-popup-wrapper">
            <div className="variant-image--wrapper">
              <img src={variantIcon} alt="" />
            </div>
          </div>
          <div className="variant-name">

            {/* <p className='text-lg--sb variant-name-header' >{variantObject?.campaignId?.name} /      <EditableContentText
                        formatting="plain"
                        editMode={ECBFirst}
                        allowEmpty={true}
                        onClick={() => {
                            setECBFirst(true)
                        }}
                        onBlur={(event: React.MouseEvent) => {
                            const relatedTarget =
                                event?.relatedTarget as HTMLDivElement
                            if (relatedTarget) relatedTarget.click()
                            setECBFirst(false)
                        }}
                        responseCallback={(res: any) => { dispatch(setVariantName(res?.data[0]));
                         }}>
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(variantName )}}/>

              </EditableContentText> </p> */}
          
    
              {Object.keys(variantObject).length!==0? <p className='text-lg--sb variant-name-header' >{variantObject?.campaignId?.name} / {variantName}</p>:    <Skeleton height={"1.25rem"} width={"12.5rem"}/>}
          
             

            {/* !!! change header to label */}
            {Object.keys(variantObject).length!==0?<p className='text-sm variant-name-describtion' >{variantObject?.useCaseId?.meta?.header} / {variantObject?.segmentId?.meta?.header || variantObject?.customSegmentId?.meta?.header} </p>:    <Skeleton height={"1rem"} width={"20.0625rem"}/>}


          </div>
        </div>

        {/* <div className="saved-unsaved-label">
          <Badge labelText="Unsaved" variant="danger"/>
        </div> */}
      <div onClick={handleCrossPopup} className='popup-cross-wrapper-parent'>
      <div className="popup-cross--wrapper"  >
          <img src={crossImage} alt="" />
        </div>
      </div>
        {showCrossIconPopup && 
        <ConfigurationCrossPopup currentIndex={currentIndex}  reference={reference} saveConfiguration={saveConfiguration}
          close={() => setshowCrossIconPopup(false)}
        />
      }
      </div>
      <div className="progress-configuration">
        {progressSteps.map((element: Step , index: number) => (
          <ProgressStep  route={element.route} stageName={element.stageName} index={index} instruction={element.stageInstruction}  />
        ))}
      </div>
    </div>
    </>
  )
}