// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { useNavigate , useSearchParams} from "react-router-dom";
import "./index.sass";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import featureServices from "../../../services/features";
import HeaderContent from "../../Settings/Components/header-content";
import { IColumnType } from "../../components/table";
import { Table, HTMLTableCell, Badge } from "@attrybtech/attryb-ui"
import { AuthContext } from "../../../auth/AuthContext";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import DateRangePickerComponent from "../../../components/DateRangePicker";
import TableTopFunctionalityBar from "../../../components/table-topfunctionality-bar";
import { getVariants } from "../../../services/variants";
import KpiCard from "../../../components/kpi-card";
import { getCustomTemplateClick, getCustomTemplateLoad } from "../../../services/impressions";
import moment from "moment";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { useAppSelector } from "../../../app/hooks";
import { calculateAverageOrderValue, capitalizeFirstLetterText, convertConvertData , formatNumber, formatPercentage, sortArrayByViewOrder, transformData } from "../../../utils/helpers";
import { set } from "lodash";
import { getAverageOrderValue } from "../../../services/audiences";
import UserIconOne from "../../../assets/icons-v2/et-use-case-screen.svg"

type IData = {
	usecase: {
		icon: string;
		header: string;
		description: string;
	};
	type: string;
	status: string;
	assistedRevenue: number;
	averageOrderValue: number;
	valueConversionRate: number;
};

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties; 
	render?: (column: IColumnType<T>, item: T) => void;
  
  }

