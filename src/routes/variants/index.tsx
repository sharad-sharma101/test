// @ts-nocheck
import "./index.css"
import { useState, useEffect , useContext } from 'react'
import { Route, Routes, useParams, useNavigate , useLocation } from "react-router-dom";
import { Button } from "@attrybtech/attryb-ui"
import { CONFIGURATION_TYPES, DELAY_TYPE, FREQUENCY_OPTIONS, variantStatus } from '../../utils/constants'
import configurationService from "../../services/configurations"
import masterService from "../../services/references"
import moment from "moment";
import pagesService from "../../services/pages"
import PagesConfiguration from '../../pages/PagesConfiguration';
import PlacementPage from '../../pages/PlacementPage';
import Configuration from '../../pages/Configuration';
import AllTriggers from '../../pages/TriggerPage/AllTriggers';
import ConfigPage from "../../pages/ConfigPage";
import nextArraw from "../../assets/configuration-data/next-arrow.svg"
import EditUseCaseView from '../../pages/EditUseCaseView';
import AppPopup from "../../components/app-popup/index"
import { AuthContext } from '../../auth/AuthContext';
import { getTemplates , getMasterTemplates ,createTemplate  } from '../../components/editor/api';
import { TEMPLATES_TYPES, progressSteps } from '../../components/editor/constants';
import { createCampaign } from '../../services/campaigns';
import variantService from '../../services/configurations'
import PlacementsPage from "../../pages/Placements";
import SchedulePage from "../../pages/Schedule-page";
import PreviousIcon from "../../assets/configuration-data/arrow-left.svg"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkStatusOfTriggerArray } from "../../utils/helpers";
import { getvariant } from "../../services/variant";
import { updateTemplate } from "../../components/editor/api";
import { useDispatch, useSelector } from "react-redux";
import { setAllPages, setVariantObject,setPagesForTheFlow ,setPlacementDataStore , setCompletedStep, setTemplate, setVariantName, setSelectedPages, setSelectedPostion, setReduxTemplateSliceEmpty, setScheduleStartDate ,setVariantDescription,setIsDraftFalse, setScheduleStartTime, setScheduleEndTime, setScheduleEndDate, setFrequencyObjectType,setDelay, setFrequencyCount, setFrequencySession, setLoaderActive, setTemplateChange, setOverlapType, setCoolingPeriod, setDisplayType , setImpressionsType , setMaxImpressionsType, setCouponObject, setCouponCode, setDiscountPercentage, setDiscountTime } from "../../features/templates/template-slice";
import { handleCloneTrigger, setReduxTriggersSliceEmpty } from "../../features/triggers/triggers-slice";
import DefaultLoading from "../../components/Loader-Components/DefaultLoading";
import { getVariants, putVariants } from "../../services/variants";
import { setAlertVisible, setIsChanges } from "../../features/globalConfigs/global-slice";
import { SaveAsDraftPopup } from "../../pages/Configuration/saveDraftPopup";
import { setCopyofStatesInRedux } from "../../features/verification-configs/changes-slice";

import _ from "lodash"
import PlacementVariable from "../../pages/placementVariable";
import { callCoreFeaturesApiData } from "../../features/core-feature-configs/core-features-slice";
import { OVERLAP_VARIABLE } from "../../utils/constants";
 
