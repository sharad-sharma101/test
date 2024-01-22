// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams , useSearchParams} from "react-router-dom";
import "./index.sass";
import HeaderContent from "../../Settings/Components/header-content";
import { Table, HTMLTableCell, Badge, NumFormatter,Button } from "@attrybtech/attryb-ui"
import { createCampaign } from "../../../services/campaigns";
import  variantService from "../../../services/configurations"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../../auth/AuthContext";
import { getCampaigns } from "../../../services/campaigns";
import featureServices from "../../../services/features";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import DateRangePickerComponent from "../../../components/DateRangePicker";
import TableTopFunctionalityBar from "../../../components/table-topfunctionality-bar";
import TableUtilBtn from "../../../components/table-util-button";
import { getSegment } from "../../../services/segments";
import { getVariants } from "../../../services/variants";
import KpiCard from "../../../components/kpi-card";
import { getCustomTemplateClick, getCustomTemplateLoad } from "../../../services/impressions";
import { CreateCampaignPopup } from "../../campaigns/createCampaignPopup";
import moment from "moment";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { calculateAverageOrderValue, convertConvertData , formatNumber, formatPercentage, getSegmentObject, transformData } from "../../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAverageOrderValue } from "../../../services/audiences";
import UserOne from "../../../assets/icons-v2/segment-active-inactive.svg"
import { callCoreFeaturesApiData } from "../../../features/core-feature-configs/core-features-slice";
import SegmentSummary from "../segmentSummary";
import Audiences from "../audience";
import camapignTableEmptyStateIcon from "../../../assets/icons-v2/et-campaign-screen icon.svg"
interface IColumnType<T> {
  key: string;
  title: string;
  style?: React.CSSProperties; 
  render?: (column: IColumnType<T>, item: T) => void;
  }

  function appendKeyValuePairs(data, keyValuePairs) {
    return data.map(obj => ({
      ...obj,
      ...keyValuePairs
    }));
  }

