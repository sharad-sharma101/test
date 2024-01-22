// @ts-nocheck
import {useState , useEffect, useContext} from 'react'
import KpiCard from '../../../components/kpi-card'
import "./index.sass"
import {getVisitorSessionDetail , getVisitorCartDetail , getCustomerSessionDetail , getCustomerOrderDetail , getCustomerDomainDetail , getVisitorDomainDetail , getCustomerCartDetail, getLandingPageKpiData, getProductsTabData } from '../../../services/audiences'
import { AuthContext } from '../../../auth/AuthContext'
import { Table } from '@attrybtech/attryb-ui'
import LineLoader from '../../../components/Lineloader/LineLoader'
import AudienceTableFunctionalityBar from '../../../components/audience-functionality-bar'
import { useSearchParams } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setProductsResponseInRedux } from '../../../features/core-user-profile-configs/core-user-profile-slice'
import { formatCurrency, formatNumber } from '../../../utils/helpers'
import FluentBox from "../../../assets/icons-v2/fluent-box-new.svg"

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties;
	render?: (column: IColumnType<T>, item: T) => void;
}

const Products = () => {
    let pathName=window.location.pathname.split("/")
	const {productsResponse}=useAppSelector((store)=>store.coreUserProfileSlice)
    const [lineLoader, setLineLoader] = useState(false)
	const [coreLoader, setCoreLoader] = useState(false)
    const [atcRate, setAtcRate] = useState('-')
    const [coversionRate, setCoversionRate] = useState('-')
    const [initialCheckoutRate, setInitialCheckoutRate] = useState('-')
    const [revenue, setRevenue] = useState('-')
    const [landingageViews, setLandingageViews] = useState('-')
    const [aov, setAov] = useState('-')
    const [allData, setAllData] = useState<any>([])
    const [searchItem, setSearchItem] = useState('')
    const [currentPage, setCurrentPage] = useState(productsResponse.page || 1)
    const [data, setData] = useState(productsResponse.data)
	const { containerId } = useContext<any>(AuthContext);
    const dispatch=useAppDispatch()
	
    useEffect( () => {
      const user = pathName[3]
      const id = pathName[4]
      async function giveData (user: string , id:string) {
		if(productsResponse.kpiData.length == 0){
			if(user === 'visitor') {
				const CartDetail = getVisitorCartDetail(containerId, id) 
				const data = await Promise.all([CartDetail ,domainDetail ]);
				dispatch(setProductsResponseInRedux({kpiData:data}))
				setAllData(data)
				return data;
			} else {
				const CartDetail = getCustomerCartDetail(containerId, id) 
				const KPIData = getLandingPageKpiData(containerId, id)
				const data = await Promise.all([CartDetail, KPIData]);
				dispatch(setProductsResponseInRedux({kpiData:data}))
				setAllData(data)
				return data;
			}
		}else{
			setLineLoader(true)
			setAllData(productsResponse.kpiData)
			setLineLoader(false)
		}
    }
    if(containerId){
        giveData(user , id)
        handleLoaders()
    }
    }, [containerId])

    const handleLoaders = async() =>{
		if(data?.length){
			setLineLoader(true)
		}
		if(data?.length==0){
			setCoreLoader(true)
			let data = await fetchProducts()
			setData(data)
			dispatch(setProductsResponseInRedux({data:data}))
			setCoreLoader(false)
		}
		setLineLoader(false)
	}

	const fetchProducts = async () => {
		try {
            const tableData = await getProductsTabData(containerId, pathName[4], `type=${pathName[3]=='user' ? 'customer' : pathName[3]}`)
			return tableData?.data
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}

    useEffect(() => {
        if(allData?.length!==0){
            if(allData[0]?.data && allData[0]?.data[0]?.add_to_cart_rate_percentage)
                setAtcRate(`${allData[0]?.data[0]?.add_to_cart_rate_percentage}%`)
            if(allData[1]?.data &&allData[1]?.data[0]?.average_session_duration_sec)
                setSessionDuration(`${formatNumber(allData[1]?.data[0]?.average_session_duration_sec , false)} sec`)
            if(allData[1]?.data &&allData[1]?.data[0]?.number_of_sessions)
                setSessions(allData[1]?.data[0]?.number_of_sessions)
            if(allData[1]?.data &&allData[1]?.data[0]?.conversion_rate)
				setCoversionRate(`${allData[1]?.data[0]?.conversion_rate}%`)
			if(allData[1]?.data && allData[1]?.data[0]?.revenue)
                setRevenue(formatCurrency(allData[1]?.data[0]?.revenue))
			if(allData[1]?.data && allData[1]?.data[0]?.average_order_value)
                setAov(formatCurrency(allData[1]?.data[0]?.average_order_value))
            }
    }, [allData])


	const columns: IColumnType<IData>[] = [
		{
			key: "Products Title",
			title: "Products Title",
			// style: { whiteSpace: "nowrap" },
			render: (_, { product_title }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : product_title ? (
						product_title
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
			render: (_, { category }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : category ? (
						category
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "Views",
			title: "# Views",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { no_of_times_viewed }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : no_of_times_viewed ? (
						no_of_times_viewed
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
			render: (_, { atc_rate }) => {
				atc_rate = parseFloat(atc_rate)==0 ? NaN : atc_rate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : atc_rate ? (
						formatNumber(atc_rate)+"%"
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
			render: (_, { initiated_checkout_rate }) => {
				initiated_checkout_rate = parseFloat(initiated_checkout_rate)==0 ? NaN : initiated_checkout_rate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : initiated_checkout_rate ? (
						formatNumber(initiated_checkout_rate)+"%"
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
			render: (_, { conversion_rate }) => {
				conversion_rate = parseFloat(conversion_rate)==0 ? NaN : conversion_rate
				return <>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : conversion_rate ? (
						formatNumber(conversion_rate)+"%"
					) : (
						"-"
					)}
				</>
			},
		},
		{
			key: "Average Price",
			title: "Average Price",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { aov }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : aov ? (
						formatCurrency(aov)
					) : (
						"-"
					)}
				</>
			),
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
						formatCurrency(revenue)
					) : (
						"-"
					)}
				</>
			),
		}
	];

	
const getTableEmptyState=()=>{
	if(data?.length === 0){
		return {
			icon:FluentBox,
			primaryHeading:"No Product interactions so far",
		}
	}
}

  return (
    <div className="products-tab-wrapper">
       <div className="kpi-card-wrapper">
        <KpiCard header={'Landing Page Views'} numbers={landingageViews} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Add To Cart Rate'} numbers={atcRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Initiated Checkout Rate'} numbers={initialCheckoutRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Conversion Rate'} numbers={coversionRate} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'AOV'} numbers={aov} graph={[]} statistic={''} context={''} showGraph={false}/>
        <KpiCard header={'Revenue'} numbers={revenue} graph={[]} statistic={''} context={''} showGraph={false}/>
    </div>
    <div className="table-parent table-audience-wrapper-parent" style={{ width: "100%", marginBottom: "7.5rem" }}>
        <AudienceTableFunctionalityBar setSearchItem={setSearchItem} />
				<LineLoader isVisible={lineLoader} />
				{<div className={lineLoader && 'line-loading'}>
					<Table
						data={coreLoader ? [{},{},{}] : (data || [])}
						columns={columns}
						showPaginationFooter={false}
						onClickRow={()=>{}}
						emptyStateComponent={getTableEmptyState()}
					/>
				</div>}
			</div>
    </div>
  )
}

export default Products
