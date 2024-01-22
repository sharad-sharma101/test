import React, { useContext, useEffect, useState } from 'react'
import KpiCard from '../../../components/kpi-card'
import "./index.sass"
import chevronicon from "../../../assets/event-screen/chevron-down.svg"
import { formatCurrency, formatNumber } from '../../../utils/helpers'
import { AuthContext } from '../../../auth/AuthContext'
import { getSegmentMeta, getSegmentTraffic } from '../../../services/segments'

const SegmentSummary = () => {
    const [sessions, setSessions] = useState('-')
    const [averageOrderValue, setAverageOrderValue] = useState('-')
    const [atcRate, setAtcRate] = useState('-')
    const [coversionRate, setCoversionRate] = useState('-')
    const [orders, setOrders] = useState('-')
    const [sessionDuration, setSessionDuration] = useState('-')
    const [trafficAccordion , settrafficAccordion]=useState(true)
    const {containerId}:any =useContext(AuthContext)
    const [trafficData, setTrafficData] = useState<any[]>([])
    async function getMetaData () {
        const resp = await getSegmentMeta(containerId) 
        if(resp){
            const metaData = resp.data
            setSessions(metaData[0]?.segment_size)
            setAverageOrderValue(formatNumber(metaData[0]?.aov_shopify))
            setAtcRate(formatNumber(metaData[0]?.atc_rate))
            setCoversionRate(formatNumber(metaData[0]?.cr))
            setOrders(metaData[0]?.order_count_shopify)
            const duration = metaData[0]?.avg_session_duration
            const durationInSecond = (duration.minutes * 60) + duration.seconds ;
            setSessionDuration(durationInSecond)
        }
    }
    async function getTrafficData () {
        const resp = await getSegmentTraffic(containerId);
        if(resp){
            const traficData = resp.data[0].traffic_data || []
            setTrafficData(traficData)
        }
    }
    useEffect(() => {
        if(containerId){
        getTrafficData()
        getMetaData()      
    }
    }, [])
    

  return (
    <div className="segment-meta-data-container">

        <div className="summarycards-container" >
            <div className="kpi-card-wrapper">
                <KpiCard header={'Segment Size'} numbers={sessions} graph={[]} statistic={''} context={''} showGraph={false}/>
                <KpiCard header={'Add To Cart Rate'} numbers={atcRate} graph={[]} statistic={''} context={''} showGraph={false}/>
                <KpiCard header={'Conversion Rate'} numbers={coversionRate} graph={[]} statistic={''} context={''} showGraph={false}/>
                <KpiCard header={'Average Order Value'} numbers={averageOrderValue} graph={[]} statistic={''} context={''} showGraph={false}/>
                <KpiCard header={'Number Of Order'} numbers={orders} graph={[]} statistic={''} context={''} showGraph={false}/>
                <KpiCard header={'Avg Session Duration (s)'} numbers={sessionDuration} graph={[]} statistic={''} context={''} showGraph={false}/>
            </div>
        </div>
        <div className="accordion-wrapper">
        <div className="container-header" onClick={() => settrafficAccordion(!trafficAccordion)}>
            <p className='text-md--sb' >Traffic Sources</p>
            <div className="chavron-image-wrapper">
                <img src={chevronicon} alt="" />
            </div>
        </div>
        <div className={`traffic-data-rows-wrapper ${trafficAccordion ? 'open' : 'close'}`}>
        {  trafficData.length > 0 &&
        [...trafficData].map((ele: any , index:number) => (
            <div className='traffic-source-row' key={index} >
                <p className='text-sm--md row-value-data'>{ele?.traffic_source}</p>
                <p className='text-sm row-value-data'>{ele?.source_count}</p>
            </div>
        ))
        }
        </div>
    </div>

    
    </div>
  )
}

export default SegmentSummary