export default function SegmentView() {
	const [openDropdownRowId, setOpenDropdownRowId] = useState(null);

    const authContext: any = useContext(AuthContext);
    const {containerId, accountId} = authContext
    const [activeOption,setActiveOption]=useState("all")
    const [searchParams,setSearchParams]=useSearchParams()
    const [lineLoading,setLineLoading] = useState(false) 
    const [noUseCaseFlag, setNoUseCaseFlag] = useState(false);
    const [campaign, setCampaign] = useState({});
    const [segment, setSegment] =  useState({});
    const [useCases, setUseCases] =  useState([{},{},{}]);
    const [selectUseCases, setSelectUseCases] =  useState([{},{},{}]);
    const [loading,setLoading] = useState(true) 
    const navigate = useNavigate();
    const {segmentId} = useParams();
    const [segmentHeader, setSegmentHeader] = useState("Segment");
    const [segmentDescription, setSegmentDescription] = useState("Segment Description");
    const [campaignStatusObj, setCampaignStatusObj] = useState({});
    const [useCasesRefactoredResponse, setUseCasesRefactoredResponse] = useState([{},{},{}]);
    const [customTemplateClicks, setCustomTemplateClicks] = useState([]);
    const [customTemplateLoads, setCustomTemplateLoads] = useState([]);
    const [metricsObj, setMetrics] = useState({});
    const [viewallFilter, setViewallFilter] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [inactiveFilter, setInactiveFilter] = useState([]);
    const [activeSelect, setActiveSelect] = useState(false);
    const [inactiveSelect, setInactiveSelect] = useState(false);
    const [viewallSelect, setViewallSelect] = useState(false);
	  const [showCreateCampaignPopup, setCreateCampaignPopup] = useState(false);
    const [startDate, setStartDate] = useState(searchParams.get("startDate") ? searchParams.get("startDate") : '');
	  const [endDate, setEndDate] = useState(searchParams.get("endDate") ? searchParams.get("endDate") : '');
    const [status, setStatus] = useState(searchParams.get("status") ? searchParams.get("status") : null)
    const [searchItem, setSearchItem] = useState("");
    const queryParams = new URLSearchParams(window.location.search);
    const queryStatus = queryParams.get("status")
    const [conversions, setConversions] = useState("-");
    const [graphImpression, setgraphImpression] = useState([])
    const [graphLoad, setgraphLoad] = useState([])
    const [graphConversion, setgraphConversion] = useState([])
	  const [conversionRate, setConversionRate] = useState("-");
	  const [impressions, setImpressions] = useState("-")
    const [graphAov, setgraphAov] = useState([])
    const [aov, setAov] = useState("0")   
	  const [currency, setCurrency] = useState("")   
    const [currentActiveOption, setCurrentActiveOption] = useState(0)
    const {reduxVariants,reduxCampaigns,reduxUseCases,coreFeaturesLoading,reduxSegments}=useAppSelector((store)=>store.coreFeaturesSlice)
    const screensArray = [
      {
        name: "Campaigns" , 
        query: "tab=campaigns"
      },
      {
        name: "meta Data" , 
        query: "tab=meta_data"
      },
      {
        name: "Segment Rule",
        query: "tab=segment_rule"
      }
    ]

    useEffect(() => {
    if(authContext?.accountId && authContext?.containerId)
        fetchCampaigns();
        fetchSelectedSegment();
        fetchActiveVariants();
        fetchUseCases();
    }, [authContext?.containerId, authContext?.accountId,reduxCampaigns]);

    useEffect(() => {
    if(authContext?.accountId && authContext?.containerId && authContext?.containerData?.domainName){
      fetchLoadClicks();
    }
    }, [authContext?.containerId, authContext?.accountId, authContext?.containerData , startDate, endDate]);

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
    useEffect(() => {
      if (useCases.length > 0 && useCases[0].hasOwnProperty('campaignName')) {
        refactorAndSortResponse(useCases, campaignStatusObj);
      }
      else{
        setLoading(true);
      }
    }, [useCases, campaignStatusObj]);

        
    const setQueryTotheUrl=(statusCampaign)=>{
      setSearchParams({status:statusCampaign})
    }

    const handleViewAllCallBack = () => {
      setViewallSelect(true);
      setActiveSelect(false);
      setInactiveSelect(false);
      if(queryStatus!=="all"){
        setQueryTotheUrl("all")
        setActiveOption("all")
      }
      setUseCasesRefactoredResponse(viewallFilter);
      }
      const handleActiveCallBack = () => {
        setViewallSelect(false);
        setActiveSelect(true);
        setInactiveSelect(false);
        setInactiveSelect(true)
        
        if(queryStatus!=="active"){
          setActiveOption("active")
          setQueryTotheUrl("active")
        }
      setUseCasesRefactoredResponse(activeFilter)
      }

      const handleInactiveCallback = () => {
        setViewallSelect(false);
        setActiveSelect(false);
        setInactiveSelect(true);
        setInactiveSelect(true);
        if(queryStatus!=="inactive"){
          setActiveOption("inactive")
          setQueryTotheUrl("inactive")
        }
      setUseCasesRefactoredResponse(inactiveFilter)
      }

  const handleCreateCampaignPopup = () => {
		setCreateCampaignPopup((prevState) => !prevState);
	};

  const fetchLoadClicks = async () => {
    try{
        if(authContext?.containerId && startDate && endDate){
          setLineLoading(true)
          const loadsPromise = getCustomTemplateLoad(authContext?.containerId, `segmentId=${segmentId}${(startDate && endDate) && '&startDate='+startDate+'&endDate='+endDate}`);
          const clicksPromise = getCustomTemplateClick(authContext?.containerId, `segmentId=${segmentId}${(startDate && endDate) && '&startDate='+startDate+'&endDate='+endDate}`);
      
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
    const totalClicks = (customTemplateClicks.filter(obj => obj.use_case_id === row_id)).length;
    const totalLoads = (customTemplateLoads.filter(obj => obj.use_case_id === row_id)).length;
    metricsObj[row_id].clicks = totalClicks;
    metricsObj[row_id].loads = totalLoads;
    

    if(totalClicks === 0) {
        metricsObj[row_id].ratio = "-";
      return "-";
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
    const conversionRate = isNaN(precisePercentage) || precisePercentage === '0.00' || !isFinite(precisePercentage) ? '-' : precisePercentage;

	
		setConversions(impressions);
		setImpressions(onloads);

    return `${metricsObj[row_id].ratio}`;
  };
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
  
  const computeMetricsPageId = (row_id) => {
    const totalClicks = (customTemplateClicks.filter(obj => obj.segment_id === row_id)).length;
    const totalLoads = (customTemplateLoads.filter(obj => obj.segment_id === row_id)).length;

    const percentage = totalLoads!==0 ? (totalClicks/totalLoads) * 100 : 0;
    const precisePercentage = percentage >= 10 ? percentage.toFixed(1) : percentage.toFixed(2);

    const conversionRate = isNaN(precisePercentage) || precisePercentage === '0.00' || !isFinite(precisePercentage) ? '-' : precisePercentage;
    const conversions = totalClicks === 0 ? '-': totalClicks;
    const impressions = totalLoads === 0 ? '-' : totalLoads;

    return {conversionRate, conversions, impressions};
  };


  function refactorAndSortResponse(responseArray, stateObject){
    if(responseArray.length === 0 || !responseArray[0].hasOwnProperty('campaignName')) {
      return
    }
    const objKeys = Object.keys(stateObject);
    const sortedArray = [];
    const tempActive = [];
    objKeys.forEach((key) => {
      const matchingObjects = responseArray.filter((obj) => obj.campaignName === key).map((obj) => ({ ...obj, status: true }));
    
      sortedArray.push(...matchingObjects);
      tempActive.push(...matchingObjects);
    })
    setActiveFilter(tempActive);
    const remainingObjects = responseArray.filter((obj) => !objKeys.includes(obj.campaignName)).map((obj) => ({ ...obj, status: false}));
    sortedArray.push(...remainingObjects);

    setInactiveFilter(remainingObjects);

    sortedArray.forEach((item) => {
      if(item){
        metricsObj[item._id] = {clicks: 0, loads: 0};
        setMetrics(metricsObj)
      }
    })
    setViewallFilter(sortedArray);
   if(status==null){
    if(tempActive.length==0){
      setUseCasesRefactoredResponse([...tempActive , ...remainingObjects])
      setActiveOption("all")
      handleViewAllCheck()
    }else{
      setUseCasesRefactoredResponse([...tempActive ])
    setActiveOption('active')
    handleActiveCheck()
    }
   }else{
        if(status === 'all') {
          setUseCasesRefactoredResponse([...tempActive , ...remainingObjects])
          setActiveOption("all")
          handleViewAllCheck()
      }
      else if (status === 'inactive')	{
          setUseCasesRefactoredResponse([...remainingObjects])
          setActiveOption('inactive')
          handleInactiveCheck()
      }
      else if (status === 'active')	{
        setUseCasesRefactoredResponse([...tempActive ])
        setActiveOption('active')
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

	const functionFilterStatus = (data) => {
		const trueStatusArray = data.filter((item) => item.status === true);
		const falseStatusArray = data.filter((item) => item.status === false);
		return [...trueStatusArray, ...falseStatusArray];
	};
const dispatch=useAppDispatch()
	const fetchActiveVariants = async () => {
    const vResp = []
    for(let el of reduxVariants){
      if(el?.segmentId?._id===segmentId&&el.status=="active"){
        vResp.push(el)
      }
    }
		const Obj = {};
		vResp.forEach((variant) => {
   
      if(variant?.campaignId){
        const header = variant?.campaignId?.name;
        const variantStatus = variant.status==='active' ? true : false;
        Obj[header] = variantStatus;
      }
		})

		// setUseCaseStatusObj(Obj);
    setCampaignStatusObj(Obj);
    }

  const fetchCampaigns = async () => {

    const campaigns =[];
   
    for(let el of reduxCampaigns){
      if(el.segmentIds[0]?._id==segmentId){
        campaigns.push(el)
      }
    }
    const useCaseIdsArray = campaigns.flatMap((campaign) => {
      return campaign.useCaseIds.map((usecase) => {
        return {
          ...usecase,
          campaignName: campaign.name,
          campaignId: campaign._id,
          // campaignStatus: campaign.status
        };
      });
    });

    if(campaigns.length){
        setCampaign(campaigns[0]);
        setSegment(campaigns[0]?.segmentIds[0] || {})
      // before setting the useCases add key value pair 
        // const updatedUseCases = appendKeyValuePairs(campaigns[0]?.useCaseIds || [],  {campaignName: campaigns[0]?.name})
        const filteredUpdatedUseCases = functionFilterStatus(useCaseIdsArray);
        setUseCases(useCaseIdsArray)
        setLoading(false);  
    }

    else{

        setNoUseCaseFlag(true);
        const resp = reduxUseCases
        const new_resp = appendKeyValuePairs(resp, {campaignName: campaigns[0]?.name})
        const newUpdatedUseCases = functionFilterStatus(new_resp);
        setUseCases([]);
        setLoading(false);
        setUseCasesRefactoredResponse([])
      }
  }

  const fetchUseCases = async () => {
    let resp = reduxUseCases;
		setSelectUseCases(resp);
	};
  
  const handleCreateNewVariant=async(id:string, usecaseName:string)=>{
    try {
      let campaign , variant;
      const segmentObj = getSegmentObject(reduxSegments , segmentId)
      if(segmentObj.type === "custom"){
        campaign = await createCampaign({useCaseIds:[id],customSegmentIds:[segmentId], name:`${usecaseName} | ${segment?.meta?.header||"Segment"}`,containerId, accountId   })
        variant = await variantService.postConfiguration({  accountId, containerId,customSegmentId: segmentId ,useCaseId: id,campaignId:campaign._id, configuration:{}})
      }else{
        campaign = await createCampaign({useCaseIds:[id], segmentIds:[segmentId], name:`${usecaseName} | ${segment?.meta?.header||"Segment"}`,containerId, accountId   })
        variant = await variantService.postConfiguration({  accountId, containerId,segmentId: segmentId,useCaseId: id,campaignId:campaign._id, configuration:{}})
      }
      dispatch(callCoreFeaturesApiData(true))
      navigate(`/variants/${variant._id}/template`) 
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSelectedSegment = async () => {
    let notFoundSegment=false
    for(let el of reduxSegments){
      if(el._id===segmentId){
        notFoundSegment=true
        setSegment(el)
        return;
      }
    }
    if(!coreFeaturesLoading&&!notFoundSegment){
      navigate("/not-found")
    } 
  }
  const handleCampaignLink = (selectedId) => {
    navigate(`/segments/all/${segmentId}/my-campaigns/${selectedId}`);
  }

  const handleDropdown = (event, rowItem) => {
		event.stopPropagation();
		if (openDropdownRowId === rowItem._id) {
			setOpenDropdownRowId(null);
		} else {
			setOpenDropdownRowId(rowItem._id);
		}
	};


  const handleClick = (e, item: T) => {
    if(coreFeaturesLoading)
        return
    // if the noUSeCaseFlag is false, which means that the segments are available and onClick redirect this to variant page
    if(!noUseCaseFlag){
        navigate(`/segments/all/${segmentId}/my-campaigns/${campaign?._id}`);
    }

    //if the noUSeCaseFlag is true then it means there are no segments avaliable --> /config/template
    else{
        // navigate(`/templates`);
        // !!! create campaign then create a avariant then navigate to poup with variant ID
        handleCreateNewVariant(item._id)
        
    }

  }
  interface DropdownItem {
    _id: number;
    value: string;
    callbackfunction: () => void    
  }
    
  const returnThreeDotDropDown = (item) => {
    const segmentList: DropdownItem = [

       {
         _id: 1,
         value: item.campaignId ? "Go to Campaign" : "Create Campaign",
         callbackfunction: (event, row_id, rowItem) => {
           event.stopPropagation();
           if (rowItem?.campaignId) {
             navigate(`/segments/all/${segmentId}/my-campaigns/${rowItem?.campaignId}`);
           } else {
             handleCreateNewVariant(row_id, rowItem?.meta?.header)
           }
         },
       },
  ];

return segmentList;

}  

    function capitalizeFirstLetterOfWords(inputString) {
      if (typeof inputString !== 'string' || inputString.length === 0) {
        return '';
      }
      
      return inputString
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      }

      const handleCampaignClick=(e,item)=>{
        if(item?.campaignId) handleCampaignLink(item?.campaignId)
      }
    
  const columns: IColumnType<IData>[] = [
    {
      key: "campaignNameCell",
      title: "Campaign",
      style:{whiteSpace: "normal", maxWidth: "34.25rem"},
      render: (_, campaignNameCell) => (
        <div className="text-sm--sb">
          {coreFeaturesLoading ? (
            <IconLabelSkeleton isDescription={false} isHeader={true} isIcon={true}/>
          ) : (
            campaignNameCell?.campaignName ? (
              <HTMLTableCell header={capitalizeFirstLetterOfWords(campaignNameCell?.campaignName)}/>	
            ) : (
              "-"
            )
          )}
        </div>
      )
    },
    {
      key: "meta",
      title: "Use Case",
      style:{maxWidth: "35.25rem"},
      render: (_, meta) => (  
        <>
          {coreFeaturesLoading ?
              <Skeleton width={"4.783rem"} height={"1.25rem"} />
              :
              meta?.meta?.header
          }
        </>
      )
    },
    {
      key: "campaignName",
      title: "Status",
      // style:{whiteSpace: "nowrap"},
      render: (_, campaignName) => (
<>
          {coreFeaturesLoading ? (
            <Skeleton width={"4.783rem"} height={"1.25rem"} />
          ) : (
            <>
              {campaignStatusObj[campaignName?.campaignName]=== true ? (
                <Badge  style={{cusor:"pointer"}} labelText={"Active"} variant={'success'} isDot={true} />
              ) : campaignStatusObj[campaignName?.campaignName] === false ? (
                <Badge  style={{cusor:"pointer"}} labelText={"Inactive"} variant={'danger'} isDot={true} />
              ) : (
                <Badge  style={{cusor:"pointer"}} labelText={'Inactive'} variant={'danger'} isDot={true} />
              )}
            </>
          )}
        </>
      )
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
          _id !== undefined ? formatNumber(metricsObj[_id].loads , false) : '-'
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
          _id !== undefined ? formatNumber(metricsObj[_id].clicks , false)  : '-'
          }
        </>
      ),
    },
    {
      key: "crCell",
      title: "Conversion Rate",
      style:{whiteSpace: "nowrap" , textAlign: "center"},
      headerStyle : { textAlign: "center", justifyContent: "center" },
      render: (_, { _id }) => (

        <>
        {coreFeaturesLoading ? (
          <Skeleton width={"6.783rem"} height={"1.25rem"} />
        ) : (
          _id !== undefined ? formatPercentage(computeMetrics(_id)) : "-"
        )}

        </>
      ),
    },

    {
			key: "",
			title: "",
      style: {width: '4.5rem' },
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
			}
		  }
  
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
        icon:UserOne,
        primaryHeading:"No Inactive Segment",
        secondaryHeading:"Your Inactive Segments will be listed here  "
      }
    }

    if(activeOption==="active"){
      return {
        icon:UserOne,
        primaryHeading:"No Active Segment",
        secondaryHeading:"Activate a Segment to see it listed here"
      }
    }
  }
  useEffect(() => {
    setSearchParams(screensArray[currentActiveOption].query)
  }, [currentActiveOption])
  
 
  function capitalizeFirstLetter(input: string): string {
    if (!input)  return ''      
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  function componentToShow (index: number) {
    if(index === 1)
        return <SegmentSummary/>
    else 
        return <Audiences />
  }
    return(
        <div className="usecase-container">
             <div className="usecase-heading-wrapper">
             {!segment.meta?<div className="campaign-name-header-loader-skeleton">
              <Skeleton width={"25rem"} height={"2.6344rem"}/>
              <Skeleton width={"16.125rem"} height={"1.4rem"}/>
             </div>:<HeaderContent heading={segment?.meta?.header} description={segment?.meta?.description} />}
             <div className="usecase-right-buttons">
             <div className="audiences-right-buttons">
                <Button  variant="solid"  colorScheme="primary" onClick={()=>{navigate("/audiences/find-visitors?filters=true")}}>
                {/* state={checkedObject.length ? "" : "disabled"} onClick={handleCreateNewSegment}  */}
                  <img src="/attryb-ui/assets/icons/button/plusButtonIcon.svg"></img>
                  <p className="text-sm--sb">Create New Segment</p>
                </Button>
                <DateRangePickerComponent handleChangeEvent={handleSetDateRange} defaultStartDate={startDate} defaultEndDate={endDate}/>
            </div>
            {/* <Button style={{minWidth:"11.35rem",justifyContent:"center"}} onClick={()=>handleCreateNewVariant()} state={loading&&"loading"} variant="solid"><img src={plusIcon}></img> Button Name</Button> */}

            </div>
            </div>
            <div className="list-of-segment-summary">
              <div className="left-section-header list-of-tabs">
                {
                    screensArray?.map((element: any , index:number) => (
                        <div onClick={()=>{setCurrentActiveOption(index)}} className={`selecting-template-heading ${ currentActiveOption === index? 'selected-option' : ''}`} >
                          <p className="text-sm" >{capitalizeFirstLetter(element.name)}</p> 
                        </div>
                    ))
                }
              </div>
            </div>
    {
      currentActiveOption === 0 ? 
      (<>
        <div className="metric-card--wrapper" style={{ marginBottom: "1.5rem" }}>

            <KpiCard numbers={formatNumber(impressions , false)} header={"Impressions"} statistic={"14.6%"} context={"vs last month"} graph={graphImpression}  />
            <KpiCard numbers={formatNumber(conversions , false)} header={"Conversions"} statistic={"16.4%"} context={"Due to Assistance"} graph={graphLoad} />
            <KpiCard numbers={`${conversionRate}`} header={"Conversion Rate"} statistic={"7.1%"} context={"vs last month"} graph={graphConversion} />
            <KpiCard numbers={`${currency} ${formatNumber(aov)}`} header={"Average Order Value"} statistic={"3.3%"} context={"Due to Assistance"} graph={graphAov} />
				
			  </div>

            {/* any segment/usecase/campaign subheading wrapper will be this one, the className will be changed */}

            <div className="usecase-heading-wrapper">
             <HeaderContent heading={"Campaigns"} description={"Manage Campaigns applicable for this Segment"} headingTypeClass={"text-lg--sb"} descriptionTypeClass={"text-sm"}/>
                <div className="usecase-right-buttons">
            {/* <Button variant="solid" colorScheme="secondary">
              <img src={plusIconBlack}></img>
              Add New Use Case
            </Button> */}
                </div>
            </div>			
            
            <div className="table-parent" style={{width: "100%", marginBottom: "7.5rem"}}>
              <TableTopFunctionalityBar searchBarPlaceholder={""} 
              addNewBtnPlaceholder={"Create New Campaign"}
              addBtnCallback={handleCreateCampaignPopup}
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
            {<div className={lineLoading && 'line-coreFeaturesLoading'}>
                <div className="segments-aggregate-wrapper">
                    <Table 
                      data={coreFeaturesLoading?[{},{},{}]:(useCasesRefactoredResponse.filter(item => searchItem ? item.name && item.name.toLowerCase().includes(searchItem.toLowerCase()) : true))}
                      columns={columns} 
                      showPaginationFooter={false} 
                      emptyStateComponent={getTableEmptyState(()=>handleCreateCampaign)}
                      onClickRow={handleCampaignClick}
                      />
                </div>
            </div>}
        </div>
        {showCreateCampaignPopup && (
          <CreateCampaignPopup
            handleCreateCampaignPopup={handleCreateCampaignPopup}
            useCase={selectUseCases}
            segment={[segment]}
            isOpen={showCreateCampaignPopup}
            close={setCreateCampaignPopup}
          />
        )}
      </>) :
      componentToShow(currentActiveOption)
    }



        </div>
    )
}