
import { Button } from "@attrybtech/attryb-ui"
import "./index.sass"
import { CSVLink } from 'react-csv';
import React, {useContext, useEffect, useRef, useState} from "react";
import { getAllAudiences, getAllCustomers, getAllUsers, getAllVisitors } from "../../services/audiences";
import { AuthContext } from "../../auth/AuthContext";
import { AUDIENCE_VARIABLE } from "../../utils/constants";
import tippy from "tippy.js";
import { capitalizeFirstLetterText } from "../../utils/helpers";
import plusButtonIcon from "../../assets/audience-images/filter-purple-plus.svg"
import plusButtonIconWhite from "../../assets/audience-images/plus-icon-white.svg"
import AudienceFilters from "../AudienceFilters";
import { v4 as uuidv4 } from 'uuid';
import { createNewSegmentRule } from "../../services/impressions";
import { useSearchParams } from "react-router-dom";

type Props = {
    activeOption?:any
    setActiveOption: (e: string) => void
    selectAll: boolean
    handleOpenFilters?:(e:boolean)=>void,
    isFilterOpen?:boolean;
    sendFinalFilterData?:(e:any)=>any,
    handleCallApi?:(e:any)=>void,
    filterLocationData:any,
    selectedExportData:any,
    unSelectedIds:any,
    sendSegmentRuleData?:any,
    handleAddNewSegmentRule:()=>void,
    hidetabs?:any
};

