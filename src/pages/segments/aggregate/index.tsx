// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./index.sass";
import { getSegments } from "../../../services/segments";
import HeaderContent from "../../Settings/Components/header-content";
import { Table, HTMLTableCell, Badge } from "@attrybtech/attryb-ui"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../../auth/AuthContext";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import TableTopFunctionalityBar from "../../../components/table-topfunctionality-bar";
import DateRangePickerComponent from "../../../components/DateRangePicker";
import { getVariants } from "../../../services/variants";
import KpiCard from "../../../components/kpi-card";
import { getCustomTemplateClick, getCustomTemplateLoad } from "../../../services/impressions";
import moment from "moment";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { useAppSelector } from "../../../app/hooks";
import { calculateAverageOrderValue, capitalizeFirstLetterText, convertConvertData , formatNumber, formatPercentage, transformData } from "../../../utils/helpers";
import { el } from "date-fns/locale";
import { getAverageOrderValue } from "../../../services/audiences";
import UserIconOne from "../../../assets/icons-v2/segment-active-inactive.svg"
import TableUtilBtn from "../../../components/table-util-button";
import { DeleteCampaignPopup } from "../deleteSegmentPopup";

 
type IData = {
	segment: {  
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
 

export default function AggregateSegmentsView() {
  const [loading,setLoading] = useState(false)
  const {reduxSegments,coreFeaturesLoading}=useAppSelector((store)=>store.coreFeaturesSlice)
  const [lineLoading,setLineLoading] = useState(false) 
  const navigate = useNavigate();
  const authContext: any = useContext(AuthContext);
  const [segmentRefactoredResponse, setSegmentRefactoredResponse] = useState([]);
  const [customTemplateClicks, setCustomTemplateClicks] = useState([]);
  const [customTemplateLoads, setCustomTemplateLoads] = useState([]);
  const [metricsObj, setMetrics] = useState({});
  const [conversions, setConversions] = useState("-");
  const [conversionRate, setConversionRate] = useState("-");
  const [impressions, setImpressions] = useState("-")
  const [viewallFilter, setViewallFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState([]);
  const [inactiveFilter, setInactiveFilter] = useState([]);
  const [activeSelect, setActiveSelect] = useState(false);
  const [inactiveSelect, setInactiveSelect] = useState(false);
  const [viewallSelect, setViewallSelect] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [activeOption,setActiveOption]=useState('')
  const [searchParams,setSearchParams]=useSearchParams()
	const queryParams = new URLSearchParams(window.location.search);
	const queryStatus = queryParams.get("status")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") ? searchParams.get("startDate") : '');
  const [endDate, setEndDate] = useState(searchParams.get("endDate") ? searchParams.get("endDate") : '');
  const [status, setStatus] = useState(searchParams.get("status") ? searchParams.get("status") : 'active')
  const [graphImpression, setgraphImpression] = useState([])
  const [graphLoad, setgraphLoad] = useState([])
  const [graphConversion, setgraphConversion] = useState([])
  const [graphAov, setgraphAov] = useState([])
  const [aov, setAov] = useState("0")
  const [currency, setCurrency] = useState("")   
  const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState({})
  
  useEffect(() => {
	if(authContext?.containerId && authContext?.accountId)
    	fetchSegments();
  }, [authContext?.containerId, authContext?.accountId]);
  
  useEffect(()=>{
	fetchSegments()
  },[reduxSegments,queryStatus,customTemplateClicks])
  useEffect(() => {
	if(authContext?.containerId && authContext?.accountId && authContext?.containerData?.domainName){
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
		loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.segment_id])
		clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.segment_id])
	} else if (inactiveSelect) {		
		const objectOfId = {}
		inactiveFilter.map((ele) => objectOfId[ele._id] = true)
		loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.segment_id])
		clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.segment_id])
	}
	
  const impressionData = transformData(loadArray , startDate , endDate)
  const loadData = transformData(clickArray , startDate , endDate)
  setImpressions(loadArray.length)
  setConversions(clickArray.length)
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
  function handleChangeData () {
	if(viewallSelect || status === 'all') {
		handleViewAllCallBack()
	} else if(activeSelect || status === 'active') {
		handleActiveCallBack()
	} else if(inactiveSelect || status === 'inactive') {
		handleInactiveCallback()
	} 
}
  const handleViewAllCallBack = () => {
	setViewallSelect(true);
	setActiveSelect(false);
	setInactiveSelect(false);

	setActiveOption("all")
	setInactiveSelect(true);
	if(queryStatus!=="all"){
		setSearchParams({status:"all"})

	}

	if(!viewallFilter.length){
		setConversionRate("-");
		setConversions("-");
		setImpressions("-");
	}
  }
  const handleActiveCallBack = () => {
	setViewallSelect(false);
	setActiveSelect(true);
	setInactiveSelect(false);

	setActiveOption("active")
		setInactiveSelect(true)
		if(queryStatus!=="active"){
			setSearchParams({status:"active"})

		}

	if(!activeFilter.length){
		setConversionRate("-");
		setConversions("-");
		setImpressions("-");
	}
  }

  const handleInactiveCallback = () => {
	setViewallSelect(false);
	setActiveSelect(false);
	setInactiveSelect(true);
	setActiveOption("inactive")
	if(queryStatus!=="inactive"){
		setSearchParams({status:"inactive"})
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

const computeMetrics = (row_id) => {
	// const campaignTestId = "64b9ce18ca68ae53c400fd23";
	const totalClicks = (customTemplateClicks.filter(obj => obj.segment_id === row_id)).length;
	const totalLoads = (customTemplateLoads.filter(obj => obj.segment_id === row_id)).length;
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
				viewallSelect?viewallFilter.find(item => item._id === key):
				 inactiveFilter.find(item => item._id === key);

			if (matchingFilter) {
				
				impressions += metricsObj[key].clicks;
				onloads += metricsObj[key].loads;

			}
		}
	}
	
	const crP = ((impressions/onloads) * 100) >= 10 ? (((impressions/onloads) * 100).toFixed(1)) : (((impressions/onloads) * 100).toFixed(1));
	// if (isNaN(crP) || crP === '0.00' || !isFinite(crP)) {
	// 	setConversionRate('-');
	//   } else {
	// 	setConversionRate(formatNumber(crP) +"%");
	//   }	
	  impressions = impressions === 0 ? "-" : impressions;
	  onloads = onloads === 0 ? "-" : onloads;
	// setConversions(impressions);
	// setImpressions(onloads);

	return `${metricsObj[row_id].ratio}`;
};
useEffect(() => {
	if(impressions > 0 && conversions > 0){
		setConversionRate(formatPercentage(`${(conversions*100)/impressions}%`));
	} else {
		setConversionRate(`-`);
	}
}, [impressions , conversions])


  const handleSetDateRange = (dateStr) => {
	const dateRangeArray = dateStr.split(" - ")
	let start = moment.utc(dateRangeArray[0], 'MMM DD, YYYY').toDate();
	let end = moment.utc(dateRangeArray[1], 'MMM DD, YYYY').toDate();
	setStartDate(start.toISOString())
	setEndDate(end.toISOString())
  };

  const fetchSegments = async () => {
	try {
		
		let remainingObjects = [];
			let tempActive = [];
			for(let el of reduxSegments){

				if(el.status=="active")tempActive.push(el)
				else remainingObjects.push(el)
			}
			remainingObjects=sortArrayByViewOrder(remainingObjects)
			tempActive=sortArrayByViewOrder(tempActive)
			let allSegments=[...tempActive , ...remainingObjects]
			for(let item of allSegments){

				if(item){
					if(!metricsObj[item._id]){

						metricsObj[item._id] = {clicks: 0, loads: 0};
					  }
					  setMetrics(metricsObj)
				}
			}
			
			if(queryStatus==null){
				if(tempActive.length==0){
					setSegmentRefactoredResponse([...tempActive,...remainingObjects])
					setViewallFilter([...tempActive,...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}else{
					setSegmentRefactoredResponse([...tempActive ])
					setActiveFilter([...tempActive])
					setActiveOption("active")
					handleActiveCheck()
				}
			}else{
				if(queryStatus === 'all') {
					setSegmentRefactoredResponse([...tempActive,...remainingObjects])
					setViewallFilter([...tempActive,...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}
				else if (queryStatus === 'inactive')	{
	
					setSegmentRefactoredResponse([...remainingObjects])
					setInactiveFilter([...remainingObjects])
					setActiveOption("inactive")
					handleInactiveCheck()
					
				}
				else if (queryStatus === 'active')	{
	
					setSegmentRefactoredResponse([...tempActive ])
					setActiveFilter([...tempActive])
					setActiveOption("active")
					handleActiveCheck()
				}
			}

			setLoading(false)



	  } catch (error) {
		console.error('Error fetching data:', error);
	  }

  };

  const returnThreeDotDropDown = (item) => {
	
	let AggregateCampaignsDropdown: DropdownItem[] = [
		
		{
			_id: 1,
			value: "Go to segment",
			callbackfunction: (event, row_id, rowItem) => {
				event.stopPropagation();

				navigate(`/segments/all/${row_id}`);
			},
		}
	];
	
	// if(item.type === 'custom')
	//     AggregateCampaignsDropdown.push({
	// 		_id: 4,
	// 		value: "Delete",
	// 		callbackfunction: (event, row_id,rowItem) => {
	// 			event.stopPropagation();
	// 			setSelectedSegment(item)
	// 			setDeletePopup(true)
	// 		},
	// 	},)

	return AggregateCampaignsDropdown;
};

  const handleSegmentClick = (e, item: T) => {
	if(coreFeaturesLoading)
        return
	navigate(`/segments/all/${item._id}`);
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

  const handleDropdown = (event, rowItem) => {
	event.stopPropagation();
	if (openDropdownRowId === rowItem._id) {
		setOpenDropdownRowId(null);
	} else {
		setOpenDropdownRowId(rowItem._id);
	}
};
  
	const columns: IColumnType<IData>[] = [
		{
		  key: "meta",
		  title: "Segment",
		  style:{maxWidth: "35.25rem"},
		  render: (_, {meta}) => { 
  return (
    <>
						{coreFeaturesLoading ?
							<IconLabelSkeleton
								isDescription={false}
								isHeader={true}
								isIcon={true}
							/>
							:
							<HTMLTableCell header={capitalizeFirstLetterOfWords(meta?.header)}/>
							
						}
					</>
				)
			}
		},
		{
			key: "type",
			title: "Type",
			// style:{whiteSpace: "nowrap"},
			render: (_, { type }) => (
			  <>
				{coreFeaturesLoading ? (
				  <Skeleton width={"4.783rem"} height={"1.25rem"} />
				) : (
				  <>
					{type === 'customers' ? (
						<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetterText(type)} variant="purple" />
					) : type === 'users' ? (
						<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetterText(type)} variant="pink" />
					) :  (
						<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetterText(type)} variant="orange" />
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
			style: { whiteSpace: "nowrap" , textAlign: "center"},
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
		  key: "metricsCR",
		  title: "Conversion Rate",
		  style:{whiteSpace: "nowrap" , textAlign: "center"},
		  headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { _id }) => (

				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : // (metrics?.valueConversionRate ? <NumFormatter type="percentage" value_type="float" value={metrics.valueConversionRate} fractionDigits={2} /> : "-")
					_id !== undefined ? formatPercentage(computeMetrics(_id)) : "-"
					}
				</>
			),

		},
		{
			key: "",
			title: "",
			style: { width: '4.5rem' },
			render: (_, item) => {
				return (
					<>
					{coreFeaturesLoading ? (
						<Skeleton width={"1rem"} height={"1.25rem"} />
					) : 
					<TableUtilBtn
					variant="edit"
					rowItem={item}
					dropdownItems={returnThreeDotDropDown(item)}
					row_id={item._id}
					handleDropdown={handleDropdown}
					openDropdownRowId={openDropdownRowId}
				/>
					}

					</>
				);
			},
		},

	];
	function sortArrayByViewOrder(array) {
		const viewOrder = [ 'visitors', 'users', 'customers','custom'];

		array.sort((a, b) => viewOrder.indexOf(a.type) - viewOrder.indexOf(b.type));
	  
		return array;
	}
	
	const getTableEmptyState =()=>{
		if(activeOption==='inactive'){
			return {
				icon:UserIconOne,
				primaryHeading:"No Inactive Segments",
				secondaryHeading:"Your Inactive Segments will be listed here"
			}
		}

		if(activeOption==="active"){
			return {
				icon:UserIconOne,
				primaryHeading:"No Active Segments",
				secondaryHeading:"Activate a Segment to see it listed here"
			}
		}
	}

	return (

		<div className="usecase-container">
			{deletePopup && <DeleteCampaignPopup close={setDeletePopup} segment={selectedSegment} />}
			<div className="usecase-heading-wrapper">
				<HeaderContent heading={"Segments"} description={"Manage and Configure your Segments"} />
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
				activeDefault = {false}
				inactiveDefault={ false}
				viewallDefault={ false}
				setSearchItem={setSearchItem}
				activeOption={activeOption}
				/>
					<LineLoader isVisible={lineLoading} />
				{<div className={lineLoading && 'line-loading'}>
				<Table
					data={coreFeaturesLoading?[{},{},{}]:(segmentRefactoredResponse.filter(item => searchItem ? item?.meta?.header && item?.meta?.header.toLowerCase().includes(searchItem.toLowerCase()) : true))}
					columns={columns}
					showPaginationFooter={false}
					onClickRow={handleSegmentClick} 
					emptyStateComponent={getTableEmptyState()}
					/>
				</div>}
			</div>


		</div>
	);
}
