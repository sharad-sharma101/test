// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { useNavigate, useSearchParams } from "react-router-dom";
import "./index.sass";
import HeaderContent from "../../Settings/Components/header-content";
import {
	Table,
	HTMLTableCell,
	Badge,Button
} from "@attrybtech/attryb-ui";
import featureServices from "../../../services/features";
import { deleteCampaign, getCampaigns, } from "../../../services/campaigns";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getSegments, } from "../../../services/segments";
import { CreateCampaignPopup } from "../createCampaignPopup/index";
import TableTopFunctionalityBar from "../../../components/table-topfunctionality-bar";
import TableUtilBtn from "../../../components/table-util-button";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import { AuthContext } from "../../../auth/AuthContext";
import DateRangePickerComponent from "../../../components/DateRangePicker";
import { getVariants, putVariants } from "../../../services/variants";
import { StatusPopup } from "../statusPopup";
import KpiCard from "../../../components/kpi-card";
import { getCustomTemplateLoad, getCustomTemplateClick } from "../../../services/impressions";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import moment from "moment";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { setAlertVisible } from "../../../features/globalConfigs/global-slice";
import { setCampaginsInRedux, setCampaignViewStatus, setImpressionsInRedux, setIsDataPresent, setLoadCLicksInRedux, setSegmentsInRedux, setUseCasesInRedux, setVaraintsInRedux, updateVaraintStatusInRedux } from "../../../features/core-feature-configs/core-features-slice";
import { DeleteCampaignPopup } from "../DeleteCampaignPopup";
import { calculateAverageOrderValue, capitalizeFirstLetterText, convertConvertData , formatPercentage, transformData } from "../../../utils/helpers";
import { getAverageOrderValue } from "../../../services/audiences";
import { formatNumber , formatCurrency } from "../../../utils/helpers";
import camapignTableEmptyStateIcon from "../../../assets/icons-v2/et-campaign-screen icon.svg"

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties;
	render?: (column: IColumnType<T>, item: T) => void;
}