const TableFunctionalityBar= ({handleAddNewSegmentRule,sendSegmentRuleData,filterLocationData,handleCallApi,sendFinalFilterData,setActiveOption, activeOption, selectAll,handleOpenFilters,isFilterOpen,selectedExportData,unSelectedIds, hidetabs=false}:Props) => {
	const { containerId, containerData } = useContext<any>(AuthContext);
  const allTooltipRef=useRef(null)
  const usersTooltipRef=useRef(null)
  const customersTooltipRef=useRef(null)
  const visitorsTooltipRef=useRef(null)
  const [totalFilters,setTotalFilters]=useState<any>([])
  const [isAllFilterValidated,setisAllFilterValidated]=useState([])
  const [filterValidated,setFilterValidated]=useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  let openFilterStatus: string | boolean | null = searchParams.get('filters');
  if (openFilterStatus !== null) {
    openFilterStatus = JSON.parse(openFilterStatus);
  }
  useEffect(()=>{
    if(handleCallApi){
      handleClearFilters()
      handleCallApi([])
    }
  },[activeOption])
  const convertDataForSegmentDefination=()=>{

    let finalData=[]
    if(filterValidated){
      for(let el of totalFilters){
          let finalObj={}
           if(el&&el?.data&&el?.data[0]){
            finalObj={
              type:el?.type,
                lookupKey:el?.property,
                expression:{
                  operator:el?.data[0]?.operator===">"?"greater":"smaller"||"equal",
                  constraints:{
                        min:el?.type=="type"?el.data[0]?.value:el?.data[0]?.input,
                        max:el?.type=="type"?el.data[0]?.value:el?.data[0]?.input
                    }
                }
            }
           }
           finalData.push(finalObj)
      }
    }

    if(sendSegmentRuleData) sendSegmentRuleData(finalData)

  }
  useEffect(()=>{

      convertDataForSegmentDefination()
  },[totalFilters])
  useEffect(() => {
    const tooltipData={theme:"my-custom-tooltip-theme",allowHTML:true}
    if (allTooltipRef.current) {
      tippy(allTooltipRef.current, {
        content: '<p class="text-xs--md">Internet users landing on the website</p>',
        ...tooltipData
      });
    }
    if (usersTooltipRef.current) {
      tippy(usersTooltipRef.current, {
        content: '<p class="text-xs--md">Visitors who signed up</p>',
        ...tooltipData
      });
    }
    if (customersTooltipRef.current) {
      tippy(customersTooltipRef.current, {
        content: '<p class="text-xs--md">Visitors who placed at least 1 order</p>',
        ...tooltipData
      });
    }
    if (visitorsTooltipRef.current) {
      tippy(visitorsTooltipRef.current, {
        content: `<p class="text-xs--md">Visitors who didn't signup</p>`,
        ...tooltipData
      });
    }
    if(openFilterStatus==true) handleAddNewFilterInData({_id:uuidv4()})
  }, []);

	const fetchData= async()=>{
		if(containerId){
      let result = []
			if(activeOption == AUDIENCE_VARIABLE.allaudience){
				result = await fetchAudiences()
			}else if(activeOption == AUDIENCE_VARIABLE.visitors){
				result = await fetchVisitors()
			}else if(activeOption == AUDIENCE_VARIABLE.customers){
				result = await fetchCustomers()
			}else if(activeOption == AUDIENCE_VARIABLE.users){
				result = await fetchUsers()
			}
				return result?.data
		}
	}
	const fetchAudiences = async () => {
		try {
			const audiencePromise = await getAllAudiences(containerId);
			return audiencePromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchVisitors = async () => {
		try {
			const visitorsPromise = await getAllVisitors(containerId);
			return visitorsPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchCustomers = async () => {
		try {
			const customersPromise = await getAllCustomers(containerId);
			return customersPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchUsers = async () => {
		try {
			const customersPromise = await getAllUsers(containerId);
			return customersPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	

  const handleAudience =()=>{
    setActiveOption('allaudience')
  }
  const handleVisitors =()=>{
    setActiveOption('visitors')
  }
  const handleCustomers =()=>{
    setActiveOption('customers')
  }
  const handleUsers =()=>{
    setActiveOption('users')
  }
  
  const convertToCsv = (data:[]) => {
    // Map the original column names to the desired ones
    const columnMappings = {
      distinct_id: 'Distinct ID',
      name: 'Name',
      email: 'Email',
      type: 'Type',
      no_of_session: 'Number of Sessions',
      order_count_shopify: 'Number of Orders',
      last_seen: 'Last Seen',
      ip_location_city_name: 'City',
      ip_location_country_name: 'Country',
      total_spend_shopify: 'Total Amount Spent',
      aov_shopify: 'Average Order Value',
      total_products_added: 'Total Products Added',
      avg_no_products_added: 'Average Products Added/Session',
      total_products_viewed: 'Total Products Viewed',
      avg_no_products_viewed: 'Average Products Viewed/Session',
      browser_name: 'Browser',
      device: 'Device',
      os: 'OS',
    };
  
    // Filter out columns to remove
    const columnsToRemove = ['anonymous_ids','currency','ip_location_city_name','ip_location_country_name','cities','country','all_cities','all_countries','all_browsers','all_devices','all_os','id','lastSeen','location_country','sessions'];
  
    // Convert the array of objects to CSV format
      try {
        const header = Object.values(columnMappings).join(',');
        const rows = data.map((obj:Object) =>
          Object.values(obj)
            .filter((value, index) => !columnsToRemove.includes(Object.keys(obj)[index]))
            .join(',')
        );
    
        return `${header}\n${rows.join('\n')}`;
      } catch (error) {
        console.log(error);
        return '';
      }
  };
  
  const downloadCsv = async() => { 
    // Create a temporary link element 
    try { 
      let data = await fetchData(); 
      data = data?.data.filter((item:{user_id:string}) => !unSelectedIds.includes(item.user_id)); 
      const link = document.createElement('a'); 
      link.href = URL.createObjectURL(new Blob([convertToCsv(selectAll ? data : selectedExportData)], { type: 'text/csv' })); 
      link.download = `${containerData?.domainName?.split('.')[0]}_${activeOption=='allaudience' ? 'audiences' : activeOption}.csv`; 
 
      link.click(); 
    } catch (error) { 
      console.log(error) 
    } 
  }; 
  const handleAddNewFilterInData = (newFilter:any) => {
    let total = [...totalFilters];
  
    // Check if the filter with the same _id already exists
    const existingFilterIndex = total.findIndex((el) => el._id === newFilter._id);
  
    if (existingFilterIndex !== -1) {
      // Modify the existing filter
      total[existingFilterIndex] = { ...total[existingFilterIndex], ...newFilter };
    } else {
      // Add a new filter
      total.push(newFilter);
    }
  
    // Update the state with the modified or new filters
    setTotalFilters(total);
    if(sendFinalFilterData){
      sendFinalFilterData(total)
    }
  };

  const handleDeleteFilter=(e:any)=>{
    let finalFilters=totalFilters.filter(((el:any)=>el._id!=e._id))
    const validatedFilters=isAllFilterValidated.filter((el:any)=>el._id!==e._id)
    setisAllFilterValidated(validatedFilters)
    handleValidateFilter({},true,validatedFilters)
    setTotalFilters(finalFilters)
    if(sendFinalFilterData){
      sendFinalFilterData(finalFilters)
    }
    if(handleCallApi){
      handleCallApi(finalFilters)
    }
  }
  const handleClearFilters=()=>{
      setTotalFilters([])
      setisAllFilterValidated([])
      if(sendFinalFilterData){
        sendFinalFilterData([])
      }
      // if(handleOpenFilters){
      //   handleOpenFilters(!isFilterOpen)
        
      // }
      if(handleCallApi){
        handleCallApi([])
      }
  }
 
  const handleValidateFilter=(e:any,onlyCheck:boolean,filters:any)=>{
    
    let total:any = [...isAllFilterValidated];
    // Check if the filter with the same _id already exists
  if(!onlyCheck){

    const existingFilterIndex = total.findIndex((el:any) => el._id === e._id);
  
    if (existingFilterIndex !== -1) {
      // Modify the existing filter
      total[existingFilterIndex] = { ...total[existingFilterIndex], ...e };
    } else {
      // Add a new filter
      total.push(e);
    }
  }else{
    total=filters
  }
    setisAllFilterValidated(total)
    if(total.length==0){
      setFilterValidated(false)
      return
    }
    for(let el of total){
      if(!el.validated){
        setFilterValidated(false)
        return
      }
    }
    setFilterValidated(true)
  }



  return(
    <>
    {/* filter background */}
   {isFilterOpen&&<>
   <div className="filter-wrapper-audience">
   <div className="child-filter-wrapper-item">
    <p className="text-md--sb">{activeOption==="allaudience"?"All Visitors":capitalizeFirstLetterText(activeOption)}</p>
   {totalFilters.map((el:any)=><div key={el._id}> <AudienceFilters 
   sendFilterValidate={handleValidateFilter}
     handleDeleteFilter={handleDeleteFilter} filterLocationData={filterLocationData} sendCurrentFilter={handleAddNewFilterInData} singleFilter={el} activeOption={activeOption} /></div>)}
  <div style={{display:"flex",justifyContent:"space-between"}}> 
        <div className="filter-button-wrapper-item">
        <Button onClick={()=>handleAddNewFilterInData({_id:uuidv4()})} variant="outline">
            <div className="filter-close-img"> 
              <img className="default-plus-img" src={plusButtonIcon}/>
              <img className="on-hover-plus-img" src={plusButtonIconWhite}/>   
            </div>Filters
          </Button>
        </div>
        <div className="filter-save-wrapper">
            <p onClick={()=>handleClearFilters()} className="text-md--sb filter-clear-all-text">Clear all</p>
            <Button state={filterValidated?"":"disabled"} colorScheme="secondary" onClick={()=>{if(handleCallApi){
              handleCallApi(totalFilters)
            }}} >Apply</Button>
            <Button state={filterValidated?"":"disabled"} onClick={handleAddNewSegmentRule} variant="solid" >Save as Segment</Button>
        </div>
  </div>
 </div>

 </div>
       
        </>}
		  <div className="top-functionality--wrapper">
        {!hidetabs ? <div className="left-container--wrapper" >

          <div ref={allTooltipRef}>
          <Button 
            onClick={()=>handleAudience()}
            variant="solid"
          
            state={activeOption === 'allaudience' ? 'clicked' : ''}
            colorScheme="secondary"
            style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderRight: '0px' }}
          >
            Visitors
          </Button>
          </div>

          <div ref={visitorsTooltipRef}>
          <Button
            onClick={handleVisitors}
            variant="solid"
            state={activeOption === 'visitors' ? 'clicked' : ''}
            colorScheme="secondary"
            style={{ borderRadius: '0px', borderRight: '0px' }}
            additionalClassName="anonymous-visitors"
          >
            Anonymous visitors
          </Button>
          </div>
         <div ref={usersTooltipRef}>
         <Button
            onClick={handleUsers}
            variant="solid"
            state={activeOption === 'users' ? 'clicked' : ''}
            colorScheme="secondary"
            style={{ borderRadius: '0px', borderRight: '0px' }}
          >
            Users
          </Button>
         </div>
        <div ref={customersTooltipRef}>  <Button
            onClick={handleCustomers}
            variant="solid"
            state={activeOption === 'customers' ? 'clicked' : ''}
            colorScheme="secondary"
            style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
          >
            Customers
          </Button></div>
        </div> : <div></div>}
        <div className="right-container--wrapper">
        <Button onClick={()=>{
          if(handleOpenFilters){
            handleOpenFilters(!isFilterOpen)
          }
          if(totalFilters.length==0){
            handleAddNewFilterInData({_id:uuidv4()})
          }
          }} variant="solid" colorScheme="secondary"> <img src="/attryb-ui/assets/icons/loader/filter-linesicon.svg" />{isFilterOpen?'Hide Filters':"Show Filters"}</Button>
            <Button onClick={downloadCsv}  variant="solid" colorScheme="secondary" state={selectedExportData.length ? '' : 'disabled'}>Export</Button>
					
        </div>
      </div>
      </>
    )
}

export default TableFunctionalityBar;
