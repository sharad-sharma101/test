//@ts-nocheck
import { Button, Input, List, ListItem } from '@attrybtech/attryb-ui'
import React,{useState,useEffect} from 'react'
import plusButtonIcon from "../../assets/audience-images/filter-add-icon.svg"
import { capitalizeFirstLetterText } from '../../utils/helpers'
import { FiltersDropDown, Operator_DropDown, PROPERTY_DROPDOWN, Value_Dropdown } from '../../utils/constants'
import "./index.sass"
import TextInput from '../text-input'
import DatePicker from '../DatePicker'
import { v4 as uuidv4 } from 'uuid';
import trashIcon from "../../assets/configuration-data/trash.svg"
import moment from 'moment'


const AudienceFilters = ({filterLocationData,handleDeleteFilter,singleFilter,sendCurrentFilter,sendFilterValidate}:any) => {

    
    const [propertyValue,setPropertyValue]=useState({})
    const [inputValue,setInputValue]=useState("")
    const [defaultDate,setDefaultDate]=useState("")
    const [fourthDropDown,setFourthDropDown]=useState({})
    const [secondDropwDown,setSecondDropDownValue]=useState({})
    const [thirdDropDownValue,setThirdDropDownValue]=useState({})
   
    let dummyFilterData=FiltersDropDown
    useEffect(() => {
        getLocationData()
      }, [])

      useEffect(()=>{
        let finalObj={}
        for(let key in propertyValue){
            if(propertyValue[key]!=="none"){
                finalObj["input"]=true
            }
    
            if(key.includes("dropDown")){

                finalObj[`${propertyValue[key].variant}`]=true
            }
        }

          
      
      },[propertyValue])

      const getLocationData=()=>{
      
        //all_cities
        //all_countries
        //all_devices
        //all_os
        for(let el of dummyFilterData){
            if(el.value=="OS"){
            
               let listOfOs=filterLocationData[0]?.all_os.map((el)=>{
                return {
                    _id:uuidv4(),
                    value:el,
                    data:{
                        _id:1,
                        property:el
                    }
                }
               })
               el.dropDown3={
                    type:"multi",
                    placeholder:"Select",
                    variant:"input",
                    data:listOfOs
                }    
            }
             if(el.value=="Device"){
                    let listOfOs=filterLocationData[0]?.all_devices.map((el)=>{
                     return {
                         _id:uuidv4(),
                         value:el,
                         data:{
                             _id:1,
                             property:el
                         }
                     }
                    })
                    el.dropDown3={
                        type:"single",
                        placeholder:"Select",
                        variant:"input",
                         data:listOfOs
                     }    
            }
             if(el.value==="Browser"){
                let listOfOs=filterLocationData[0]?.all_browsers.map((el)=>{
                    return {
                        _id:uuidv4(),
                        value:el,
                        data:{
                            _id:1,
                            property:el
                        }
                    }
                   })
                   el.dropDown3={
                        type:"single",
                        placeholder:"Select",
                        variant:"input",
                        data:listOfOs
                    }    
            }
             if(el.value==="City"){
                let listOfOs=filterLocationData[0]?.all_cities.map((el)=>{
                    return {
                        _id:uuidv4(),
                        value:el,
                        data:{
                            _id:1,
                            property:el
                        }
                    }
                   })
                   el.dropDown3={
                        type:"single",
                        placeholder:"Select",
                        variant:"input",
                        data:listOfOs
                    }    
            }
             if(el.value==="Country"){
                let listOfOs=filterLocationData[0]?.all_countries.map((el)=>{
                    return {
                        _id:uuidv4(),
                        value:el,
                        data:{
                            _id:1,
                            property:el
                        }
                    }
                   })
                   el.dropDown3={
                        type:"single",
                        placeholder:"Select",
                        variant:"input",
                        data:listOfOs
                    }    
            } if(el.value==="Order Value"){
                let currencyOfUser;
                for(let el of filterLocationData){
                    if(el.currency){
                        currencyOfUser=el.currency
                        break;
                    }
                }
                let listOfOs=[ 
                    {
                    _id:uuidv4(),
                    value:currencyOfUser||"-",
                    data:{
                        _id:1,
                        property:currencyOfUser||"-"
                    }
                    }
                ]
                
                   el.dropDown4={
                        type:"single",
                        placeholder:"Select",
                        variant:"",
                        data:listOfOs
                    }    
            }
        }
      }
    const handlePropertyCallBack=(e)=>{
        
        setPropertyValue(e)
        setSecondDropDownValue({})
        setThirdDropDownValue({})
        setInputValue("")
    }
    const selectDate =(str:string)=>{
        const momentDate = moment(str, 'MMM DD YYYY');
        const formattedDate = momentDate.format('YYYY-MM-DD');
        setDefaultDate(str)
        setInputValue(formattedDate)
    }

    const addRealData=()=>{

          let data={...singleFilter,type:propertyValue?.type,property:propertyValue?.data?.property,data:[
            {
                operator:(propertyValue.dropDown2?.variant=="operator"?secondDropwDown?.data?.property:"")||(propertyValue.dropDown3?.variant=="operator"?thirdDropDownValue.data?.property:""),
                value:(propertyValue.dropDown2?.variant=="value"?secondDropwDown?.data?.property:"")||(propertyValue.dropDown3?.variant=="value"?thirdDropDownValue.data?.property:""),
                currency:(propertyValue.dropDown4?.variant=="currency"?fourthDropDown?.data?.property:""),
                input:(propertyValue.dropDown2?.variant=="input"?secondDropwDown?.data?.property:"")||(propertyValue.dropDown3?.variant=="input"?thirdDropDownValue.data?.property:""||inputValue),
            }
          ]}
          return data
    }

    useEffect(()=>{
        let finalObj={}
        for(let key in propertyValue){
            if(propertyValue[key]!=="none"){
                finalObj["input"]=true
            }

            if(key.includes("dropDown")){

                finalObj[`${propertyValue[key].variant}`]=true
            }
        }

        let realData=addRealData()
        
        let checkValidation=true
        let dataObj=realData.data[0]
        for(let key in finalObj){
            if(dataObj[key]==""){
                checkValidation=false
            }
        }
    
        sendCurrentFilter(addRealData())
        if(Object.keys(finalObj).length==0){
            sendFilterValidate({_id:singleFilter._id,validated:false})

            return
        }
        sendFilterValidate({_id:singleFilter._id,validated:checkValidation})
    },[propertyValue,secondDropwDown,thirdDropDownValue,inputValue])

    
  return (
<>
   <div className='filters-dropdowns-wrappers'>
   <div className='trigger-section__container'> <div className='trigger-list-wrapper'>   <List
                    list={dummyFilterData}
                    activeItem={propertyValue}
                    isListVisible={true}
                    buttonPlaceholder={"Select"}
                    searchProps={[]}
                    selectCallback={(e)=>handlePropertyCallBack(e)}
                    variant={false}
                    isListVisible={true}>
                    {dummyFilterData.map((item:any) => {
                        return (
                            <ListItem key={item._id} data={item}>
                                
                                    <p>{item.value}</p>
                            </ListItem>
                        )
                    })}
                </List>
                </div></div>
                {/* <p className='text--md-sb'>IS</p> */}
                {propertyValue?.dropDown2?.data&&<div className='trigger-section__container'> <div className='trigger-list-wrapper'>  <List
                    list={propertyValue?.dropDown2.data}
                    activeItem={secondDropwDown}
                    buttonPlaceholder={propertyValue?.dropDown2?.placeholder}
                    searchProps={[]}
                    selectCallback={(e)=>setSecondDropDownValue(e)}
                    variant={false}>
                    {propertyValue?.dropDown2?.data?.map((item:any) => {
                        return (
                            <ListItem key={item._id} data={item}>
                                
                                    <p>{item.value}</p>
                            </ListItem>
                        )
                    })}
                </List> </div> </div>  }
                {/* <h1>THird DropDown</h1> */}
                {propertyValue?.dropDown3?.data&&   <div className='trigger-section__container'> <div className='trigger-list-wrapper'>   <List
                    list={propertyValue?.dropDown3?.data}
                    activeItem={thirdDropDownValue}
                    buttonPlaceholder={propertyValue?.dropDown3?.placeholder}
                    searchProps={[]}
                    selectCallback={(e)=>setThirdDropDownValue(e)}
                    variant={false}>
                    {propertyValue?.dropDown3?.data?.map((item:any) => {
                        return (
                            <ListItem key={item._id} data={item}>
                                
                                    <p>{item.value}</p>
                            </ListItem>
                        )
                    })}
                </List></div></div>}
                {/* <h1>Fourth DropDown</h1> */}
                {propertyValue?.dropDown4?.data&&<div style={{pointerEvents:'none'}} className='trigger-section__container'> <div className='trigger-list-wrapper'>
                    <List
                
                    list={propertyValue?.dropDown4?.data}
                    activeItem={propertyValue?.dropDown4?.data[0]}
                    buttonPlaceholder={propertyValue?.dropDown4?.placeholder}
                    searchProps={[]}
                    selectCallback={(e)=>setFourthDropDown(e)}
                    variant={false}>
                    {propertyValue?.dropDown4?.data?.map((item:any) => {
                        return (
                            <ListItem key={item._id} data={item}>
                                
                                    <p>{item.value}</p>
                            </ListItem>
                        )
                    })}
                </List></div></div>}
                
                {propertyValue?.input=="integer"&&<div className='text-number-filter-input'><TextInput
            placeholder="Enter Number"
            value={inputValue}
            onChange={(e:any) => setInputValue(e.target.value)} />
            </div>}
              {propertyValue?.input=="dateInput"&&
                <DatePicker handleChangeEvent={selectDate} defaultDate={defaultDate} addMinDate={false}/>
               }
                <div  className="delete-icon-filter trash-trigger--wrapper" onClick={()=>handleDeleteFilter(singleFilter)}>
                    <img src={trashIcon} alt="" />
               </div>
               
               
   </div>

   

   </>
  )
}

export default AudienceFilters
