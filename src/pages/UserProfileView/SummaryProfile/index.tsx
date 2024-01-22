import {useState , useEffect, useContext} from 'react'
import KpiCard from '../../../components/kpi-card'
import "./index.sass"
import EventProperty from '../EventProperty'
import AccordionWrapper from '../../../components/AccordionWrapper'
import ConfigurationAccordion from '../../../components/ConfigurationAccordion'
import chevronicon from "../../../assets/event-screen/chevron-down.svg"

import {getVisitorSessionDetail , getVisitorCartDetail ,getProducts, getCustomerSessionDetail , getCustomerOrderDetail , getCustomerDomainDetail , getVisitorDomainDetail , getCustomerCartDetail, getSummaryPageLocationData } from '../../../services/audiences'

import { AuthContext } from '../../../auth/AuthContext'
import SingleSessionData from '../SingleSessionData'
import { formatCurrency, formatNumber, getTransformedLocationData } from '../../../utils/helpers'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setSummeryResponseInRedux } from '../../../features/core-user-profile-configs/core-user-profile-slice'

const SummaryProfile = () => {
    let pathName=window.location.pathname.split("/")
	const {summeryResponse}=useAppSelector((store)=>store.coreUserProfileSlice)
    const [locationDataOfUser,setLocationDataOfUser]=useState<any>([])
    const [trafficAccordion, settrafficAccordion] = useState(true)
    const [sessions, setSessions] = useState('-')
    const [averageOrderValue, setAverageOrderValue] = useState('-')
    const [atcRate, setAtcRate] = useState('-')
    const [coversionRate, setCoversionRate] = useState('-')
    const [orders, setOrders] = useState('-')
    const [sessionDuration, setSessionDuration] = useState('-')
    const [domainData, setDomainData] = useState<any[]>(summeryResponse.domainData||[])
    const [reffralArray, setReffralArray] = useState([])
    const [allData, setAllData] = useState<any>()
	const { containerId } = useContext<any>(AuthContext);
    const [showLocationAccordian,setShowLocationAccordian]=useState(true)
    const dispatch=useAppDispatch()

    const user = pathName[pathName.length - 2]
      const id = pathName[pathName.length - 1]

    const [showPorductsAcc , setShowPorductsAcc]=useState(true)
    const [productsData, setProductsData] = useState<any[]>([])
    const [currency, setCurrency] = useState("")

    const DefaultTrafficData = [
        {
            source: "unknown" , 
            value: "100.0%"
        }
    ]
    const productData = {
        columnHeader: [
            'Product Name',
            'Total Quantity' ,
            'Average Price' ,
            'Revenue'
        ] 
    }

    const dummyLocationData=[
        {
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Bengaluru, Karnataka, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },
        {
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Chennai, Tamil Nadu, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },
        {
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Kolkata, West Bengal, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },{
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Mumbai, Maharashtra, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },{
            Date:"2023-10-01T13:28:36.455Z",
            sessionId:"Hyderabad, Telangana, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },
            {
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },
            {
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },
            {
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },
        ]

            
        },
        {
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Mumbai, Maharashtra, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },
        {
            Date:"2023-10-27T13:28:36.455Z",
            sessionId:"Mumbai, Maharashtra, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        },
        {
            Date:"2023-09-19T13:28:36.455Z",
            sessionId:"Mumbai, Maharashtra, India",
            duration:400,
            events:[{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },
            {
                title:"Android",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            },{
                title:"Mac",
                time:"2023-10-25T12:03:36.351Z",
                data:[
                    {
                    title:"Device OS",
                    value:'Mac',
                    },
                    {
                    title:"Screen Width",
                    value:'1920 PX',
                    },
                    {
                    title:"Screen Height",
                    value:'1080 PX',
                    },
                    {
                        title:"Browser",
                        value:'Safarai',
                    },
                    {
                        title:"Bot Detection",
                        value:'NO',
                    },
                    {
                        title:"Information Confidence",
                        value:'81%',
                    }
            ]
            }]

            
        }
    ]

    const getLocationData=async()=>{
        if(!containerId)return
        try {
            if(summeryResponse?.locationDataOfUser.length==0){
                let data=await getSummaryPageLocationData(`/${containerId}/audience/location/${id}?type=${user=='user' ? 'customer' : user}`)
                let transformedLocationData = getTransformedLocationData(data)
                setLocationDataOfUser(transformedLocationData)
                dispatch(setSummeryResponseInRedux({locationDataOfUser:transformedLocationData}))
            }else{
                setLocationDataOfUser(summeryResponse?.locationDataOfUser)
            }
        } catch (error) {
            
        }
    }
    const calculateTrafficRatio=(traffic:any)=>{
       
      try {
        const sumOfTraffic = traffic.reduce((accumulator:any, el:any) => accumulator + Number(el.count), 0);
        let finalUpdatedTraffic=traffic.map((el:any)=>{
         return {...el,count:formatNumber((el.count/sumOfTraffic)*100,true)+"%"}
        })
        return finalUpdatedTraffic
      } catch (error) {
      return []
      }
    }   
    useEffect(()=>{
       getLocationData()
    },[containerId])
  
    useEffect( () => {
        const user = pathName[pathName.length - 2]
      const id = pathName[pathName.length - 1]
      async function giveData (user: string , id:string) {
		if(summeryResponse?.kpiData?.length == 0){
            if(user === 'visitor') {
                const CartDetail = getVisitorCartDetail(containerId, id) 
                const sessionDetail = getVisitorSessionDetail(containerId,id)
                const domainDetail = getVisitorDomainDetail(containerId, id) 
                const data = await Promise.all([CartDetail, sessionDetail ,domainDetail ]);
                setDomainData(calculateTrafficRatio(data[2]?.data||[]))
                dispatch(setSummeryResponseInRedux({domainData:calculateTrafficRatio(data[2]?.data||[])}))
                dispatch(setSummeryResponseInRedux({kpiData:data}))
                setAllData(data)
                return data;
            } else {
                const CartDetail = getCustomerCartDetail(containerId, id) 
                const sessionDetail = getCustomerSessionDetail(containerId, id)
                const domainDetail = getCustomerDomainDetail(containerId, id) 
            
                const orderDetail = getCustomerOrderDetail(containerId, id)
                const data = await Promise.all([CartDetail, sessionDetail ,domainDetail ,orderDetail]);
                setDomainData(calculateTrafficRatio(data[2]?.data||[]))
                dispatch(setSummeryResponseInRedux({domainData:calculateTrafficRatio(data[2]?.data||[])}))
                dispatch(setSummeryResponseInRedux({kpiData:data}))
                setAllData(data)
                return data;
            }
        }else{
			setAllData(summeryResponse?.kpiData)
		}
    }
    if(containerId){
        giveData(user , id)
    }
    }, [containerId])

    useEffect(() => {
        if(allData){

            if( allData[0]?.data && allData[0]?.data[0]?.add_to_cart_rate_percentage)
                setAtcRate(`${allData[0]?.data[0]?.add_to_cart_rate_percentage}%`)
            if(allData[1]?.data &&  allData[1]?.data[0]?.average_session_duration_sec)
                setSessionDuration(`${formatNumber(allData[1]?.data[0]?.average_session_duration_sec , false)}`)
            if(allData[1]?.data && allData[1]?.data[0]?.number_of_sessions)
                setSessions(allData[1]?.data[0]?.number_of_sessions)
            if(allData[2]?.data && allData[2]?.data[0]?.context_page_initial_referring_domain)
                setReffralArray(allData[2]?.data[0]?.context_page_initial_referring_domain)
            if(allData.length >= 4 && allData[3].hasOwnProperty('data') && allData[3]?.data?.length >0 && allData[3]?.data[0].hasOwnProperty('Conversion Rate'))
                setCoversionRate(`${allData[3]?.data[0]['Conversion Rate']}%`)
            if(allData.length >= 4 && allData[3].hasOwnProperty('data') && allData[3]?.data?.length >0 && allData[3]?.data[0].hasOwnProperty('Net Number of Orders'))
                setOrders(formatNumber(allData[3]?.data[0]['Net Number of Orders'] , false))
            if(allData.length >= 4 && allData[3].hasOwnProperty('data') && allData[3]?.data?.length >0 && allData[3]?.data[0].hasOwnProperty('Average Order Value'))
                setAverageOrderValue(allData[3]?.data[0]['Average Order Value'])
            }
    }, [allData])
    useEffect(() => { 
        getProductsData();
    }, [containerId])
    
    async function getProductsData () {
        const id = pathName[pathName.length - 1]
        if( id && containerId){
            if(summeryResponse?.productsData.length==0){
                const resp = await getProducts(containerId , id);
                setProductsData(resp.data);
                dispatch(setSummeryResponseInRedux({productsData:resp.data}))
                if(resp.data.length > 0){
                    setCurrency(resp.data[0].price_set?.presentment_money?.currency_code || "")
                }
            }else{
                setProductsData(summeryResponse?.productsData)
            }
        }
    }
    function totalRevenue (quantity: any , price: string){
        const singleProductPricing = Number(price); 
        
        if(quantity && singleProductPricing)
            return `${currency} ${(singleProductPricing * quantity).toFixed(2)}`;
        else 
            return "-"
    }


  return (
    <div className="user-required-information-wrapper">
       <div className="kpi-card-wrapper">
        <KpiCard header={'Sessions'} numbers={sessions} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Add To Cart Rate'} numbers={atcRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Conversion Rate'} numbers={coversionRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Average Order Value'} numbers={averageOrderValue} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Number Of Order'} numbers={orders} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Avg Session Duration (s)'} numbers={sessionDuration} graph={[]} statistic={''} context={''} showGraph={false}/>
    </div>

    <div className="accordion-wrapper">
        <div className="container-header" onClick={() => settrafficAccordion(!trafficAccordion)}>
            <p className='text-md--sb' >Traffic Sources</p>
            <div className="chavron-image-wrapper">
                <img src={chevronicon} alt="" />
            </div>
        </div>
        <div className={`traffic-data-rows-wrapper ${trafficAccordion ? 'open' : 'close'}`}>
        {
        domainData.map((ele) => (
            <div className='traffic-source-row' >
                <p className='text-sm--md row-value-data'>{ele.source}</p>
                <p className='text-sm row-value-data'>{ele.count}</p>
            </div>
        ))
        }
        </div>
    </div>

    
    {
    productsData?.length === 0 ?
        <></> :
        <div className="accordion-wrapper">
            <div className="container-header" onClick={() => setShowPorductsAcc(!showPorductsAcc)}>
                <p className='text-md--sb' >Products Purchased</p>
                <div className="chavron-image-wrapper">
                    <img src={chevronicon} alt="" />
                </div>
            </div>
            <div className={`traffic-data-rows-wrapper ${showPorductsAcc ? 'open' : 'close'}`}>
    
                <div className="products-detail-wrapper">
                    <div className="product-detail-header">
                        {
                            productData.columnHeader.map((ele: string) => (
                                <p className='text-sm--sb header-element'>{ele}</p>
                            ))
                        }
                    </div>
                    <div className="product-detail-rows">
                        {
                            productsData?.map((ele: any) => (
                                <div className='product-detail-row' >
                                    <p className='text-sm--md product-element'>{ele?.name || '-'}</p>
                                    <p className='text-sm--md product-element'>{formatNumber(ele?.total_quantity , false) || '-'}</p>
                                    <p className='text-sm--md product-element'>{formatCurrency(ele?.average_price) || '-'}</p>
                                    <p className='text-sm--md product-element'>{formatCurrency(ele?.revenue) || '-'}</p>
                                </div> 
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    }
 {locationDataOfUser.length!==0&&   <div className="accordion-wrapper">

        <div className="container-header" onClick={() => setShowLocationAccordian(!showLocationAccordian)}>
            <p className='text-md--sb' >Location</p>
            <div className="chavron-image-wrapper">
                <img src={chevronicon} alt="" />
            </div>
        </div>
        <div className={`traffic-data-rows-wrapper ${showLocationAccordian ? 'open' : 'close'}`}>
        <div className='summary-location-data-wrapper' >
        {locationDataOfUser.map((el:any,index:number)=><SingleSessionData accordian={true} currentSelectedEvent={{}} sendCurrentEvent={()=>{}} {...el} lastSession={locationDataOfUser.length-1===index} />)}
        </div>
        </div>
    </div>}
<div>

</div>

    </div>
  )
}

export default SummaryProfile
