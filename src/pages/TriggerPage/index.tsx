import {useState , useEffect} from 'react'
import Trigger from '../../components/trigger'
import "./index.sass"
import { InputField } from '@attrybtech/attryb-ui'
import { convertToUTC } from '../../utils/helpers'
import rowSide from "../../assets/images/two-lines.svg"
import trashIcon from "../../assets/configuration-data/trash.svg"
import { show } from '@shopify/app-bridge/actions/Share'
import {RemoveTrigger} from "./RemoveTrigger"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { handleUpdateTrigger } from '../../features/triggers/triggers-slice'
import TriggerInput from '../../components/input-dropdown'
import DatePicker from '../../components/DatePicker'
import moment from 'moment'

const TriggerPage = ({triggersData , selectedTrigger,readOnlyMode , index , parentIndex , handleDeleteTrigger} : any) => {
    type SelectedObjectTrigger = {
        _id: string ,
        value: string ,
        data: any
    }
    const [triggerVariable, setTriggerVariable] = useState<any>()
    const [triggerCondition, setTriggerCondition] = useState<any>()
    const [triggerEvent, setTriggerEvent] = useState<string>()
    const [triggerVariableData, setTriggerVariableData] = useState<any>([])
    const [triggerConditionData, setTriggerConditionData] = useState<any>([])
    const [triggerValueData, setTriggerValueData] = useState<any>([])
    const [triggerValue, setTriggerValue] = useState<any>()
    const [valueDataType, setValueDataType] = useState<string>('array')
    const [unitOfInputBox, setunitOfInputBox] = useState('')
    const [InputValue, setInputValue] = useState(selectedTrigger?.data?.expression?.value.max || selectedTrigger?.data?.event?.target.element)
    const [inputTime, setInputTime] = useState<string>(selectedTrigger?.data?.event?.event === "time_of_visit" ? selectedTrigger?.data?.expression?.value?.max.split('T')[1] : '')
    const [inputDate, setInputDate] = useState<string>(selectedTrigger?.data?.event?.event === "time_of_visit" ? selectedTrigger?.data?.expression?.value?.max.split('T')[0] : '')
    const [showRemoveTriggerPopup, setShowRemoveTriggerPopup] = useState(false);
  
    const handleRemoveTrigger = () => {
        setShowRemoveTriggerPopup((prevState) => !prevState);
  };

  function handleChangeInputValue (str: string) {
    setInputValue(str)
  }
  const dispatch=useAppDispatch()
  const {triggerArray , TriggerCheck}=useAppSelector((store)=>store.triggersConfig)
    
    useEffect(() => {
        if(Object.keys(triggersData)?.length) {
        const variableArray = triggersData?.data?.map((element: any) => (
            {
                _id : element.variable.data[0]._id ,
                label: element.variable.label ,
                value : element.variable.data[0].value,
                data : element
            }
        ))
        
        setTriggerVariableData(variableArray)
        }
    }, [triggersData])
    
    useEffect(() => {
    if(triggerVariable ){
       
        setValueDataType(triggerVariable?.data?.data.value?.dataType || 'array');
        setTriggerEvent(triggerVariable?.data?.data.event);   
        
        if(Object.keys(triggerVariable?.data.data?.condition || {}).length) {
            
            const conditionData = triggerVariable?.data.data.condition?.data.map((element: any) => ({
                _id : element._id,
                label: "Operator", 
                value: element.value,
                data: element
            }))
            
            setTriggerConditionData(conditionData)
            
        } else {
            setTriggerConditionData([]);
        }
        if(valueDataType === 'array' && Object.keys(triggerVariable?.data.data?.value || {}).length ) {
            const valueData = triggerVariable?.data.data.value?.data.map((element: any) => ({
                _id : element._id,
                label: "value",
                value: element.value,
                data: element,
            }))
            setTriggerValueData(valueData || []);          
        } else {
            setTriggerValueData([])
        }
    }
    }, [triggerVariable]) 
    
    useEffect(() => {
        if(inputDate && inputTime) {
            const targetValue  = `${inputDate}T${inputTime}`;
            //const UTCformateDate = convertToUTC(targetValue) ;
            setInputValue(targetValue)
        }
    }, [inputTime , InputValue, inputDate])

    useEffect(() => {
        if (triggerVariable) {
          const unitOfValue = triggerVariable.data.data.value?.unit || '';
          setunitOfInputBox(unitOfValue);
        }
      
        let cloneTriggerGroupArray = [...triggerArray[parentIndex]];
        let updatedTrigger = JSON.parse(JSON.stringify(cloneTriggerGroupArray[index]));
      
        updatedTrigger.data.expression.variable = triggerVariable ? triggerVariable.value : selectedTrigger.data.expression.variable;
        updatedTrigger.data.expression.operator = triggerCondition ? triggerCondition.value : selectedTrigger.data.expression.operator;
        updatedTrigger.data.event.event = triggerEvent || '';
      
        if (triggerEvent && (triggerEvent === "click" || triggerEvent === "mouseover")) {
          updatedTrigger.data.event.target.element = InputValue || '';
          updatedTrigger.data.expression.value.max = '';
          updatedTrigger.data.event.target.type = 'id';
          updatedTrigger.data.expression.value.min = '';
        } else {
          updatedTrigger.data.expression.value.max = triggerValue || InputValue;
          updatedTrigger.data.expression.value.min = triggerValue || InputValue || '';
          updatedTrigger.data.event.target.element = '';
          updatedTrigger.data.event.target.type = '';
        }
      
        cloneTriggerGroupArray[index] = updatedTrigger;
      
        dispatch(handleUpdateTrigger([parentIndex, cloneTriggerGroupArray]));
      }, [triggerVariable, triggerCondition, inputTime ,triggerEvent, triggerValue, InputValue]);

      const selectDate =(str:string)=>{
        const momentDate = moment(str);
        const formattedDate = momentDate.format("MMM D YYYY");
        setInputDate(formattedDate)
    }
      
    return (
        <div>
            <div className="configuration-section__triggers-container">

                <div className="right-side-section">

                {/* <div className="trigger-group-icon">
                    <img src={rowSide} alt="" />
                </div>               */}
                <Trigger readOnlyMode={readOnlyMode} trigger={triggerVariableData} setSelectedObject={setTriggerVariable} label={'Parameter'} activeItem={selectedTrigger?.data?.expression?.variable} />
                { triggerVariable && triggerConditionData.length === 0 ?
                   <></> :
                   <Trigger readOnlyMode={readOnlyMode} trigger={triggerConditionData} setSelectedObject={setTriggerCondition} label={'Condition'} activeItem={selectedTrigger?.data?.expression?.operator} />
                }
                        
                {
                    triggerVariable && triggerConditionData.length === 0 ?
                    <></> :
                    (
                        <>
                        {
                            valueDataType === 'array' ?
                                (
                                    <Trigger readOnlyMode={readOnlyMode} trigger={triggerValueData} setSelectedObject={setTriggerValue} label={'Value'} activeItem={selectedTrigger?.data?.expression?.value.max} /> 
                                )   :
                                
                                ( triggerEvent === 'click'  || triggerEvent === 'mouseover' ) ?
                                (
                                    <input type="text" className={`text-sm trigger-input-feild`} placeholder='Element Id' value={InputValue} onChange={(e) => handleChangeInputValue(e.target.value)} />
                                ): 
                                ((triggerEvent === 'time_of_visit') ?
                                    (
                                    <div className="trigger-section__container" >
                                            {/* <input   type="date" onChange={(event) => setInputDate(event.target.value) }/> */}
                                            <DatePicker handleChangeEvent={selectDate} defaultDate={inputDate} addMinDate={false}/>
                                            <input type="time" onChange={(event) => setInputTime(event.target.value)} value={inputTime}/>
                                        </div>
                                    ) :
                                    (<div className="trigger-section__container" >
                                        <TriggerInput inputValue={InputValue} unitValue={unitOfInputBox} callBackFunction={handleChangeInputValue} placeholderInput={'Value'} />
                                    </div>
                                    ) 
                                )
                        }
                     </>
                    )
                }
                    
                </div>
                {/*trash icon delete in review page  */}
               {!readOnlyMode&& index>0 &&<div className="trash-trigger--wrapper" onClick={handleRemoveTrigger }>
               {/* <div className="trash-trigger--wrapper" onClick={() => handleDeleteTrigger(index)} > */}
               {
                index==0 && parentIndex==0 ? 
                    <></> :
                    <img src={trashIcon} alt="" />
               }</div>}
               {showRemoveTriggerPopup && 
        <RemoveTrigger  index={index}  handleDeleteTrigger={handleDeleteTrigger}
          close={() => setShowRemoveTriggerPopup(false)}
        />
      }
            </div>
            
        </div>
    )
}

export default TriggerPage
