import {useState , useEffect, useContext} from 'react'
import "./index.sass"
import chevronicon from "../../../assets/event-screen/chevron-down.svg"
import { getCustomerMetaVisit , getVisitorMetaVisit , getCustomerMetaCart , getVisitorMetaCart , getCustomerMetaOrder , getCustomerMetaType , getVisitorMetaType , getCustomerMetaPages , getVisitorMetaPages , getVisitorSessionDetail , getCustomerSessionDetail } from '../../../services/audiences' 
import { convertTimeToUtcZone, formatCurrency, formatNumber, formatPercentage ,giveDateAndTimeOfLast30Day } from '../../../utils/helpers'
import moment from "moment";
import { AuthContext } from '../../../auth/AuthContext'
import MetaAccordion from './metaAccordion'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setMetaDataResponseInRedux } from '../../../features/core-user-profile-configs/core-user-profile-slice'

const MetaData = () => {
	const {metaDataResponse}=useAppSelector((store)=>store.coreUserProfileSlice)
    const [trafficAccordion, settrafficAccordion] = useState(true)
    const [TotalData, setTotalData] = useState<any>([])
    const { containerId } = useContext<any>(AuthContext);
    const mapData = [
        {
            _id:1,
            title:"User Data",
            data:[
                {title:"Visitor Type",value: "-"},
                {title:"Customer Since",value: "-"}
            ]
    
        },
        {
            _id:2,
            title:"Sessions",
            data:[
                {title:"Total Number Of Sessions",value: "-"},
                {title:"Total Number Of Page Views",value: "-"},
                {title:"Last Visit Date",value: "-"},
                {title:"Active in last 30 days",value: "-"},
                {title:'Number of Times Visited in last 30 days',value: "-"},
                {title:'Average Session Duration',value: "-"},
                {title:'Average Pageviews Per Sessions',value: "-"},
                {title:'Average Products Viewed',value: "-"},
            ]
    
        }, 
      
        {
            _id:3,
            title:"Orders",
            data:[
                {title:"Number Of Net Orders",value:  "-"},
                {title:"Number Of Orders Created",value: "-"},
                {title:"Number Of Returns",value: "-"},
                {title:"Last Purchase: Date",value: "-"},
                {title:"Last Purchase: Amount",value: "-"},
                {title:"Average Number Of Items Per Order",value: "-"}
            ]
    
        },
        {
            _id:4,
            title:"Sales Funnel",
            data:[
                {title:"Add To Cart Rate",value:  "-"},
                {title:"Cart Abandonment Rate",value: "-"},
                {title:"Conversion Rate",value: "-"},
                {title:"Average Order Value",value: "-"}
            ]
    
        },
        {
            _id:5,
            title:"Revenue Metrics",
            data:[
                {title:"Gross Revenue",value:  "-"},
                {title:"Total Discount",value: "-"},
                {title:"Total Return",value: "-"},
                {title:"Total Shipment Fee",value: "-"},
                {title:"Total Taxes",value: "-"},
                {title:"Total Net Revenue",value: "-"}
                
            ]
    
        },
       
    ]
    const [metaDataArray, setmetaDataArray] = useState(mapData)
    const dispatch=useAppDispatch()

    useEffect( () => {
        let pathName=window.location.pathname.split("/")
        const user = pathName[pathName.length - 2]
        const id = pathName[pathName.length - 1]
        async function giveData (user: string , id:string) {
            const resp = giveDateAndTimeOfLast30Day()
        if(containerId && metaDataResponse?.data?.length == 0){
            if(user === 'visitor') {
                const visitData  = getVisitorMetaVisit(containerId, id,resp[0],resp[1]) 
                const cartData   = getVisitorMetaCart(containerId, id)   
                const typeData   = getVisitorMetaType(containerId, id) 
                const pageData   = getVisitorMetaPages(containerId, id)
                const sessionData = getVisitorSessionDetail(containerId, id)
                const data = await Promise.all([visitData , cartData , typeData , pageData , sessionData]);
				dispatch(setMetaDataResponseInRedux({data:data}))
                setTotalData(data)
                return data;
            } else {
                const visitData  = getCustomerMetaVisit(containerId, id,resp[0],resp[1]) 
                const cartData   = getCustomerMetaCart(containerId, id)
                const orderData  = getCustomerMetaOrder(containerId, id)   
                const typeData   = getCustomerMetaType(containerId, id) 
                const pageData   = getCustomerMetaPages(containerId, id)
                const sessionData = getCustomerSessionDetail(containerId, id)
                const data = await Promise.all([visitData , cartData , typeData , pageData, sessionData, orderData]);
				dispatch(setMetaDataResponseInRedux({data:data}))
                setTotalData(data)
                return data;
            }
        }else{
            setTotalData(metaDataResponse?.data)   
        }
      }
      giveData(user , id)
      }, [containerId])
    useEffect( () => {
        updateData();
    }, [TotalData])
      function updateData () {
        try {
            if(TotalData.length){
                const mapData = [
                    {
                        _id:1,
                        title:"User Data",
                        data:[
                            {title:"Visitor Type",value:TotalData.length >0 && TotalData[2].hasOwnProperty('data') ? TotalData[2].data[0]?.user_category ||"-" : "-"},
                            {title:"Customer Since",value: TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? convertTimeToUtcZone(TotalData[5].data[0]["Customer Since"])[3] ||"-" : "-"}
                        ]
                
                    },
                    {
                        _id:2,
                        title:"Sessions",
                        data:[
                            {title:"Total Number Of Sessions",value:TotalData.length >0 && TotalData[4].hasOwnProperty('data') ? TotalData[4].data[0]?.number_of_sessions ||"-" : "-"},
                            {title:"Total Number Of Page Views",value: TotalData.length >0 && TotalData[3].hasOwnProperty('data') ? formatNumber(TotalData[3].data[0]["Number of  Pageviews"] , false) ||"-" : "-"},
                            {title:"Last Visit Date",value:TotalData.length >0 && TotalData[3].hasOwnProperty('data') ? convertTimeToUtcZone(TotalData[3].data[0]["Last Visit Date"])[3] ||"-" : "-"},
                            {title:"Active in last 30 days",value: TotalData.length >0 && TotalData[0].hasOwnProperty('data') ? (TotalData[0].data[0]?.count === "0" ? 'Inactive': "Active" ) : "Inactive"},
                            {title:'Number of Times Visited in last 30 days',value: TotalData.length > 0 && TotalData[0].hasOwnProperty('data') ? (TotalData[0].data[0]?.count || "-" ) : "-"},
                            {title:'Average Session Duration',value:TotalData.length >0 && TotalData[4].hasOwnProperty('data') && TotalData[4].data[0]?.average_session_duration_sec ? `${formatNumber(TotalData[4].data[0]?.average_session_duration_sec , false)} sec` ||"-" : "-"},
                            {title:'Average Pageviews per Session',value:TotalData.length >0 && TotalData[3].hasOwnProperty('data') ? formatNumber(TotalData[3].data[0]['Average Pageviews per Session']) ||"-" : "-"},
                            {title:'Average Products Viewed per Session',value:TotalData.length >0 && TotalData[3].hasOwnProperty('data') ? formatNumber(TotalData[3].data[0]['Average Products Viewed per Session']) ||"-" : "-"},
                        ]
                
                    }, 
                  
                    {
                        _id:3,
                        title:"Orders",
                        data:[
                            {title:"Number of Orders",value: TotalData.length >= 6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatNumber(TotalData[5].data[0]["Net Number of Orders"] , false) ||"-" : "-"},
                            {title:"Number Of Orders Created",value:TotalData.length >= 6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatNumber(TotalData[5].data[0]["Orders Placed"] , false) ||"-" : "-"},
                            {title:"Number of Orders Cancelled",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatNumber(TotalData[5].data[0]["Orders Returned"] , false) ||"-" : "-"},
                            {title:"Last Purchase Date",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? convertTimeToUtcZone(TotalData[5].data[0]["Last Purchase Date"])[3] ||"-" : "-"},
                            {title:"Last Purchase Amount",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]["Last Purchase Amount"]) ||"-" : "-"},
                            {title:"Average Number of Items per Order",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? TotalData[5].data[0]["Average Order Quantity"] ||"-" : "-"}
                        ]
                
                    },
                    {
                        _id:4,
                        title:"Sales Funnel",
                        data:[
                            {title:"Add To Cart Rate",value: TotalData.length >0 && TotalData[1].hasOwnProperty('data') && TotalData[1].data[0]?.add_to_cart_rate_percentage ? `${formatPercentage(TotalData[1].data[0]?.add_to_cart_rate_percentage)}` ||"-" : "-"},
                            {title:"Cart Abandonment Rate",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length && TotalData[5].data[0]['abandon_cart_percentage'] ? `${TotalData[5].data[0]['abandon_cart_percentage']}%` ||"-" : "-"},
                            {title:"Conversion Rate",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length && TotalData[5].data[0]['Conversion Rate'] ? `${formatPercentage(TotalData[5].data[0]['Conversion Rate'])}` ||"-" : "-"},
                            {title:"Average Order Value",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Average Order Value']) ||"-" : "-"}
                        ]
                
                    },
                    {
                        _id:5,
                        title:"Revenue Metrics",
                        data:[
                            {title:"Gross Revenue",value: TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Gross Revenue']) ||"-" : "-"},
                            {title:"Total Discount",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Total Discount']) ||"-" : "-"},
                            {title:"Total Return",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatNumber(TotalData[5].data[0]['Orders Returned']) ||"-" : "-"},
                            {title:"Total Shipment Fee",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Total Shipment Fee']) ||"-" : "-"},
                            {title:"Total Taxes",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Total Taxes']) ||"-" : "-"},
                            {title:"Total Net Revenue",value:TotalData.length >=6 && TotalData[5].hasOwnProperty('data') && TotalData[5].data.length ? formatCurrency(TotalData[5].data[0]['Total Net Revenue']) ||"-" : "-"}
                            
                        ]
                
                    },
                   
                ]
                setmetaDataArray(mapData)
            }
          } catch (err) {
            return err;
          }
      }
      function formateDateAndTime (date : string) {
        if(date){
            const formattedDate = moment(date).utc().format('DD MMM YYYY, hh:mm A')
            return formattedDate
        } else {
            return "-"
        }
    }

      

    const accordionChild = (obj: any) => {
        return (
        obj.data.map((ele: any) => (
            <div className='traffic-source-row' >
                <p className='text-sm--md row-value-data'>{ele.title}</p>
                <p className='text-sm row-value-data'>{ele.value}</p>
            </div>
        ))
    )
    }
  return (
    <div className='meta-data-component-wrapper'>

        {
            metaDataArray.map((obj: any) => (
                <MetaAccordion heading={obj.title} children={accordionChild(obj)} />
            ))
        }
    </div>
  )
}

export default MetaData
