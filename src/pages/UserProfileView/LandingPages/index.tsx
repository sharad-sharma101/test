// @ts-nocheck
import {useState , useEffect, useContext} from 'react'
import KpiCard from '../../../components/kpi-card'
import "./index.sass"
import {getVisitorSessionDetail , getVisitorCartDetail , getCustomerSessionDetail , getCustomerOrderDetail , getCustomerDomainDetail , getVisitorDomainDetail , getCustomerCartDetail, getLandingPageData, getAudiences, getLandingPageKpiData } from '../../../services/audiences'
import { AuthContext } from '../../../auth/AuthContext'
import { Table } from '@attrybtech/attryb-ui'
import LineLoader from '../../../components/Lineloader/LineLoader'
import AudienceTableFunctionalityBar from '../../../components/audience-functionality-bar'
import { useSearchParams } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setLandingPagesResponseInRedux } from '../../../features/core-user-profile-configs/core-user-profile-slice'
import { formatCurrency, formatNumber, formatPercentage } from '../../../utils/helpers'

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties;
	render?: (column: IColumnType<T>, item: T) => void;
}

const LandingPages = () => {
    let pathName=window.location.pathname.split("/")
	const {landingPagesResponse}=useAppSelector((store)=>store.coreUserProfileSlice)
    const [lineLoader, setLineLoader] = useState(false)
	const [coreLoader, setCoreLoader] = useState(false)
    const [sessions, setSessions] = useState('-')
    const [atcRate, setAtcRate] = useState('-')
    const [coversionRate, setCoversionRate] = useState('-')
    const [sessionDuration, setSessionDuration] = useState('-')
    const [initialCheckoutRate, setInitialCheckoutRate] = useState('-')
    const [revenue, setRevenue] = useState('-')
	const [searchParams, setSearchParams] = useSearchParams()
    const [allData, setAllData] = useState<any>([])
    const [searchItem, setSearchItem] = useState("")
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(landingPagesResponse.page || 1)
    const [data, setData] = useState(landingPagesResponse.data)
    const [totalPageCount, setTotalPageCount] = useState([])
	const { containerId } = useContext<any>(AuthContext);
    const dispatch=useAppDispatch()
	
    useEffect( () => {
      const user = pathName[3]
      const id = pathName[4]
      async function giveData (user: string , id:string) {
		if(landingPagesResponse.kpiData.length == 0){
			if(user === 'visitor') {
				const CartDetail = getVisitorCartDetail(containerId, id) 
				const sessionDetail = getVisitorSessionDetail(containerId,id)
				const KPIData = getLandingPageKpiData(containerId, id)
				const data = await Promise.all([CartDetail, sessionDetail ,KPIData ]);
				setAllData(data)
				dispatch(setLandingPagesResponseInRedux({kpiData:data}))
				return data;
			} else {
				const CartDetail = getCustomerCartDetail(containerId, id) 
				const sessionDetail = getCustomerSessionDetail(containerId, id)
				const KPIData = getLandingPageKpiData(containerId, id)
				const data = await Promise.all([CartDetail, sessionDetail, KPIData]);
				setAllData(data)
				dispatch(setLandingPagesResponseInRedux({kpiData:data}))
				return data;
			}
		}else{
			setLineLoader(true)
			setAllData(landingPagesResponse.kpiData)
			setLineLoader(false)
		}
    }
    if(containerId){
        giveData(user , id)
        handleLoaders(currentPage || 1)
    }
    }, [containerId])

	const handleOnPageChange=async(e,val)=>{
        setLineLoader(true)
	    let data = await fetchTableData(val)
        setData(data)
		dispatch(setLandingPagesResponseInRedux({data:data}))
        setCurrentPage(val)
        setLineLoader(false)
	}
    const handleLoaders = async(currentPageValue) =>{
		if(data?.length){
			setLineLoader(true)
		}
		if(data?.length==0){
			setCoreLoader(true)
			let data = await fetchTableData(currentPageValue || 1)
			setData(data)
		
			dispatch(setLandingPagesResponseInRedux({data:data}))
			setCoreLoader(false)
		}
		setLineLoader(false)
	}

	const fetchTableData = async (currentPageValue) => {
		try {
            if(containerId){
                const tableData = await getLandingPageData(containerId, pathName[4], `type=${pathName[3]}&limit=${limit}&page=${currentPageValue}`)
				dispatch(setLandingPagesResponseInRedux({page:currentPageValue}))
                setTotalPageCount(Math.ceil(tableData?.data?.rowCount/limit))
                return tableData?.data
            }
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}

    useEffect(() => {
		try {
			if(allData?.length!==0){
				if(allData[1]?.data  && allData[0]?.data[0]?.add_to_cart_rate_percentage)
					setAtcRate(formatPercentage(`${allData[0]?.data[0]?.add_to_cart_rate_percentage}%`))
				if(allData[1]?.data  && allData[1]?.data[0]?.average_session_duration_sec)
					setSessionDuration(`${formatNumber(allData[1]?.data[0]?.average_session_duration_sec , false)}`)
				if(allData[1]?.data && allData[1]?.data[0]?.number_of_sessions)
					setSessions(allData[1]?.data[0]?.number_of_sessions)
				if(allData[2]?.data && allData[2]?.data[0]?.conversion_rate)
	
					setCoversionRate(formatPercentage(`${allData[2]?.data[0]?.conversion_rate} %`))
	
				if(allData[2]?.data && allData[2]?.data[0]?.revenue)
					setRevenue(formatCurrency(allData[2]?.data[0]?.revenue))
				}
		} catch (error) {
			
		}
       
    }, [allData])
	

	const columns: IColumnType<IData>[] = [
		{
			key: "Page Title",
			title: "Page Title",
			// style: { whiteSpace: "nowrap" },
			render: (_, { page_title }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : page_title ? (
							page_title
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "Category",
			title: "Category",
			// style: { whiteSpace: "nowrap" },
			render: (_, { page_type }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : page_type ? (
						page_type
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "Sessions",
			title: "Sessions",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { session_count }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : session_count ? (
						session_count
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "ATC Rate",
			title: "ATC Rate",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { add_to_cart_rate }) => {
				add_to_cart_rate = parseFloat(add_to_cart_rate)==0 ? NaN : add_to_cart_rate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : add_to_cart_rate ? (
						formatNumber(add_to_cart_rate)+"%"
					) : (
						"-"
					)}
				</>
			},
		},
		{
			key: "IC Rate",
			title: "IC Rate",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { icRate }) => {
				icRate = parseFloat(icRate)==0 ? NaN : icRate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : icRate ? (
						formatNumber(icRate)+"%"
					) : (
						"-"
					)}
				</>
			},
		},
		{
			key: "Conversion Rate",
			title: "Conversion Rate",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { conversionRate }) => {
				conversionRate = parseFloat(conversionRate)==0 ? NaN : conversionRate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : conversionRate ? (
						formatNumber(conversionRate)+"%"
					) : (
						"-"
					)}
				</>
			},
		},
		{
			key: "Revenue",
			title: "Revenue",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { revenue }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : revenue ? (
						revenue
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "Session Duration",
			title: "Avg Session Duration(s)",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { session_duration }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : session_duration ? (
						formatNumber(session_duration)
					) : (
						"-"
					)}
				</>
			),
		}
	];


  return (
    <div className="landing-pages-wrapper">
       <div className="kpi-card-wrapper">
        <KpiCard header={'Sessions'} numbers={sessions} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Add To Cart Rate'} numbers={atcRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Initiated Checkout Rate'} numbers={initialCheckoutRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Conversion Rate'} numbers={coversionRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Revenue'} numbers={revenue} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Avg Session Duration(s)'} numbers={sessionDuration} graph={[]} statistic={''} context={''} showGraph={false}/>
    </div>
    <div className="table-parent table-audience-wrapper-parent" style={{ width: "100%", marginBottom: "7.5rem" }}>
        <AudienceTableFunctionalityBar setSearchItem={setSearchItem} />
				<LineLoader isVisible={lineLoader} />
				{<div className={lineLoader && 'line-loading'}>
					<Table
						data={coreLoader ? [{},{},{}] : (data || [])}
						columns={columns}
						showPaginationFooter={(totalPageCount<=1 || !totalPageCount)? false : true}
						onPageChange={(e,selectedPage)=>{handleOnPageChange(e,selectedPage)}}
						totalPageCount={totalPageCount}
						currentPage={currentPage}
						pageSize={limit}
						onClickRow={()=>{}} 
					/>
				</div>}
			</div>
    </div>
  )
}

export default LandingPages