const VariantsRoutes = () => {
  const [userConfigurations, setUserConfigurations] = useState([])
  const [configurationList, setConfigurationList] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [triggersData, setTriggersData] = useState({})
  const [placementData, setPlacementData] = useState([])
  const [buttonState, setButtonState] = useState<string>("disabled")
  const [selectedPlacement, setSelectedPlacement] = useState<any>({})
  const [pagesData, setPagesData] = useState<any>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [allSelectedTrigger, setAllSelectedTrigger] = useState([])
  const [saveBtnLoading, setsaveBtnLoading] = useState<boolean>(false)
  const { variantId } = useParams()
  const [isPageSelected, setIsPageSelected] = useState<PagesState>({});
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false)
  const [navigateIndex, setNavigateIndex] = useState(0)
  const location  = useLocation();
  const [mainLoading,setMainLoading]=useState(true)
  const navigate = useNavigate()
  const [selectedTemplate,setSelectedTemplate]=useState<Template>()
  const [templates, setTemplates] = useState<Template[]>([])
  const [userTemplates, setUserTemplates] = useState<Template[]>([])
  const [masterTemplates, setMasterTemplates] = useState<Template[]>([])
  const [historyReference , setHistoryReference]= useState("")
  const {accountId , containerId} : any = useContext(AuthContext) ; 
  const [isTemplateLoading, setTemplateLoading]=useState(true);
  const [isTriggerSelected, setisTriggerSelected] = useState(false)
  const[isLoadingPage, setLoadingPage] =useState(true);
  const authContext: any = useContext(AuthContext);
  const[openAlert, setOpenAlert] =useState(false);
  const [closeSaveDraftPopup,setCloseSaveDraftPopup]=useState(false)
  const {selectedPagesObject,template ,selectedPagesforFlow, isDraftstillThere,placementDataStore,variantObject , completedStep,position , scheduleEndTime , scheduleEndDate , scheduleStartDate , scheduleStartTime , frequencyCount,variantName , frequencySession, allPages , variantDescription, frequencyObjectType,templateChange,delay, overlapType, coolingperiod, displayType , impressionsType , maxImpressionsType, validateButtons, couponCode ,couponObject , discountPercentage , discountTime}=useAppSelector((store)=>store.templateConfigs)

  const {triggerArray , TriggerCheck} =useAppSelector((store) => store.triggersConfig)
  const {isChanged}=useSelector((store)=>store.globalConfig)
  const triggerConfigReal=useSelector((store)=>store.triggersConfig)
  const templateConfigReal=useSelector((store)=>store.templateConfigs)
  const {statusTabTitle} = useAppSelector((store)=>store.coreFeaturesSlice)
  const copyOfGlobalRedux=useSelector((store)=>store.copyGlobalConfig)
  const dispatch=useAppDispatch()
  const params = new URLSearchParams(location.search)
  const [lastStep,setLastStep]=useState(0)
  const ref = params.get("ref")
  const myPath=location.pathname.split("/")
  
  useEffect(()=>{
  const historyRoute = window.location.pathname.split('/').pop();
  setHistoryReference(historyRoute);
  },[])

  function checkLastPageUrl(){
    
    const lastURl  =location.pathname.split("/")
    let page=lastURl[lastURl.length-1]
  
    for(let i=0;i<=progressSteps.length-1;i++){
      
      if(page===progressSteps[i].route){
        setCurrentPageIndex(i)
      }
    }
  }

  useEffect(() => {
   checkLastPageUrl()
  }, [location]) 

  useEffect(() => {
    const myPath=location.pathname.split("/").pop();
    if(myPath !== completedStep.route&&completedStep.route!=""){
      navigate(completedStep.route)
    }
  },[completedStep])

  useEffect(()=>{
    //this cleanup function is used to empty the redux on each and every unmounting phase of configuration popup
    return()=>{
      dispatch(callCoreFeaturesApiData(true))
      dispatch(setReduxTemplateSliceEmpty())
      dispatch(setReduxTriggersSliceEmpty())
    }
  },[])

  const fetchVariant = async () => {
    setMainLoading(true)
    const variant = await variantService.getVariantConfigurations(`${myPath[2]}`)
    dispatch(setVariantObject(variant))

    dispatch(setCompletedStep([variant.progress.completed.step , variant.progress.completed.route]))
  
    let updatedPagesState = pagesData.reduce((element: PagesState, page: Page) => {
      element[page._id] = false;
      return element;
    }, {});
    const selectedPages = variant.pages;
    selectedPages.map((ele:Page) => {
     ( updatedPagesState[ele._id] = true)
    })
    dispatch(setSelectedPages(updatedPagesState))
    if(variant?.configuration?.triggers)
      dispatch(handleCloneTrigger(variant?.configuration?.triggers))

    if(variant?.configuration?.schedule){
       if(variant?.configuration?.schedule?.start_date){
           // const localDate = moment.utc(variant?.configuration?.schedule?.start_date).local().toDate();
            const formattedDate = moment(variant?.configuration?.schedule?.start_date).utc().format('MMM DD YYYYTHH:mm A');
            const [datePart, timePart] = formattedDate.split('T');
            const formattedTime = moment.utc(variant?.configuration?.schedule?.start_date).format('hh:mm A');
            dispatch(setScheduleStartDate(datePart))
            dispatch(setScheduleStartTime(formattedTime))
       }
       if(variant?.configuration?.schedule?.end_date){
            const formattedDate = moment(variant?.configuration?.schedule?.end_date).utc().format('MMM DD YYYYTHH:mm A');
            const [datePart, timePart] = formattedDate.split('T');
            const formattedTime = moment.utc(variant?.configuration?.schedule?.end_date).format('hh:mm A');
            dispatch(setScheduleEndDate(datePart))
            dispatch(setScheduleEndTime(formattedTime))
        }
    }
    if(variant?.configuration?.display) {

      dispatch(setDisplayType(variant?.configuration?.display?.isDelay))
      dispatch(setDelay(variant?.configuration?.display.delay))
    } else {
      dispatch(setDisplayType(false))
      dispatch(setDelay(1000))
    }
    if(variant?.configuration?.overlap) {
      dispatch(setOverlapType(variant?.configuration?.overlap.type))
      dispatch(setCoolingPeriod(variant?.configuration?.overlap.coolingPeriod))
    } else {
      dispatch(setOverlapType(OVERLAP_VARIABLE.show))
      dispatch(setCoolingPeriod(0))
    }
    dispatch(setTemplate(variant?.templateId))
    if(variant?.configuration?.frequency) {
      dispatch(setFrequencyObjectType(variant?.configuration?.frequency?.isEnabled ? FREQUENCY_OPTIONS.frequencyCount : FREQUENCY_OPTIONS.none))
      dispatch(setFrequencySession(variant?.configuration?.frequency?.impressions))
      dispatch(setFrequencyCount(variant?.configuration?.frequency?.maxImpressions ))
      dispatch(setImpressionsType(variant?.configuration?.frequency?.impressionsType))
      dispatch(setMaxImpressionsType(variant?.configuration?.frequency?.maxImpressionsType))
    } else {
      dispatch(setFrequencyCount(0))
      dispatch(setFrequencySession(0))
      dispatch(setFrequencyObjectType(FREQUENCY_OPTIONS.none))
      dispatch(setImpressionsType({_id:2 ,value: "Not Limited"}))
      dispatch(setMaxImpressionsType({_id:2 ,value: "Not Limited"}))
    }
    if(variant?.configuration?.discountObject){
      const discountObj = variant?.configuration?.discountObject
      dispatch(setCouponObject(discountObj?.couponObject))
      dispatch(setCouponCode(discountObj?.couponCode))
      dispatch(setDiscountPercentage(discountObj?.discountPercentage))
      dispatch(setDiscountTime(discountObj?.discountTime))
    }
    dispatch(setVariantName(variant?.name))
    dispatch(setVariantDescription(variant?.description))
    setMainLoading(false)
    return variant
  }
  


  
  useEffect(()=>{
   
    let finalSelectedPages=[]

     for(let el of allPages){
       if(selectedPagesObject[el._id]){
         finalSelectedPages.push(el.page)
       }
     }

   
    dispatch(setPagesForTheFlow(finalSelectedPages))
  
  },[allPages,selectedPagesObject])

  useEffect(() => {
    if (configurationList.length) {
setMainLoading(true)
      const triggers = filterConfigurations(CONFIGURATION_TYPES.trigger)
      const triggerDataArray = triggers.map((trigger: any) => (
        trigger.data[0]
      ))
      const triggersData = {
        type: "triggers",
        data: [...triggerDataArray]
      }
      

      setTriggersData(triggersData)     
      
      const placement = filterConfigurations(CONFIGURATION_TYPES.placement)
      setMainLoading(true)
      setPlacementData(placement)
 
    
      //dispatch(setSelectedPostion(placement[0]?.data[0]))
    
      if(variantObject?.useCaseId?.viewStructure){
    
        let item=placement.filter((el)=>el.viewStructure==variantObject?.useCaseId?.viewStructure)
        if(variantObject?.useCaseId?.viewStructure==="banner"){
          dispatch(setSelectedPostion(item[0]?.data[0]))
        }else if (variantObject?.useCaseId?.viewStructure==="toaster"){
          dispatch(setSelectedPostion(item[0]?.data[6])) 
        }else{
          dispatch(setSelectedPostion(item[0]?.data[4])) 
        }
        dispatch(setPlacementDataStore(item))
      }
      if(variantObject?.configuration?.placement){
        dispatch(setSelectedPostion(variantObject?.configuration?.placement))
      }
      
    }
    setMainLoading(false)
  }, [configurationList , variantObject])

  useEffect(() => {
    const updatedState = checkStatusOfTriggerArray(triggerArray);
    setisTriggerSelected(updatedState)
  }, [triggerArray])
  
  useEffect(() => {
    handleNextButtonState();
  }, [currentPageIndex , template ,isButtonEnabled,selectedPagesforFlow ,isTriggerSelected, template , selectedPagesObject ])
 
  useEffect(()=>{  
    dispatch(setLoaderActive(true))
    async function onMountingFunction() {
      let val=  await fetchVariant()
      await fetchTemplates(val)
      fetchVariantConfiguration()
      dispatch(setLoaderActive(false))
    }
    if(accountId&&containerId){

      onMountingFunction()
    }
  },[accountId,containerId])

  function updateIndexes(index : number){
    setNavigateIndex(index)
    setCurrentPageIndex(index)
  }
  const fetchConfigurationsAndPages = async () => {
    setMainLoading(true);
  
    const fetchConfigurationsPromise = masterService.getConfigurations();
    const fetchPagesPromise = pagesService.getPages();
  
    const [configs, pages] = await Promise.all([fetchConfigurationsPromise, fetchPagesPromise]);
  
    dispatch(setAllPages(pages));
    setMainLoading(false);
    setLoadingPage(false);

    return { configs, pages };
  };

  const fetchVariantConfiguration = async () => {
    const {configs , pages} = await fetchConfigurationsAndPages()

    let configuration: any = { pages: [], triggers: [], placement: {} };

    let mergedPagesData
    if (configuration?.pages) {
      mergedPagesData = pages.map((obj1: any) => {
        const matchingObj = configuration?.pages?.find((obj2: any) => obj2._id === obj1._id);
        return matchingObj ? { ...obj1, matchingObj } : obj1;
      });
    }

    const stateArrayOfPages = mergedPagesData.reduce((element: PagesState, page: Page) => {
      element[page._id] = false;
      return element;
    }, {});
    setIsPageSelected(stateArrayOfPages)
    setSelectedPlacement(configuration.placement)
    setAllSelectedTrigger(configuration.triggers)
    setUserConfigurations(configuration)
    setPagesData(mergedPagesData)
    setConfigurationList(configs)
  }
   
  const fetchTemplates = async (val:any) =>{
    const useCaseRefQuery = `useCaseIdRef=${val?.useCaseId?._id}`

    const tempsPromise = getTemplates(accountId, containerId, useCaseRefQuery);
    const masterTempsPromise = getMasterTemplates(useCaseRefQuery);

    const [temps, masterTemps] = await Promise.all([tempsPromise, masterTempsPromise]);

    setTemplateLoading(false)
    setTemplates([...temps, ...masterTemps])
    setUserTemplates([...temps])
    setMasterTemplates([...masterTemps])
    
  }

  const createNewTemplate = async () =>{ 
    const selectedTemplate = templates.filter((element : Template) => element._id === template._id )
    if(selectedTemplate.length){
    const template = selectedTemplate[0]
    //delete template._id
    let { _id, ...newTemplate } = template; 
    newTemplate.name = `Copy of ${newTemplate.name}`;
    const newTemplateResult = await createTemplate({...newTemplate, accountId })
    dispatch(setTemplate(newTemplateResult))
    return newTemplateResult;
    }
   }

  const filterConfigurations = (configType: string) => {
    return configurationList.filter((config: any) => configType === config.type)
  }

  function giveDraftStatus(lastPage) {
    if(lastPage===variantStatus.finish){
      return false
    } else if(variantObject?.isDraft === false){
      return false
    } else {
      return true
    }
  }

  function giveVariantStatus(lastPage) {
    if(variantObject.status==="active")return false
    else if(lastPage===variantStatus.finish){
      return false
    } else {
      return true
    }
  }

  
  const saveConfiguration = async (lastPage) => {
    let copyTemplateCard = {};
    
    if(variantName.trim() === ''){
      dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
      return;
    }
    if(validateButtons){
      dispatch(setAlertVisible({content:"End time should be greater than Start time",theme:"danger",visible:true}))
      return;
    }
    setMainLoading(true)
    if(templateChange){
      await updateTemplate(template._id , template)
    }
    dispatch(setTemplateChange(false))
    const updatedPageData = pagesData.filter((page: Page) => selectedPagesObject[page._id])
    const ScheduleObject = {
      "start_date": moment.utc(`${scheduleStartDate}T${scheduleStartTime}`, 'MMM DD YYYYTHH:mm A').toDate(),
      "end_date" : moment.utc(`${scheduleEndDate}T${scheduleEndTime}`, 'MMM DD YYYYTHH:mm A').toDate()
    }
  
      let FrequencyObject =  {
        "isEnabled": frequencyObjectType === FREQUENCY_OPTIONS.frequencyCount ,
        "maxImpressions": frequencyCount,
        "impressions":frequencySession,
        "impressionsType": impressionsType,
        "maxImpressionsType": maxImpressionsType,
    }
    const overlapObject = {
      "type": overlapType,
      "coolingPeriod": coolingperiod
    }
    const displayObject = {
      "isDelay": displayType ,
      "delay": delay
    }
    const discountObject = {
      "couponObject": couponObject,
      "couponCode": couponCode,
      "discountTime": discountTime,
      "discountPercentage": discountPercentage
    }
    const updatedBody = {
      configuration: {
        [CONFIGURATION_TYPES.pages]: [...updatedPageData],
        [CONFIGURATION_TYPES.trigger]: [...triggerArray],
        [CONFIGURATION_TYPES.placement]: position,
        [CONFIGURATION_TYPES.schedule]: ScheduleObject,
        [CONFIGURATION_TYPES.frequency]: FrequencyObject ,
        [CONFIGURATION_TYPES.display]: displayObject,
        [CONFIGURATION_TYPES.overlap]: overlapObject,
        [CONFIGURATION_TYPES.discountObject]: discountObject
      },
      pages: [...updatedPageData],
      templateId : template?._id ,
      progress: {
        completed: {
          step: lastPage===variantStatus.finish?5: completedStep.step ,
          route:lastPage===variantStatus.finish?"template": completedStep.route 
        }
      },
      name: variantName,

      description: variantDescription,
      isDraft: giveDraftStatus(lastPage),
      status: giveVariantStatus(lastPage)?"inactive":"active"
    }
    if(template.reference !== TEMPLATES_TYPES.custom){
      copyTemplateCard = await createNewTemplate();
      await fetchTemplates(variantObject);
      updatedBody.templateId = copyTemplateCard?._id ;
    } 
    await configurationService.updateConfiguration(variantId, updatedBody)
    setMainLoading(false)
  }

  const handleSaveAsDraft = async () =>{
    if(variantName.trim().length === 0){
      dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
      return;
    }
    if(variantObject.isDraft===true){
      setCloseSaveDraftPopup(true)
    }else{
      setsaveBtnLoading(true)
      await saveConfiguration()
      setsaveBtnLoading(false)
      dispatch(setAlertVisible({theme:"success",content:"Changes Saved Successfully",visible:true}))
    }
  }
  const handleSaveVariant=async()=>{
   
   try {
    if(variantName.trim() === ''){
      dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
      return;
    }
    if((displayType && delay<=0) || (impressionsType.value==='Limited' && frequencyCount <= 0) || ( maxImpressionsType.value==='Limited' && frequencySession <= 0) || (overlapType === 'QUEUE' && coolingperiod <= 0)){
      dispatch(setAlertVisible({content:"Input Cannot Be Empty or Zero",theme:"danger",visible:true}))
      return;
   }
    setsaveBtnLoading(true)
    await saveConfiguration();
    if(variantName.trim() != ""){
      setOpenAlert(true);

    }
    setsaveBtnLoading(false)
    setCloseSaveDraftPopup(false)
   } catch (error) {
    setsaveBtnLoading(false)
    if(variantObject.isDraft==true){
      dispatch(setAlertVisible({theme:"success",content:"Failed to Save Draft",visible:true}))
    }else{
      dispatch(setAlertVisible({theme:"success",content:"Failed to Save Changes",visible:true}))
    }
   }
  }

 async function handleSelectTemplateID(id: string ,isNavigate ){
  
    let myTemplate=templates.filter((el)=>el._id==id)
      setSelectedTemplateId(id)
      setSelectedTemplate(myTemplate[0])
      if(isNavigate){
       checkLastPageUrl()
        handleNextButton()
      }
  }

 async  function handleNextButton(lastPage) {
  let content;
  if(variantName.trim() === ''){
    dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
    return;
  }
  if((displayType && delay<=0) || (impressionsType.value==='Limited' && frequencyCount <= 0) || ( maxImpressionsType.value==='Limited' && frequencySession <= 0) || (overlapType === 'QUEUE' && coolingperiod <= 0)){
    dispatch(setAlertVisible({content:"Input Cannot Be Empty or Zero",theme:"danger",visible:true}))
    return;
 }
    if(lastPage===variantStatus.finish){
      content="Variant Created Successfully"
      if(variantObject.isDraft===false){
        content="Changes Saved Successfully"
      }
     try {
      setButtonState('Loading')
      await saveConfiguration(lastPage)
      dispatch(setAlertVisible({theme:"success",content,visible:true}))
     } catch (error) {
      dispatch(setAlertVisible({theme:"warning",content:`Failed to Create Variant` ,visible:true}))
     }
   }else{
    if(Number(currentPageIndex)<completedStep.step&&isChanged){
      dispatch(setAlertVisible({theme:"success",content:`Changes Saved Successfully` ,visible:true}))
    }
    if(isChanged){
      saveConfiguration()
    }
   
   }
    
    if(currentPageIndex<4){
      if(completedStep.step<=currentPageIndex){
        dispatch(setCompletedStep([currentPageIndex+1 , progressSteps[currentPageIndex + 1].route]))
      }
      setCurrentPageIndex(currentPageIndex + 1)      
      navigate(progressSteps[currentPageIndex + 1].route)
      
      }else{
        
        navigate(`/my-campaigns/${variantObject?.campaignId?._id}?status=${statusTabTitle}`)
        dispatch(setReduxTemplateSliceEmpty())
        dispatch(setReduxTriggersSliceEmpty())
      }
      
}

  function handlePreviousButton() {
    if(variantName.trim().length === 0){
      dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
      return;
    }
    if((displayType && delay<=0) || (impressionsType.value==='Limited' && frequencyCount <= 0) || ( maxImpressionsType.value==='Limited' && frequencySession <= 0) || (overlapType === 'QUEUE' && coolingperiod <= 0)){
      dispatch(setAlertVisible({content:"Input Cannot Be Empty or Zero",theme:"danger",visible:true}))
      return;
   }
    if (currentPageIndex > 0){
      navigate(progressSteps[currentPageIndex-1].route)
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }
 
  function handleNextButtonState () {
    if (currentPageIndex === 0){
        if(template )  setButtonState("")
        else setButtonState("disabled")
    } else if(currentPageIndex === 1 ) {
        if( selectedPagesforFlow.length!==0 )  setButtonState("")
        else setButtonState("disabled")
    } else if (currentPageIndex === 2) {
        if(isTriggerSelected )  setButtonState("")
        else setButtonState("disabled")
    } else if (currentPageIndex === 3){
       setButtonState("")
    } else{
      setButtonState("")
    }
  }

  function handlePageData(updatedData: any[]) {
    setPagesData(updatedData)
  }

  function handleAnyPageSelected(state: boolean) {
    setIsButtonEnabled(state)
  }
  function handlePagesSelection(updatedState: PagesState) {
    setIsPageSelected(updatedState)
  }

  const handleFinishClick=()=>{
    if(variantName.trim().length < 0){
      dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
      return;
    }

    if((displayType && delay<=0) || (impressionsType.value==='Limited' && frequencyCount <= 0) || ( maxImpressionsType.value==='Limited' && frequencySession <= 0) || (overlapType === 'QUEUE' && coolingperiod <= 0)){
      dispatch(setAlertVisible({content:"Input Cannot Be Empty or Zero",theme:"danger",visible:true}))
      return;
    }
    if(validateButtons){
      dispatch(setAlertVisible({content:"End time should be greater than Start time",theme:"danger",visible:true}))
      return;
    }
    if(currentPageIndex==4 ){
      dispatch(setIsDraftFalse())
      handleNextButton(variantStatus.finish)
    }else{
      handleNextButton()
    }
  }

  useEffect(()=>{
    dispatch(setCopyofStatesInRedux({templateData:templateConfigReal,triggerData:triggerConfigReal}))
  },[mainLoading,allPages,placementDataStore])

  useEffect(()=>{
  let result=!_.isEqual({copyOfTriggerConfig:triggerConfigReal,copyOfTemplateConfig:templateConfigReal},copyOfGlobalRedux)
  dispatch(setIsChanges(result))

  },[myPath , template])

  const getButtonSaveButtonState=()=>{
    if(saveBtnLoading)return 'loading'
    if(isChanged==false)return "disabled"
    return ""
  }

//edit 
  return (
    <div className="configuration-full-page--popup">
     {closeSaveDraftPopup&&<SaveAsDraftPopup saveBtnLoading={saveBtnLoading} saveConfiguration={()=>handleSaveVariant()} close={(e)=>setCloseSaveDraftPopup(e)}/>}
     <Configuration saveBtnLoading={saveBtnLoading} lastStep={lastStep} redirectRoute={(route)=>navigate(route)} currentIndex={lastStep} reference={historyReference} saveConfiguration={saveConfiguration} />
      <div className="configuration-section__container">
        <Routes>
          <Route path="/template" element={<EditUseCaseView  handleSave={handleSelectTemplateID} userTemplates={userTemplates} masterTemplates={masterTemplates} handleSelectTemplateID={handleSelectTemplateID} selectedTemplateId={selectedTemplateId} isLoading={isTemplateLoading} />} />
          <Route path="/pages" element={<PagesConfiguration pagesData={pagesData} handlePageData={handlePageData} isPageSelected={isPageSelected} handleAnyPageSelected={handleAnyPageSelected} handlePagesSelection={handlePagesSelection} isLoading={isLoadingPage} />} />
          <Route path="/loader" element={<DefaultLoading/>} />
          <Route path="/trigger" element={<ConfigPage triggersData={triggersData} setAllSelectedTrigger={setAllSelectedTrigger} allSelectedTrigger={allSelectedTrigger} />} />
          <Route path="/placement" element={<PlacementVariable selectedTemplate={selectedTemplate} />} />
          <Route path="/schedule" element={<SchedulePage allSelectedTrigger={allSelectedTrigger} pagesData={pagesData} isPageSelected={isPageSelected} triggersData={triggersData} />} />
      </Routes>
      </div>
      
     {/* footer section */}
       {<div className="configuration-footer-popup">
          <Button variant={'solid'} colorScheme={'secondary'} size={'lg'} onClick={() => handlePreviousButton()} state={currentPageIndex <= 0 ? 'disabled' : 'enabled'}>
            <div className={currentPageIndex <= 0 ? 'arrow-icon-wrapper arrow-disabled' : 'arrow-icon-wrapper'}>
              <img src={PreviousIcon} alt="" />
            </div>
            Previous
            </Button>
         <div className="left-side-config">

            <Button variant={'solid'} colorScheme={'secondary'} size={'lg'} onClick={handleSaveAsDraft} state={getButtonSaveButtonState()}>
              Save
            </Button>
              <Button  onClick={handleFinishClick} state={buttonState} size={'lg'} >{ currentPageIndex === 4 ? 'Finish' : 'Next' }{currentPageIndex!==4&&<img src={nextArraw} alt="" />}</Button>
          </div>
        </div>}
    
    </div>
  )
}

export default VariantsRoutes
