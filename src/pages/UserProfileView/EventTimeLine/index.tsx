
import React, { useContext, useEffect, useState } from 'react'
import "./index.sass"
import { Table } from '@attrybtech/attryb-ui'
import { Button } from "@attrybtech/attryb-ui"
import SingleSessionData from '../SingleSessionData'
import EventProperty from '../EventProperty'
import { getAllSessionsData, getSingleEventData } from '../../../services/audiences'

import LineLoader from '../../../components/Lineloader/LineLoader'
import { capitalizeFirstLetterText, convertTimeToUtcZone, groupEventsBySession } from '../../../utils/helpers'
import AccordionWrapper from '../../../components/AccordionWrapper'
import { AuthContext } from '../../../auth/AuthContext'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setEventActivityResponseInRedux , setEventList } from '../../../features/core-user-profile-configs/core-user-profile-slice'

const EventTimeLine = () => {
    let pathName=window.location.pathname.split("/")
	  const {eventActivityResponse , eventList}=useAppSelector((store)=>store.coreUserProfileSlice)
    const [sessionData,setSessionData]=useState<any>([])
    const [makeLoaderVisible,setMakeLineLoaderVisible]=useState(false)
    const [currentSelectedEvent,setCurrentSelectedEvent]=useState<any>({})
    const [selectedEvent,setSelectedEvent]=useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [currentEventPage, setCurrentEventPage] = useState(eventActivityResponse?.page || 1)
    const { containerId } = useContext<any>(AuthContext);
    const dispatch=useAppDispatch()

      useEffect(()=>{
        if(containerId){
          getEventData()
        }
      },[currentSelectedEvent, containerId])
    
      useEffect(()=>{
        if(containerId){
          getSessionsData()
        }
      },[window.location.pathname, containerId]) 

  
  
  const fetchMoreSessions=async()=>{
    try {    
        setIsLoading(true)
        let data=await getAllSessionsData(containerId, `/${pathName[3]=='user' ? 'customer' : pathName[3]}/sessions/${pathName[4]}?page=${currentEventPage+1}`)       
        let finalData= groupEventsBySession([...eventList, ...data?.data])
        dispatch(setEventList([...eventList, ...data?.data]));
        setSessionData(finalData)
        setCurrentEventPage(currentEventPage+1)
				dispatch(setEventActivityResponseInRedux({page:currentEventPage ,totalEvent:data?.total_count,sessionsData:finalData}))
        setIsLoading(false)
    } catch (error) {
        console.log(error)
    }
  }

  const getSessionsData=async()=>{
    try {
      
		  if(eventActivityResponse?.sessionsData?.length == 0){
        let data=await getAllSessionsData(containerId, `/${pathName[3]=='user' ? 'customer' : pathName[3]}/sessions/${pathName[4]}?page=${currentEventPage}`)
        let finalData= groupEventsBySession(data?.data)
        dispatch(setEventList(data?.data));
        setSessionData(finalData)
				dispatch(setEventActivityResponseInRedux({totalEvent:data?.total_count,sessionsData:finalData}))
      }else{
        setSessionData(eventActivityResponse?.sessionsData)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getEventData=async()=>{

    if(!currentSelectedEvent.id||selectedEvent.id==currentSelectedEvent.id)return
    setMakeLineLoaderVisible(true)
    try {
        let data=await  getSingleEventData(containerId, `/events/${currentSelectedEvent.id}?endpoint=${currentSelectedEvent.event}`)
        setSelectedEvent(data?.data[0]||{})
      setMakeLineLoaderVisible(false)
    } catch (error) {
        console.log(error)
        setMakeLineLoaderVisible(false)
    }
  }


function isShowMore (){
  if(currentEventPage < Math.ceil(eventActivityResponse?.totalEvent / 20))
     return true;
  return false
}


  const eventLevelDummyData=[
    {
        _id:123232323,
        title:"Page Level Details",
        data:[
            {title:"Page Title",value:selectedEvent?.context_page_title||"-"},
            {title:"Page URL",value:selectedEvent?.context_page_url||"-"},
            {title:"Page Path",value:selectedEvent?.context_page_path||"-"},
            {title:"Page Referrer",value:selectedEvent?.context_page_referrer||"-"},
            {title:'Page Referrer Domain',value:selectedEvent?.context_page_referrer||"-"}
        ]

    },
    {
        _id:9526463,
        title:"Session Level Details",
        data:[
          {title:"IP Address",value:selectedEvent?.context_request_ip||"-"},
          {title:"Channel",value:selectedEvent?.channel||"-"},
          {title:"Screen Height",value: `${selectedEvent?.context_screen_height} Px`||"-"},
          {title:'Screen Width',value: `${selectedEvent?.context_screen_width} Px`||"-"},
          {title:'Screen Density',value:selectedEvent?.context_screen_density||"-"},
          {title:'User Agent',value:selectedEvent?.context_user_agent||"-"},
          {title:'Language',value:selectedEvent?.context_locale||"-"},
      ]

    }, 
  
    {
        _id:915640963,
        title:"Source Details",
        data:[
            {title:"Campaign Source",value:selectedEvent?.context_campaign_source||"-"},
            {title:"Initial Referrer URL",value:selectedEvent?.context_page_initial_referrer||"-"},
            {title:"Initial Referrer Domain",value:selectedEvent?.context_page_initial_referring_domain||"-"},
            {title:"Campaign Medium",value:selectedEvent?.context_campaign_medium||"-"},
            {title:'Campaign Name',value:selectedEvent?.context_campaign_name||"-"},
            {title:'Campaign Content',value:selectedEvent?.context_campaign_content||"-"}
        ]

    },
   
]

const getReccomendedArray=(event:string)=>{
    if(event==="product_viewed"||event=="checkout_started"||event=="product_added"){
        return {
            _id:915643463,
            title:"Event Level Details",
            data:[
                {title:"Name",value:selectedEvent?.name||"-"},
                {title:"Price",value:selectedEvent?.price?(selectedEvent?.currency+" "+selectedEvent?.price):"-"},
                {title:"Category",value:selectedEvent?.category||"-"},
                {title:"product_id",value:selectedEvent?.product_id||"-"},
                {title:'variant',value:selectedEvent?.variant||"-"},
            ]

        }
    }else if(event==="template_viewed"||event=="template_clicked"){
      // "visitor_id, campaign_id, variant_id, use_case_id, segment_id
        return {
          _id:9156436789463,
          title:"Event Level Details",
          data:[
              {title:"Campaign",value:selectedEvent?.campaign_name||"-"},
              {title:"Variant",value:selectedEvent?.variant_name||"-"},
              {title:"Usecase",value:selectedEvent?.usecase_name||"-"},
              {title:"Segment",value:selectedEvent?.segment_name||"-"},
              ]  

          }
    }else if(event=="pages"){
      return {
        _id:9156413463,
        title:"Event Level Details",
        data:[
            {title:"Page Title",value:selectedEvent?.context_page_title||"-"},
            {title:"Category of the Page",value:selectedEvent?.category||"-"},
            {title:"Name",value:selectedEvent?.name||"-"},
            {title:"URL",value:selectedEvent?.url||"-"},
        ]

        }
    }else if(event=="product_clicked"){
      return {
        _id:9156413463,
        title:"Event Level Details",
        data:[
          {title:"Name",value:selectedEvent?.name||"-"},
          {title:"Category",value:selectedEvent?.category||"-"},
          {title:"product_id",value:selectedEvent?.product_id||"-"},
          {title:'variant',value:selectedEvent?.variant||"-"},
        ]

        }
    }else if(event=="product_list_viewed"){
      return {
        _id:9156413463,
        title:"Event Level Details",
        data:[
          {title:"Products",value:selectedEvent?.products||"-"}
        ]

        }
    }
    else if(event==="visitor_identified"){
      return {
        _id:9156413463,
        title:"Event Level Details",
        data:[
          {title:"Browser Name",value:selectedEvent?.browser_name||"-"},
          {title:"Device",value:selectedEvent?.device||"-"},
          {title:"OS",value:selectedEvent?.os||"-"},
          {title:"Incognito",value:selectedEvent?.incognito||"-"},
          {title:"Postal Code	",value:selectedEvent?.ip_location_postal_code||"-"},
          {title:"City",value:selectedEvent?.ip_location_city_name||"-"},
          {title:"Country",value:selectedEvent?.ip_location_country_name||"-"},
          {title:"Counry Code	",value:selectedEvent?.	ip_location_country_code||"-"},
          {title:"Timezone",value:selectedEvent?.ip_location_timezone||"-"},
          {title:"Continent",value:selectedEvent?.ip_location_continent_name||"-"},
          {title:"Longitude",value:selectedEvent?.ip_location_longitude||"-"},
          {title:"Latitude",value:selectedEvent?.ip_location_latitude||"-"},
          {title:"Accuracy Radius",value:selectedEvent?.ip_location_accuracy_radius||"-"},
          {title:"Confidence Score",value:selectedEvent?.confidence_score||"-"},
        ]

        }
    }
    else{
      return {
        data:[]
      }
    }
}


  return (
   <div className='event-stream-sessions-data-wrapper'>
    <div style={!sessionData.length?{opacity:0.4}:{}} className='event-timeline-parent-wrapper'>
    <LineLoader isVisible={!sessionData.length}/>
            <div  className='event-time-line-header'>
                <p className='text-xl--sb'>Event Timeline</p>
            </div>
            
       <div  className='all-sessions-data-wrapper'>    
        {sessionData.map((el:any,index:number)=> <SingleSessionData currentSelectedEvent={currentSelectedEvent} sendCurrentEvent={(e:any)=>setCurrentSelectedEvent(e)} {...el} lastSession={sessionData.length-1===index} />)}   
       </div>
       <div className="show-more-button-wrapper">
          {
            isShowMore() ? 
            <Button variant="outline" style={{width:"10rem", textAlign:"center",justifyContent:"center"}} state={isLoading&&"loading"} onClick={fetchMoreSessions}>Show More</Button>        
            : <></>
          }
       </div>
       
      </div>
   
        {Object.keys(selectedEvent)?.length!==0&&<div className='single-event-aggregated-data' style={makeLoaderVisible?{opacity:0.4}:{}}>
         
         <div className='event-title-header-wrapper'>
         <div className='event-aggregated-title-wrapper'>
                    <p className='text-md--sb'>{selectedEvent.event_text}</p>
                    <p className='text-xs'>{selectedEvent&&convertTimeToUtcZone(selectedEvent.original_timestamp)[2]}, {currentSelectedEvent&&convertTimeToUtcZone(selectedEvent.original_timestamp)[0][1]+" "+convertTimeToUtcZone(selectedEvent.original_timestamp)[0][0]+" "+convertTimeToUtcZone(selectedEvent.original_timestamp)[1]}</p>
            </div>
            <EventProperty title={"Event ID"} withLine={false} value={selectedEvent?.id}/>
            </div>
            
            <LineLoader isVisible={makeLoaderVisible}/>
         <div className='particular-event-data-wrapper'>
         {getReccomendedArray(currentSelectedEvent?.event).data.length!==0&& <AccordionWrapper title='Event Level Data'>
   {getReccomendedArray(currentSelectedEvent?.event)?.data.map((el)=><EventProperty title={capitalizeFirstLetterText(el?.title)} value={el?.value||"-"}/>)}
   </AccordionWrapper>}
         </div>
           {eventLevelDummyData.map((el,index)=><div className={index===eventLevelDummyData.length-1?'particular-event-data-wrapper add-bottom-line':"particular-event-data-wrapper"} key={el._id}><AccordionWrapper title={el.title}>
            
                {el&&el.data.map((element,index)=><EventProperty withLine={el.data.length-1!==index} value={element.value} title={element.title}/>)}
                </AccordionWrapper></div>) }
  
           
        </div>}
   </div>
     
  )
}

export default EventTimeLine



