// @ts-nocheck
import React from 'react'
import "./index.sass"
import chevronUpImage from "../../assets/images/chevron-up.svg"
import { useAppSelector , useAppDispatch } from '../../app/hooks'
import ConfigurationAccordion from '../ConfigurationAccordion'
import { setVariantDescription, setVariantName } from '../../features/templates/template-slice'
import {useState , useEffect } from "react"
import {Badge} from '@attrybtech/attryb-ui'
import AllTriggersBody from '../../pages/TriggerPage/AllTriggers/AllTriggersBody'
import { FREQUENCY_OPTIONS } from '../../utils/constants'
type Props = {
  allSelectedTrigger: object[][],
  pagesData : object[],
  isPageSelected : object,
  triggersData: any
}

const ReviwePage = ({allSelectedTrigger, pagesData, isPageSelected, triggersData}:Props) => {
  const [allPagesArray, setallPagesArray] = useState([])

  const [placeholderState, setPlaceholderState] = useState(true)
  const {variantObject , variantName , frequencyCount ,allPages, frequencySession ,frequencyObjectType, selectedPagesObject,variantDescription, impressionsType , maxImpressionsType }=useAppSelector((store:any)=>store.templateConfigs)

  const dispatch = useAppDispatch()
  function handleChangeName(event) {
    setPlaceholderState(false)
    dispatch(setVariantName(event.target.value))
    setPlaceholderState(true)
  }
  function handleChangeDescription(event){
    dispatch(setVariantDescription(event.target.value))
  }
  useEffect(() => {
    const filteredArray = allPages.filter((page: Page) => selectedPagesObject[page._id])
    setallPagesArray(filteredArray)
  }, [selectedPagesObject , allPages])
  
  const ReviewBody = (allPagesArray:object[], triggersData:any) => {
  return (
    <div className='review-body--data'>
      <div className="segment-input-field">
        <div className="segment-name-container">
          <p className="text-lg--md">Name</p>
          <input type="text" className={`text-sm ${ variantName.trim() === '' ? 'warning-variant-name-input' : '' }`} placeholder={`${placeholderState ? 'Enter Variant Name' : '' }`} value={variantName} onChange={(e) => handleChangeName(e)} />
        </div>
        <div className="segment-description-container">
          <p className="text-lg--md">Description</p>
          <input type="text" className="text-sm" placeholder='Enter Variant Description' value={variantDescription} onChange={(e) => handleChangeDescription(e)} />
        </div>
      </div>
      <div className="review-info-container">
        <div className="triggers-info--data">
          <div className="triggers-info-usecase">
            <h1 className="text-xl--md usecase-heading">Use Case</h1>
            <h2 className="text-md usecase-subheading">{variantObject?.useCaseId?.meta.header}</h2>
          </div>
          <div className="triggers-info-segment">
            <h1 className="text-xl--md segment-heading">Segment</h1>
            <h2 className="text-md segment-subheading">{variantObject?.segmentId?.meta?.header}</h2>
          </div>
          <div className="triggers-info-pages">
            <h1 className="text-xl--md pages-heading">Pages</h1>
            <div className="variant-tags">
              {allPagesArray.length!=0 ? allPagesArray?.map((el:any)=>(
                <Badge labelText={el.name} variant={
                  el.name=="HomePage"? "purple" : 
                  el.name=="Product Page"?  "indigo": 
                  el.name=="Category Page"? "pink": 
                  el.name=="Cart Page"? "orange":
                  el.name=="Blog Page"? "orange": "gray"
                } />
              )): "None"}
              </div>
                </div>
                <div className="triggers-info-frequency">
                  <h1 className="text-xl--md frequency-heading">Frequency Capping </h1>
                  <h2 className="text-md frequency-subheading">{`Per Session: ${impressionsType?.value === 'Not Limited' ? 'Not Limited' : frequencySession }`}</h2> 
                  <h2 className="text-md frequency-subheading">{`Per Visitor: ${maxImpressionsType?.value === 'Not Limited' ? 'Not Limited' : frequencyCount }`}</h2>           
                </div>
              </div>
      </div>
      <div className="review-triggers-container">
        <p className="text-lg--md">Triggers</p>
        <AllTriggersBody readOnlyMode={true}  triggersData={triggersData}  />
      </div>
  </div>
  )
}
  
  return (
    <div className='review-page-container'>
      <ConfigurationAccordion heading="Review" subHeading="Review your Campaign" children={ReviewBody(allPagesArray, triggersData)} defaultOpen={true} />
    </div>
  )
}

export default ReviwePage