export default function AggregateUseCaseView() {
	const [loading,setLoading] = useState(false) 
	const {reduxVariants,reduxUseCases,coreFeaturesLoading}=useAppSelector((store)=>store.coreFeaturesSlice)
	
	const [lineLoading,setLineLoading] = useState(false) 
	const navigate = useNavigate();
	const authContext: any = useContext(AuthContext);
	const [useCaseRefactorResponse, setUseCaseRefactorResponse] = useState([]);
	const [customTemplateClicks, setCustomTemplateClicks] = useState([]);
	const [customTemplateLoads, setCustomTemplateLoads] = useState([]);
	const [metricsObj, setMetrics] = useState({});
	const [conversions, setConversions] = useState("-");
	const [conversionRate, setConversionRate] = useState("-");
	const [impressions, setImpressions] = useState("-")
	const [viewallFilter, setViewallFilter] = useState([]);
	const [activeFilter, setActiveFilter] = useState([]);
	const [inactiveFilter, setInactiveFilter] = useState([]);
	const [searchParams,setSearchParams]=useSearchParams()
	const [activeSelect, setActiveSelect] = useState(false);
	const [inactiveSelect, setInactiveSelect] = useState(false);
	const [viewallSelect, setViewallSelect] = useState(false);
	const [activeOption,setActiveOption]=useState("")
	const [searchItem, setSearchItem] = useState("");
	
	const [initialRender,setInitialRender]=useState(false)
	const [selectedImpressions, setselectedImpressions] = useState([])
	const [selectedClick, setselectedClick] = useState([])
	const [graphImpression, setgraphImpression] = useState([])
	const [graphLoad, setgraphLoad] = useState([])
	const [graphConversion, setgraphConversion] = useState([])
	const [startDate, setStartDate] = useState(searchParams.get("startDate") ? searchParams.get("startDate") : '');
	const [endDate, setEndDate] = useState(searchParams.get("endDate") ? searchParams.get("endDate") : '');
	const [status, setStatus] = useState(searchParams.get("status") ? searchParams.get("status") : 'active')

	const [graphAov, setgraphAov] = useState([])
	const [aov, setAov] = useState("0")
	const [currency, setCurrency] = useState("")   
	const queryParams = new URLSearchParams(window.location.search);
	const queryStatus = queryParams.get("status");

	useEffect(()=>{
		fetchUseCases()
	},[])

	useEffect(() => {
		if(authContext?.accountId && authContext?.containerId)
			fetchUseCases();
	}, [authContext?.containerId, authContext?.accountId,reduxUseCases,queryStatus]);

	
	useEffect(() => {
		if(authContext?.accountId && authContext?.containerId && authContext?.containerData?.domainName){
			fetchLoadClicks();
		}
	}, [authContext?.containerId, authContext?.accountId, authContext?.containerData, startDate, endDate]);
    useEffect(() => {
		let loadArray = customTemplateLoads ; 
		let clickArray = customTemplateClicks;
		if(startDate && endDate)
		    averageOrderValue()
		if(activeSelect) {
		  const objectOfId = {}
		  activeFilter.map((ele) => objectOfId[ele._id] = true)
		  loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.use_case_id])
		  clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.use_case_id])
		} else if (inactiveSelect) {		
		  const objectOfId = {}
		  inactiveFilter.map((ele) => objectOfId[ele._id] = true)
		  loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.use_case_id])
		  clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.use_case_id])
		}
		
		const impressionData = transformData(loadArray , startDate , endDate)
		const loadData = transformData(clickArray , startDate , endDate)
		setgraphImpression(impressionData)
		setgraphLoad(loadData)
		const conversionData = convertConvertData(impressionData , loadData)
		setgraphConversion(conversionData)
	  }, [customTemplateClicks ,customTemplateLoads , activeSelect , inactiveSelect , viewallSelect ])	
	  
	  async function averageOrderValue () {
		if(authContext?.containerId && authContext?.containerData?.domainName){
			const start = startDate?.split('T')[0]
			const last = endDate?.split('T')[0]
			const resp = await getAverageOrderValue(authContext?.containerId, start , last)
			const dataArray = resp?.data?.rows || [] ;
			const finalData = calculateAverageOrderValue(dataArray , startDate , endDate)
			setAov(finalData[1])
			setgraphAov( finalData[0])
			setCurrency(finalData[2])
		}
	  }
	const handleActiveCheck=()=>{
		setActiveSelect(true)
		setViewallSelect(false)
		setInactiveSelect(false)
   }
	const handleInactiveCheck=()=>{
		setInactiveSelect(true)
	  setActiveSelect(false)
	  setViewallSelect(false)
	}
	const handleViewAllCheck=()=>{
		setViewallSelect(true)
		setInactiveSelect(false)
	  setActiveSelect(false)
	}

	  const handleViewAllCallBack = () => {
		setViewallSelect(true);
		setActiveSelect(false);
		setInactiveSelect(false);
		if(queryStatus!=="all"){
			setActiveOption("all")
			setQueryTotheUrl("all")
		}

		if(!viewallFilter.length){
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
		}
	  }
	  const handleActiveCallBack = () => {
		  setActiveSelect(true);
		setViewallSelect(false);
		setInactiveSelect(false);
	
		if(queryStatus!=="active"){
			setActiveOption("active")
			setQueryTotheUrl("active")
		}
		if(!activeFilter.length){
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
		}
	  }

	  const handleInactiveCallback = () => {
		  setInactiveSelect(true);
		setViewallSelect(false);
		setActiveSelect(false);

		if(queryStatus!=="inactive"){
			setActiveOption("inactive")
			setQueryTotheUrl("inactive")
		}
		if(!inactiveFilter.length){
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
		}
	  }

	const fetchLoadClicks = async () => {
		try{
			if(authContext?.containerId && startDate && endDate){
				setLineLoading(true)
				const loadsPromise = getCustomTemplateLoad(authContext?.containerId, `${(startDate && endDate) && 'startDate='+startDate+'&endDate='+endDate}`);
				const clicksPromise = getCustomTemplateClick(authContext?.containerId, `${(startDate && endDate) && 'startDate='+startDate+'&endDate='+endDate}`);

				const [loadsResp, clicksResp] = await Promise.all([
					loadsPromise.catch(error => {
						return [];
					}),
					clicksPromise.catch(error => {
						return [];
					})
				]);
	
				setCustomTemplateLoads(loadsResp);
				setCustomTemplateClicks(clicksResp);
				setLineLoading(false)
			}
		}
		catch (error) {
		  }
	}


	const computeMetrics = (row_id) => {
        const totalClicks = (customTemplateClicks.filter(obj => obj.use_case_id=== row_id)).length;
		const totalLoads = (customTemplateLoads.filter(obj => obj.use_case_id === row_id)).length;
		
		metricsObj[row_id].clicks = totalClicks;
		metricsObj[row_id].loads = totalLoads;
		if(totalClicks === 0) {
			metricsObj[row_id].ratio = "-";
			// return "-";
		}
		
		const percentage = totalLoads!==0 ? (totalClicks/totalLoads) * 100 : 0;
		const precisePercentage = percentage >= 10 ? percentage.toFixed(1) : percentage.toFixed(2);
		metricsObj[row_id].ratio = isNaN(precisePercentage) || precisePercentage === '0.00' || !isFinite(precisePercentage) ? '-' : `${precisePercentage}%`;



		let impressions = 0, onloads = 0;
		for (const key in metricsObj) {
			if (metricsObj.hasOwnProperty(key)) {
				const matchingFilter = 
					activeSelect
						? activeFilter.find(item => item._id === key) : 
					inactiveSelect 
						? inactiveFilter.find(item => item._id === key) : 
					viewallFilter.find(item => item._id === key);

				if (matchingFilter) {
					impressions += metricsObj[key].clicks;
					onloads += metricsObj[key].loads;
				}
			}
		}
		const crP = ((impressions/onloads) * 100) >= 10 ? (((impressions/onloads) * 100).toFixed(1)) : (((impressions/onloads) * 100).toFixed(1));
		if (isNaN(crP) || crP === '0.00' || !isFinite(crP)) {
			setConversionRate('-');
		  } else {
			setConversionRate(formatNumber(crP) + "%");
		  }
		  	
		impressions = impressions === 0 ? "-" : impressions;
		onloads = onloads === 0 ? "-" : onloads;
	
		setConversions(impressions);
		setImpressions(onloads);

		return `${metricsObj[row_id].ratio}`;
	};
	const setQueryTotheUrl=(statusCampaign)=>{
		setSearchParams({status:statusCampaign})
		fetchUseCases()
		}
	
	const handleSetDateRange = (dateStr) => {
		const dateRangeArray = dateStr.split(" - ")
		let start = moment.utc(dateRangeArray[0], 'MMM DD, YYYY').toDate();
		let end = moment.utc(dateRangeArray[1], 'MMM DD, YYYY').toDate();
		setStartDate(start.toISOString())
		setEndDate(end.toISOString())
	};
	const fetchUseCases = async () => {
		try {

			let tempActive=[]
			let remainingObjects=[]
			for(let el of reduxUseCases){

				if(el.status=="active")tempActive.push(el)
				else remainingObjects.push(el)
			}
		let allUseCases=[...tempActive,...remainingObjects]
		tempActive=sortArrayByViewOrder(tempActive)
		remainingObjects=sortArrayByViewOrder(remainingObjects)
		for(let item of allUseCases){
			
			if(item){
				if(!metricsObj[item._id]){

					metricsObj[item._id] = {clicks: 0, loads: 0};
				  }
				  setMetrics(metricsObj)
			}
			
			
		}
	
			if(queryStatus==null){
				if(tempActive.length==0){
					setUseCaseRefactorResponse([...tempActive , ...remainingObjects])
					setViewallFilter([...tempActive , ...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}else{
					setUseCaseRefactorResponse([...tempActive ])
					setActiveFilter([...tempActive])
				setActiveOption("active")
				handleActiveCheck()
				}
			}else{
				if(queryStatus === 'all') {
					setUseCaseRefactorResponse(([...tempActive , ...remainingObjects]))
					setViewallFilter([...tempActive , ...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}
	
				else if (queryStatus === 'inactive'){
				setUseCaseRefactorResponse([...remainingObjects])
				setInactiveFilter([...remainingObjects])
		
				setActiveOption("inactive")
				handleInactiveCheck()
				}
				else if (queryStatus === 'active')	{
			 
					setUseCaseRefactorResponse([...tempActive ])
					setActiveFilter([...tempActive])
				setActiveOption("active")
				handleActiveCheck()
	
				}
			}

		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
	};

	// useEffect(()=>{
	// 	setUseCaseRefactorResponse(sortArrayByViewOrder(useCaseRefactorResponse))
	// },[reduxUseCases])
	

	const handleUseCaseClick = (e, item: T) => {
		if(coreFeaturesLoading)
        	return
		navigate(`/use-cases/${item._id}`);

	};
	function capitalizeFirstLetterOfWords(inputString) {
		if (typeof inputString !== 'string' || inputString.length === 0) {
		  return '';
		}
	  
		return inputString
		  .split(' ')
		  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
		  .join(' ');
	  }
	  

	const columns: IColumnType<IData>[] = [
		{
			key: "meta",
			title: "Use Case",
			style:{maxWidth: "35.25rem"},
			render: (_, { meta }) => {
				return (
					<>
						{coreFeaturesLoading ?
							<IconLabelSkeleton
							isDescription={false}
							isIcon={true}
							isHeader={true}
						  />
							:
							<HTMLTableCell icon={`/use-case-icons/${meta?.icon}`} header={capitalizeFirstLetterOfWords(meta?.header)} />
							
						}
					</>
				)
			}
		},
		{
			key: "type",
			title: "Type",
			// style:{whiteSpace: "nowrap"},
			render: (_, { viewStructure }) => (
			  <>
				{coreFeaturesLoading ? (
				  <Skeleton width={"4.783rem"} height={"1.25rem"} />
				) : (
				  <>
					{viewStructure ? (
					viewStructure === 'popup' ? (
						<Badge style={{cusor:"pointer"}} variant="warning" labelText={capitalizeFirstLetterText(viewStructure)} />
					) : viewStructure === 'toaster' ? (
						<Badge  style={{cusor:"pointer"}}  variant="indigo" labelText={capitalizeFirstLetterText(viewStructure)} />
					) : viewStructure === 'carousel' ? (
						<Badge  style={{cusor:"pointer"}} variant="pink" labelText={capitalizeFirstLetterText(viewStructure)} />
					) : viewStructure === 'banner' ? (
						<Badge  style={{cusor:"pointer"}} variant="orange" labelText={capitalizeFirstLetterText(viewStructure)} />
					) : viewStructure === 'section' ? (
						<Badge  style={{cusor:"pointer"}} variant="purple" labelText={capitalizeFirstLetterText(viewStructure)} />
					) : (
						<Badge  style={{cusor:"pointer"}} variant="blue-gray" labelText={capitalizeFirstLetterText(viewStructure)} />
					)
					) : (
					"-"
					)}

				  </>
				)}
			  </>
			)
		  },
		  
		  {
			key: "status",
			title: "Status",
			// style: { whiteSpace: "nowrap" },
			render: (_, { status }) => {
			  return (
				<>
				  {coreFeaturesLoading ? (
					<Skeleton width={"4.783rem"} height={"1.25rem"} />
				  ) : (
					<>
					  {status === "active" ? (
						<Badge  style={{cusor:"pointer"}} labelText={"Active"} variant={'success'} isDot={true} />
					  ) : status === "inactive" ? (
						<Badge  style={{cusor:"pointer"}} labelText={"Inactive"} variant={'danger'} isDot={true} />
					  ) : (
						<Badge  style={{cusor:"pointer"}} labelText={'Inactive'} variant={'danger'} isDot={true} />
					  )}
					</>
				  )}
				</>
			  );
			}
		  },
		  {
			key: "Impressions",
			title: "Impressions",
			style: { whiteSpace: "nowrap" , textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { _id }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : 
					_id !== undefined ? formatNumber(metricsObj[_id]?.loads , false) : '-'
					}
				</>
			),
		},
		{
			key: "Conversions",
			title: "Conversions",
			style: { whiteSpace: "nowrap" , textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { _id }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : 
					_id !== undefined ? formatNumber(metricsObj[_id]?.clicks , false)  : '-'
					}
				</>
			),
		},
		{
			key: "metrics",
			title: "Conversion Rate",
			style:{whiteSpace: "nowrap" , textAlign: "center"},
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { _id }) => (

				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"6.783rem"} height={"1.25rem"} />
					) : // (metrics?.valueConversionRate ? <NumFormatter type="percentage" value_type="float" value={metrics.valueConversionRate} fractionDigits={2} /> : "-")
					_id !== undefined ? formatPercentage(computeMetrics(_id)) : "-"
					}
				</>
			),
		},
	];

	const getTableEmptyState =()=>{
		if(activeOption==='inactive'){
			return {
				icon:UserIconOne,
				primaryHeading:"No Inactive Use Cases",
				secondaryHeading:"Your Inactive Use Cases will be listed here"
			}
		}

		if(activeOption==="active"){
			return {
				icon:UserIconOne,
				primaryHeading:"No Active Use Cases",
				secondaryHeading:"Activate a Use Cases to see it listed here"
			}
		}
	}


	return (
		<div className="usecase-container">
			<div className="usecase-heading-wrapper">
				<HeaderContent heading={"Use Cases"} description={"Manage and Configure your Use Cases"}/>
				<DateRangePickerComponent handleChangeEvent={handleSetDateRange} defaultStartDate={startDate} defaultEndDate={endDate}/>
			</div>
			<div className="metric-card--wrapper" style={{ marginBottom: "1.5rem" }}>
    		    <KpiCard numbers={formatNumber(impressions , false)} header={"Impressions"} statistic={"14.6%"} context={"vs last month"} graph={graphImpression}  />
				<KpiCard numbers={formatNumber(conversions , false)} header={"Conversions"} statistic={"16.4%"} context={"Due to Assistance"} graph={graphLoad} />
				<KpiCard numbers={`${conversionRate}`} header={"Conversion Rate"} statistic={"7.1%"} context={"vs last month"} graph={graphConversion} />
				<KpiCard numbers={`${currency} ${formatNumber(aov)}`} header={"Average Order Value"} statistic={"3.3%"} context={"Due to Assistance"} graph={graphAov} />
			</div>
			<div className="table-parent" style={{width: "100%", marginBottom: "7.5rem"}}>
			<TableTopFunctionalityBar searchBarPlaceholder={""}
					viewallCallback = {handleViewAllCallBack}
					activeCallback = {handleActiveCallBack}
					inactiveCallback = {handleInactiveCallback}
					setSearchItem={setSearchItem}
					activeOption={activeOption}
					/>
					<LineLoader isVisible={lineLoading} />
					{<div className={lineLoading && 'line-loading'}>
						<Table
							data={coreFeaturesLoading?[{},{},{}]:(useCaseRefactorResponse.filter(item => searchItem ? item.meta && item.meta.header.toLowerCase().includes(searchItem.toLowerCase()) : true))}
							columns={columns}
							showPaginationFooter={false} 
							onClickRow={handleUseCaseClick}
							emptyStateComponent={getTableEmptyState()}
							/>
					</div>}
			</div>



		</div>
	)

}