export default function AggregateCampaignView() {


	const [viewStatus,setviewStatus]=useState('all')
	const {isDataPresent,coreFeaturesLoading,campaignViewStatus,reduxCampaigns,reduxSegments,reduxImpressions,reduxLoadClicks,reduxUseCases,reduxVariants,reduxAggregatedCampaings}=useAppSelector((store)=>store.coreFeaturesSlice)
	const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
	const [loading, setLoading] = useState(coreFeaturesLoading);
	const [lineLoading, setLineLoading] = useState(false)
	const [showCreateCampaignPopup, setCreateCampaignPopup] = useState(false);
	const [useCase, setUseCases] = useState([{}, {}]);
	const [segment, setSegments] = useState([]);
	const [campaignRefactoredResposnse, setCampaignRefactoredResponse] = useState([{}, {}, {}]);
	const [showCrossIconPopup, setshowCrossIconPopup] = useState(false);
	const [selectedRowItem, setSelectedRowItem] = useState({});
	const navigate = useNavigate();
	const authContext: any = useContext(AuthContext);
	const [showAlert, setShowAlert] = useState(false);
	const [customTemplateClicks, setCustomTemplateClicks] = useState([]);
	const [customTemplateLoads, setCustomTemplateLoads] = useState([]);
	const [metricsObj, setMetrics] = useState({});
	const [conversions, setConversions] = useState("-");
	const [conversionRate, setConversionRate] = useState("-");
	const [impressions, setImpressions] = useState("-")
	const [aov, setAov] = useState("0")
	const [viewallFilter, setViewallFilter] = useState([]);
	const [activeFilter, setActiveFilter] = useState([]);
	const [inactiveFilter, setInactiveFilter] = useState([]);
	const [activeSelect, setActiveSelect] = useState(false);
	const [inactiveSelect, setInactiveSelect] = useState(false);
	const [viewallSelect, setViewallSelect] = useState(false);
	const [copyCampaignData, setCopyCampaignData] = useState([])
	const [campaigns,setCampagins]=useState([])
	const [allVaraints, setAllVariants] = useState([])
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchItem, setSearchItem] = useState("");
	const [activeOption, setActiveOption] = useState();
	const [graphImpression, setgraphImpression] = useState([])
	const [graphLoad, setgraphLoad] = useState([])
	const [graphConversion, setgraphConversion] = useState([])
	const [graphAov, setgraphAov] = useState([])
	const [currency, setCurrency] = useState("")           
	const [showDeleteCampaignPopup,setShowDeleteCampaignPopup]=useState({campaignId:"",visible:false})


  const queryParams = new URLSearchParams(window.location.search);
  const queryStatus = queryParams.get("status");	

	useEffect(()=>{	
		handleVariantsAccordingToCampaign()		
	},[queryStatus,reduxImpressions,reduxCampaigns])

	const queryStartDate=queryParams.get("startDate")
	const queryEndDate=queryParams.get("endDate")

	const [startDate, setStartDate] = useState(searchParams.get("startDate") ? searchParams.get("startDate") : '');
	const [endDate, setEndDate] = useState(searchParams.get("endDate") ? searchParams.get("endDate") : '');
	const [status, setStatus] = useState(campaignViewStatus)
	const dispatch = useAppDispatch()


	useEffect(() => {
		if (authContext?.accountId && authContext?.containerId && authContext?.containerData?.domainName) {
			fetchLoadClicks();
		
		}
	}, [authContext?.accountId, authContext?.containerId, authContext?.containerData,startDate, endDate]);
   
	useEffect(() => {
		let loadArray = customTemplateLoads ; 
		let clickArray = customTemplateClicks;
		if(startDate && endDate)
		    averageOrderValue();
	 if(activeSelect) {
		const objectOfId = {}
		activeFilter.map((ele) => objectOfId[ele._id] = true)
		loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.campaign_id])
		clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.campaign_id])
	 } else if (inactiveSelect) {		
		const objectOfId = {}
		inactiveFilter.map((ele) => objectOfId[ele._id] = true)
		loadArray = customTemplateLoads.filter((ele) => objectOfId[ele.campaign_id])
		clickArray = customTemplateClicks.filter((ele) => objectOfId[ele.campaign_id])
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
		if(authContext?.containerId ){
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

	const fetchLoadClicks = async () => {

		try {
			if(authContext?.containerId && authContext?.containerData?.domainName && startDate && endDate){
				setLineLoading(true)
				const loadsPromise = getCustomTemplateLoad(authContext?.containerId, `${(startDate && endDate) && 'startDate=' + startDate + '&endDate=' + endDate}`);
				const clicksPromise = getCustomTemplateClick(authContext?.containerId, `${(startDate && endDate) && 'startDate=' + startDate + '&endDate=' + endDate}`);
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
			setLineLoading(false)
			console.log(error)
		}
	
	}

	function handleChangeDseata() {
		if (viewallSelect || status === 'all') {
			handleViewAllCallBack()
		} else if (activeSelect || status === 'active') {
			handleActiveCallBack()
		} else if (inactiveSelect || status === 'inactive') {
			handleInactiveCallback()
		}
	}
	const computeMetrics = (row_id) => {
		if(Object.keys(metricsObj).length===0){
         return
		}
		
		const totalClicks = (customTemplateClicks.filter(obj => obj.campaign_id === row_id)).length;
		const totalLoads = (customTemplateLoads.filter(obj => obj.campaign_id === row_id)).length;
		metricsObj[row_id].clicks = totalClicks;
		metricsObj[row_id].loads = totalLoads;
		if (totalClicks === 0) {
			metricsObj[row_id].ratio = "-";
			// return "-";
		}
		
		const percentage = totalLoads !== 0 ? (totalClicks / totalLoads) * 100 : 0;
		const precisePercentage = percentage >= 10 ? percentage.toFixed(1) : percentage.toFixed(2);
		metricsObj[row_id].ratio = precisePercentage === '0.00'  ? '-' : `${precisePercentage}%`;

		let impressions = 0, onloads = 0;
		
		for (const key in metricsObj) {
			if (metricsObj.hasOwnProperty(key)) {
				const matchingFilter =
					activeSelect
						? activeFilter.find(item => item._id === key) :
						viewallSelect?
							viewallFilter.find(item => item._id === key):
							 inactiveFilter.find(item => item._id === key) ;

				if (matchingFilter) {
				
					impressions += metricsObj[key].clicks;
					onloads += metricsObj[key].loads;
				}
			}
		}

		

		const crP = ((impressions / onloads) * 100) >= 10 ? (((impressions / onloads) * 100).toFixed(1)) : (((impressions / onloads) * 100).toFixed(1));
		impressions = impressions === 0 ? "-" : impressions;
		onloads = onloads === 0 ? "-" : onloads;
		// if (isNaN(crP) || crP === '0.00' || !isFinite(crP)) {
		// 	setConversionRate('-');
		// } else {
		// 	setConversionRate(formatNumber(crP) + "%");
		// }
		impressions = impressions === 0 ? "-" : impressions;
		onloads = onloads === 0 ? "-" : onloads; 
		//setConversions(impressions);

		//setImpressions(onloads);

		return `${metricsObj[row_id].ratio}`;
	};
    useEffect(() => {
		if(impressions > 0 && conversions > 0){
			setConversionRate(formatPercentage(`${(conversions * 100 )/impressions}%`));
		} else {
		    setConversionRate(`-`);
		}
	}, [impressions , conversions])
	
	const handleOpenAlert = () => {
		dispatch(setAlertVisible({ theme: "warning", content: " Please Finish Configuring Atleast One Of The Variants First", visible: true }))
	};

	const handleCloseAlert = () => {
		setShowAlert(false);
	};
	const handleCrossPopup = (rowItem) => {
		setSelectedRowItem(rowItem);
		setshowCrossIconPopup((prevState) => !prevState);
	};
	const setQueryTotheUrl=(statusCampaign)=>{
	setSearchParams({status:statusCampaign})
	}
	const handleViewAllCallBack = (defaultClicked) => {
		
		setActiveOption("all")
        handleVariantsAccordingToCampaign()
		dispatch(setCampaignViewStatus("all"))
		setViewallSelect(true)
		setActiveSelect(false)
		setInactiveSelect(false)
		if(queryStatus!="all"){
			setQueryTotheUrl('all')
		}
		if (!viewallFilter.length) {
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
		}
	}

	const handleActiveCallBack = () => {

		handleVariantsAccordingToCampaign()
		setActiveOption("active")
		setViewallSelect(false)
		setActiveSelect(true)
		setInactiveSelect(false)
		if(queryStatus!="active"){
			setQueryTotheUrl('active')

		}
		dispatch(setCampaignViewStatus("active"))
		if (!activeFilter.length) {
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
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

	const handleInactiveCallback = () => {

		setActiveOption("inactive")
		setViewallSelect(false)
		setActiveSelect(false)
		setInactiveSelect(true)
		
		dispatch(setCampaignViewStatus("inactive"))
		handleVariantsAccordingToCampaign()
		if(queryStatus!="inactive"){
			setQueryTotheUrl('inactive')

		}
		if (!inactiveFilter.length) {
			setConversionRate("-");
			setConversions("-");
			setImpressions("-");
		}
	}

	const handleVariantsAccordingToCampaign=()=>{
	
		let activeStatusData = reduxVariants.filter((el) => el.status == "active")
			setAllVariants(reduxVariants)
		

			const obj = {};
			activeStatusData.forEach((variant) => {
				if (variant.campaignId) {
					const header = variant?.campaignId?._id;
					// use active
					const variantStatus = variant.status === "active" ? true : false;
					obj[header] = variantStatus;
				}
			});

			const objKeys = Object.keys(obj);
			let refactoredResponse = [];
			let tempActive = [];
			// !!! sort the resposne of campaign based on the added status here only
			// !!! remove this code after adding the status in the campaign resposne
		
			objKeys.forEach((key) => {
				const matchingObjects = reduxCampaigns
					.filter((selectedObj) => selectedObj._id === key)
					.map((selectedObj) => ({ ...selectedObj, status: true }));
				refactoredResponse.push(...matchingObjects);
				tempActive.push(...matchingObjects);
			});
			tempActive=sortArrayByViewOrder(tempActive)

			setActiveFilter(tempActive);

			let remainingObjects = reduxCampaigns
				.filter((selectedObj) => !objKeys.includes(selectedObj._id))
				.map((selectedObj) => ({ ...selectedObj, status: false }));
			refactoredResponse.push(...remainingObjects);

			remainingObjects=sortArrayByViewOrder(remainingObjects)
			setInactiveFilter(remainingObjects);
			refactoredResponse.forEach((item) => {
				if (item) {
					if(!metricsObj[item._id]){
						metricsObj[item._id] = { clicks: 0, loads: 0 };
					}
					setMetrics(metricsObj)
				}
			})

			setCopyCampaignData(refactoredResponse);
			
			if(queryStatus==null){
				if(tempActive.length==0){
					setCampaignRefactoredResponse([...tempActive, ...remainingObjects])
					
					setCampagins([...tempActive, ...remainingObjects])
					setViewallFilter([...tempActive, ...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}else {
					
					setCampaignRefactoredResponse([...tempActive])
					setCampagins([...tempActive])
					setActiveFilter([...tempActive])
					setActiveOption("active")
					handleActiveCheck()
				}
			}else{
				if (queryStatus === 'all'){
					
					setCampaignRefactoredResponse([...tempActive, ...remainingObjects])
					setCampagins([...tempActive, ...remainingObjects])
					setViewallFilter([...tempActive, ...remainingObjects])
					setActiveOption("all")
					handleViewAllCheck()
				}
				else if (queryStatus === 'inactive'){
					
					setCampaignRefactoredResponse([...remainingObjects])
					setCampagins([ ...remainingObjects])
					setInactiveFilter([...remainingObjects])
					setActiveOption("inactive")
					handleInactiveCheck()
				}
				else if (queryStatus === 'active'){
					
					setCampaignRefactoredResponse([...tempActive])
					setCampagins([...tempActive])
					setActiveFilter([...tempActive])
					setActiveOption("active")
					handleActiveCheck()
				}
			}
			
	}


	const handleSetDateRange = (dateStr) => {
		const dateRangeArray = dateStr.split(" - ")
		let start = moment.utc(dateRangeArray[0], 'MMM DD, YYYY').toDate();
		let end = moment.utc(dateRangeArray[1], 'MMM DD, YYYY').toDate();
		setStartDate(start.toISOString())
		setEndDate(end.toISOString())

	};

	const handleClick = async (e, item: T) => {
		try {
			if (coreFeaturesLoading) return;
			navigate(`/my-campaigns/${item._id}`);
		} catch (error) {
		}
	};
	const handleDropdown = (event, rowItem) => {
		event.stopPropagation();
		if (openDropdownRowId === rowItem._id) {
			setOpenDropdownRowId(null);
		} else {
			setOpenDropdownRowId(rowItem._id);
		}
	};


	const handleCreateCampaignPopup = () => {
		setCreateCampaignPopup((prevState) => !prevState);
	};

	interface DropdownItem {
		_id: number;
		value: string;
		callbackfunction: () => void;
	}

	const functionFilterStatusVariants = (data) => {
		const statusOrder = { 'active': 1, 'inactive': 2, 'scheduled': 3 };
		data.sort((a, b) => {
			return statusOrder[a.lowercaseStatus] - statusOrder[b.lowercaseStatus];
		})

		return data;
	};


	const fetchVariants = async (cId) => {
		try {
			// !!! fetch only active variants then update the status of that active variant only
			let updatedArr = []
			for (let el of allVaraints) {
				if (el?.campaignId?._id === cId) {
					updatedArr.push(el)
				}
			}
			// !!! remove sorting from here
			const newResps = functionFilterStatusVariants(updatedArr);
			const newResp = newResps.filter((ele : any) => ele.isDeleted === false)
			if(newResp[0]?.isDraft||newResp.length==0){
				handleOpenAlert();
			}

			else {
				const vStatus = newResp[0].status === "active" ? "inactive" : "active";
				try {
					const updatedVariant = await putVariants(newResp[0]._id, { status: vStatus });
					if (updatedVariant) {

						fetchCampaignsAfterUpdation(vStatus, newResp[0], cId);
						dispatch(updateVaraintStatusInRedux({variant:newResp[0],status:vStatus}))
					}
				} catch (error) {
					console.log(error)
					dispatch(setAlertVisible({ theme: 'danger', content: "Something Went Wrong", visible: true }))
				}

			}

			// fetchCampaigns();
		} catch (error) {
			throw new Error("Failed to fetch variants:", error);
		}
	};


	const fetchCampaignsAfterUpdation = (variantStatus, variant, cId) => {

		let RealData = [...copyCampaignData]
		let updatedCampaignData = RealData.map((item) => {
			if (item._id === cId) {
				item.status = variantStatus === "active" ? true : false
			}
			return item
		})
		if (variantStatus === "active") {
			dispatch(setAlertVisible({ theme: 'success', content: `Campaign Turned On, ${variant.name} Variant is Active `, visible: true }))
		} else {
			dispatch(setAlertVisible({ theme: 'danger', content: "Campaign Turned Off", visible: true }))
		}
		let activeData = []
		let inActiveData = []
		for (let el of updatedCampaignData) {
			if (el.status == true) {
				activeData.push(el)
			} else {
				inActiveData.push(el)
			}
		}
		activeData=sortArrayByViewOrder(activeData)
		setViewallFilter([...activeData, ...inActiveData])
		setActiveFilter(activeData)
		setInactiveFilter(inActiveData)
		if (viewallSelect) {
			setCampaignRefactoredResponse([...activeData, ...inActiveData])
		} else if (activeSelect) {
			setCampaignRefactoredResponse(activeData)
		} else if (inactiveSelect) {
			setCampaignRefactoredResponse(inActiveData)
		}
     
		let updatedVariantAfterUpdation = allVaraints.map((el) => {
	
			if (el._id === variant._id) {
				return { ...el, status: variantStatus };
			}
			return el
		})
		setAllVariants(updatedVariantAfterUpdation)

	}
	function sortArrayByViewOrder(array) {
		const viewOrder = ['banner', 'section', 'toaster', 'popup'];
		

		array.sort((a, b) => viewOrder.indexOf(a.useCaseIds[0]?.viewStructure) - viewOrder.indexOf(b.useCaseIds[0]?.viewStructure));
		

	  
		return array;
	}
	const returnThreeDotDropDown = (item) => {
		const AggregateCampaignsDropdown: DropdownItem[] = [
			{
				_id: 1,
				value: item?.status ? "Turn Off Campaign" : "Turn On Campaign",
				callbackfunction: (event, row_id, rowItem) => {
					event.stopPropagation();
					handleCrossPopup(rowItem);
				},
			},
			{
				_id: 2,
				value: "Go to Campaign",
				callbackfunction: (event, row_id, rowItem) => {
					event.stopPropagation();

					navigate(`/my-campaigns/${row_id}`);
				},
			},
			{
				_id: 4,
				value: "Delete",
				callbackfunction: (event, row_id,rowItem) => {
					event.stopPropagation();
					setShowDeleteCampaignPopup({campaignId:rowItem,visible:true})
		
					// Function implementation goes here
				},
			},
		];

		return AggregateCampaignsDropdown;
	};

	

	const columns: IColumnType<IData>[] = [
		{
			key: "name",
			title: "Campaign",
			style: { maxWidth: "35.25rem", whiteSpace: "normal" },
			render: (_, { name }) => (
				<>
					{coreFeaturesLoading ? (
						<IconLabelSkeleton isHeader={true} isIcon={true} isDescription={false} />
					) : name ? (
						<HTMLTableCell header={name} />
					) : (
						""
					)}
				</>
			),
		},
		{
			key: "status",
			title: "Status",
			// style: { whiteSpace: "nowrap" },
			render: (_, { status }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : (
						<>
							{status === true ? (
								<Badge  style={{cusor:"pointer"}} labelText={"Active"} variant={"success"} isDot={true} />
							) : status === false ? (
								<Badge  style={{cusor:"pointer"}} labelText={"Inactive"} variant={"danger"} isDot={true} />
							) : (
								<Badge  style={{cusor:"pointer"}} labelText={"Inactive"} variant={"danger"} isDot={true} />
							)}
						</>
					)}
				</>
			),
		},
		{
			key: "useCaseIds",
			title: "Use Case",
			// style: { whiteSpace: "nowrap" },
			render: (_, { useCaseIds }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : useCaseIds?.length ? (
						useCaseIds[0]?.meta?.header
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "type",
			title: "Type",
			// style:{whiteSpace: "nowrap"}, useCaseIds[0]
			render: (_, { useCaseIds }) => {

			  return <>
				{coreFeaturesLoading ? (
				  <Skeleton width={"4.783rem"} height={"1.25rem"} />
				) : (
				  <>
					{useCaseIds ? (
					useCaseIds[0]?.viewStructure === 'popup' ? (
						<Badge  style={{cusor:"pointer"}} variant="warning" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					) : useCaseIds[0]?.viewStructure === 'toaster' ? (
						<Badge  style={{cusor:"pointer"}} variant="indigo" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					) : useCaseIds[0]?.viewStructure === 'carousel' ? (
						<Badge  style={{cusor:"pointer"}} variant="pink" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					) : useCaseIds[0]?.viewStructure === 'banner' ? (
						<Badge  style={{cusor:"pointer"}} variant="orange" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					) : useCaseIds[0]?.viewStructure === 'section' ? (
						<Badge  style={{cusor:"pointer"}} variant="purple" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					) : (
						<Badge  style={{cusor:"pointer"}} variant="blue-gray" labelText={capitalizeFirstLetterText(useCaseIds[0]?.viewStructure)} />
					)
					) : (
					"-"
					)}

				  </>
				)}
			  </>
			}
		  },
		{
			key: "segmentIds",
			title: "Segment",
			// style: { whiteSpace: "nowrap" },
			render: (_, { segmentIds }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : segmentIds?.length ? (
						segmentIds[0]?.meta?.header
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "Impressions",
			title: "Impressions",
			style: { textAlign: "center" },
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
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			render: (_, { _id }) => (
				<>
					{coreFeaturesLoading ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) :
						_id !== undefined ? formatNumber(metricsObj[_id]?.clicks , false) : '-'
					}
				</>
			),
		},
		{
			key: "metricsCR",
			title: "Conversion Rate",
			style: { textAlign: "center" },
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
	
	const getTableEmptyState =(handleCreateCampaign)=>{
		if(activeOption==="all"){
			return {
				icon:camapignTableEmptyStateIcon,
				primaryHeading:"No Campaigns created yet",
				secondaryHeading:"Create your first Campaign and start personalizing your website",
				button:<Button onClick={handleCreateCampaign} colorScheme="secondary" style={{margin:"auto",marginTop:"1.5rem"}}>
					<img src="/attryb-ui/assets/icons/button/IconPlusBlack.svg"/>
					<p class="text-sm--sb" onClick={()=>handleCreateCampaignPopup()}>Create New Campaign </p>
				</Button>
			}
		}

		if(activeOption==='inactive'){
			return {
				icon:camapignTableEmptyStateIcon,
				primaryHeading:"No Campaigns Inactive",
				secondaryHeading:"Your inactive campaigns will be listed here"
			}
		}

		if(activeOption==="active"){
			return {
				icon:camapignTableEmptyStateIcon,
				primaryHeading:"No Campaigns Active",
				secondaryHeading:"Activate a campaign to see it listed here"
			}
		}
	}
   
	return (
		<div className="usecase-container">
			<div className="usecase-heading-wrapper">
				<HeaderContent
					heading={"Campaigns"}
					description={"Manage and Configure your Campaigns"}
				/>
				<div className="usecase-right-buttons">
					<DateRangePickerComponent handleChangeEvent={handleSetDateRange} defaultStartDate={startDate} defaultEndDate={endDate} />
				</div>
			</div>

			<div className="metric-card--wrapper" style={{ marginBottom: "1.5rem" }}>
				<KpiCard numbers={formatNumber(impressions , false)} header={"Impressions"} statistic={"14.6%"} context={"vs last month"} graph={graphImpression}  />
				<KpiCard numbers={formatNumber(conversions , false)} header={"Conversions"} statistic={"16.4%"} context={"Due to Assistance"} graph={graphLoad} />
				<KpiCard numbers={`${conversionRate}`} header={"Conversion Rate"} statistic={"7.1%"} context={"vs last month"} graph={graphConversion} />
				<KpiCard numbers={`${currency} ${formatNumber(aov)}`} header={"Average Order Value"} statistic={"3.3%"} context={"Due to Assistance"} graph={graphAov} />

			</div>
			<div className="table-parent" style={{ width: "100%", marginBottom: "7.5rem" }}>
				<TableTopFunctionalityBar
					searchBarPlaceholder={""}
					addNewBtnPlaceholder={"Create New Campaign"}
					addBtnCallback={handleCreateCampaignPopup}
					viewallCallback={()=>handleViewAllCallBack(true)}
					activeCallback={handleActiveCallBack}
					inactiveCallback={handleInactiveCallback}
					activeDefault={false}
					inactiveDefault={false}
					viewallDefault={false}
					setSearchItem={setSearchItem}
					activeOption={activeOption}
                     
				/>
				<LineLoader isVisible={lineLoading} />
				{<div className={lineLoading && 'line-loading'}>
					<Table
						data={coreFeaturesLoading?[{},{},{}]:(campaigns?.filter(item => searchItem ? item.name && item.name.toLowerCase().includes(searchItem.toLowerCase()) : true))}
						columns={columns}
						showPaginationFooter={false}
						onClickRow={handleClick}
						emptyStateComponent={getTableEmptyState(()=>handleCreateCampaign)}
					/>
				</div>}
			</div>
			{/* <Button onClick={handleCreateCampaignPopup}> <img src={plusIcon}></img> */}
			{/* Create New Campaign</Button> */}
			{/* !!! we don't need these conditions in the pop-up, let's import the alert popup from attryb UI */}
			{showCreateCampaignPopup && (
				<CreateCampaignPopup
					handleCreateCampaignPopup={handleCreateCampaignPopup}
					useCase={reduxUseCases}
					segment={reduxSegments}
					isOpen={showCreateCampaignPopup}
					close={setCreateCampaignPopup}
				/>
			)}
			{showCrossIconPopup && (
				<StatusPopup
					close={() => setshowCrossIconPopup(false)}
					selectedRow={selectedRowItem}
					type={"Campaign"}
					toggleCallBack={() => fetchVariants(selectedRowItem._id)}
				/>
			)}
			{showDeleteCampaignPopup.visible&&<DeleteCampaignPopup close={(e)=>setShowDeleteCampaignPopup({campaignId:"",visible:e})} campaign={showDeleteCampaignPopup.campaignId}/>}
		</div>
	);
}
