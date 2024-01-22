// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { VarientDeletePopup } from "./VariuentDeletePopUp";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./index.sass";
import HeaderContent from "../../Settings/Components/header-content";
import { Table, HTMLTableCell, Badge, NumFormatter, Button } from "@attrybtech/attryb-ui"
import  variantService from "../../../services/configurations"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../../auth/AuthContext";
import { getCampaign } from "../../../services/campaigns";
import { getVariants, putVariants } from "../../../services/variants";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import DateRangePickerComponent from "../../../components/DateRangePicker";
import TableTopFunctionalityBar from "../../../components/table-topfunctionality-bar";
import TableUtilBtn from "../../../components/table-util-button";
import KpiCard from "../../../components/kpi-card";
import { StatusPopup } from "../statusPopup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setAlertVisible } from "../../../features/globalConfigs/global-slice";
import { getCustomTemplateClick, getCustomTemplateLoad } from "../../../services/impressions";
import moment from "moment";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { calculateAverageOrderValue, convertConvertData , convertTimeToUtcZone, formatNumber, formatPercentage, getSegmentObject, transformData } from "../../../utils/helpers";
import { xor } from "lodash";

import { addNewVariantInRedux, callCoreFeaturesApiData, handleDeleteVariantInRedux, handleUpdateCampaignInRedux, setVariantViewStatus, updateVaraintStatusInRedux , setStatusTabTitle } from "../../../features/core-feature-configs/core-features-slice";
import { variantStatus } from "../../../utils/constants";

import { putCampaign } from "../../../services/campaigns";
import { getAverageOrderValue } from "../../../services/audiences";


interface IColumnType<T> {
  key: string;
  title: string;
  style?: React.CSSProperties; 
  render?: (column: IColumnType<T>, item: T) => void;
    
  }


export default function CampaignView() {
  const {reduxCampaigns,reduxVariants,coreFeaturesLoading, reduxSegments}=useAppSelector((store)=>store.coreFeaturesSlice)
  const [deleteLoadder, setDeleteLoadder] = useState(false)
  const [deleteVarientState, setDeleteVarientState] = useState(null);
  const [showDeleteVarientPopup, setShowDeleteVarientPopup] = useState(false)
  const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
  
  const queryParams = new URLSearchParams(window.location.search);
  const queryStatus = queryParams.get("status");	
    const authContext: any = useContext(AuthContext);
    const {containerId, accountId} = authContext
    const [lineLoading,setLineLoading] = useState(false) 
    const [noVariantFlag, setNoVariantFlag] = useState(false);
    const [variantLoader,setVariantLoader]=useState(false)
    const [campaign, setCampaign] = useState({});
    const [variants, setVariants] = useState([]);
    const [loading,setLoading] = useState(true)
    const [startDate, setStartDate] = useState("");//start-date
    const [endDate, setEndDate] = useState(""); //end-date
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const [activeSelect,setActiveSelect]=useState(false)
    const [inactiveSelect,setInactiveSelect]=useState(false)
    const [viewallSelect,setViewallSelect]=useState(false)

    const [activeStatusUseCaseId, setActiveStatusUseCaseId] = useState('');
    const [activeStatusSegmentId, setActiveStatusSegmentId] = useState('');
    const [activeIndexVariantId, setActiveIndexVariantId] = useState('')
    const [activeIndexVariantStatus, setActiveIndexVariantStatus] = useState('')
    const [activeIndexVariantDraftStatus, setActiveIndexVariantDraftStatus] = useState(true);
    const [activeIndexVariant, setActiveIndexVariant] = useState({});
    const [campaignStatus, setCampaignStatus] = useState(null);
    const [variantViewStatus,setVariantViewStatus]=useState("")
    const [activeFilter,setActiveFilter]=useState([])

    const [showCrossIconPopup, setshowCrossIconPopup] = useState(false);
    const [selectedRowItem, setSelectedRowItem] = useState({});
    const [showCrossIconPopup2, setshowCrossIconPopup2] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [customTemplateClicks, setCustomTemplateClicks] = useState([]);
    const [customTemplateLoads, setCustomTemplateLoads] = useState([]);
    const [metricsObj, setMetrics] = useState({});
    const [conversions, setConversions] = useState("-");
    const [conversionRate, setConversionRate] = useState("-");
    const [searchItem, setSearchItem] = useState("");
    const [viewallFilter,setViewallFilter]=useState([])
    const [searchParams,setSearchParams]=useSearchParams()
    const [impressions,setImpressions]=useState("-")
    const [inactiveFilter,setInactiveFilter]=useState([])
    const [graphImpression, setgraphImpression] = useState([])
    const [graphLoad, setgraphLoad] = useState([])
    const [graphConversion, setgraphConversion] = useState([])
    const [aov, setAov] = useState("0")
    const [graphAov, setgraphAov] = useState([])
    const [currency, setCurrency] = useState("")

    const dispatch=useAppDispatch()
    
    const handleOpenAlert = () => {
      setShowAlert(true);
    };


    const handleActiveCallBack=()=>{
      if(queryStatus!=="active"){
        setQueryTotheUrl("active")
      }
      setVariantViewStatus("active")
      setViewallSelect(false)
      setInactiveSelect(false)
      setActiveSelect(true)
    
    }
     
    const setQueryTotheUrl=(statusCampaign)=>{
      setSearchParams({status:statusCampaign})
    }

    const handleInactiveCallback=()=>{
   if(queryStatus!=="inactive"){
    setQueryTotheUrl("inactive")
   }
      setVariantViewStatus("inactive")
      setViewallSelect(false)
      setInactiveSelect(true)
      setActiveSelect(false)
    }

    const handleViewAllCallBack=()=>{
      if(queryStatus!=="all"){
        setQueryTotheUrl("all")
      }
      setViewallSelect(true)
      setInactiveSelect(false)
      setActiveSelect(false)
      setVariantViewStatus("all")
    }

    const renderUpdatedVariants=(itemId,updatedStatus)=>{
     
        let updatedVariants=variants.map((item)=>{
          if(item._id===itemId){
           return {...item, status:updatedStatus}
          }else{
            if(updatedStatus==="active"){
              return {...item, status:updatedStatus==="active"?"inactive":"active"}
            }
            return {...item}
          }

        })

        if(updatedStatus==="inactive"){
          let count=0;
          for(let el of updatedVariants){
            if(el.status==="inactive"){
              count++
            }else{
              setCampaignStatus(true)
              break
            }
          }
            if(count===variants.length){
              setCampaignStatus(false)
            }
         
          }else{
            setCampaignStatus(true)
          }
          
        setVariants(functionFilterStatus(updatedVariants))
        
    }
    useEffect(()=>{
      setVariantViewStatus(queryStatus||"")
    },[])
    useEffect(() => {
      const impressionData = transformData(customTemplateLoads , startDate , endDate)
      const loadData = transformData(customTemplateClicks , startDate , endDate)
      if(startDate && endDate)
        averageOrderValue()
      setImpressions(customTemplateLoads.length)
  	  setConversions(customTemplateClicks.length)
      setgraphImpression(impressionData)
      setgraphLoad(loadData)
      const conversionData = convertConvertData(impressionData , loadData)
      setgraphConversion(conversionData)
    }, [customTemplateClicks ,customTemplateLoads ])
    const handleCloseAlert = () => {
      setShowAlert(false);
    };
    const handleCrossPopup = (rowItem) => {
      setSelectedRowItem(rowItem)
      setshowCrossIconPopup((prevState) => !prevState);
    };
    const handleCrossPopup2 = () => {
      setshowCrossIconPopup2((prevState) => !prevState);
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
    useEffect(() => {
        if(authContext.accountId && authContext.containerId){ 
          fetchCampaign();
          fetchVariants();
        }
    }, [authContext?.containerId, authContext?.accountId,reduxCampaigns,queryStatus,campaign,variantViewStatus,reduxVariants,customTemplateClicks]);

    useEffect(() => {
      if(authContext.accountId && authContext.containerId && authContext?.containerData?.domainName){
        fetchLoadClicks();
      }
    }, [authContext?.containerId, authContext?.accountId, authContext?.containerData, startDate, endDate]);
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
    const fetchLoadClicks = async () => {
      try{
          if(authContext?.containerId && startDate && endDate ){
            setLineLoading(true)
            const loadsPromise = getCustomTemplateLoad(authContext?.containerId, `campaignId=${campaignId}${(startDate && endDate) && '&startDate='+startDate+'&endDate='+endDate}`);
            const clicksPromise = getCustomTemplateClick(authContext?.containerId, `campaignId=${campaignId}${(startDate && endDate) && '&startDate='+startDate+'&endDate='+endDate}`);
      
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
 
    
      const totalClicks = (customTemplateClicks.filter(obj => obj.variant_id === row_id)).length;
      const totalLoads = (customTemplateLoads.filter(obj => obj.variant_id === row_id)).length;
      metricsObj[row_id].clicks = totalClicks;
      metricsObj[row_id].loads = totalLoads;
      if(totalClicks === 0) {
        metricsObj[row_id].ratio = "-";

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
  
      // if (isNaN(crP) || crP === '0.00' || !isFinite(crP)) {
      //   setConversionRate('-');
      //   } else {
      //   setConversionRate(formatNumber(crP) + "%");
      //   }
        
  
    
      impressions = impressions === 0 ? "-" : impressions;
      onloads = onloads === 0 ? "-" : onloads;
      const conversionRate = isNaN(precisePercentage) || precisePercentage === '0.00' || !isFinite(precisePercentage) ? '-' : precisePercentage;

    
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

    const computeMetricsPageId = (row_id) => {

      const totalClicks = (customTemplateClicks.filter(obj => obj.campaign_id === row_id)).length;
      const totalLoads = (customTemplateLoads.filter(obj => obj.campaign_id === row_id)).length;

      const percentage = totalLoads!==0 ? (totalClicks/totalLoads) * 100 : 0;
      const precisePercentage = percentage >= 10 ? percentage.toFixed(1) : percentage.toFixed(2);
  
      const conversionRate = isNaN(precisePercentage) || precisePercentage === '0.00' || !isFinite(precisePercentage) ? '-' : precisePercentage;
      const conversions = totalClicks === 0 ? '-': totalClicks;
      const impressions = totalLoads === 0 ? '-' : totalLoads;
      return {conversionRate, conversions, impressions};
    };

    const handleSetDateRange = (dateStr) => {
      const dateRangeArray = dateStr.split(" - ")
      let start = moment.utc(dateRangeArray[0], 'MMM DD, YYYY').toDate();
      let end = moment.utc(dateRangeArray[1], 'MMM DD, YYYY').toDate();
      setStartDate(start.toISOString())
      setEndDate(end.toISOString())
    };
    useEffect(() => {

      if(activeIndexVariantStatus === 'active' && activeIndexVariantDraftStatus===true){
        updateVariantStatus(activeIndexVariantId);
      }
      else{
        return
      }

    }, [activeIndexVariantId, activeIndexVariantStatus])

    const fetchCampaign = async () => {
      let notFoundCampaign=-1
      for(let el of reduxCampaigns){
          if(el._id==campaignId){
          setCampaign(el);  
          setActiveStatusUseCaseId(el?.useCaseIds[0]._id)
          setActiveStatusSegmentId(el?.segmentIds[0]._id)
          notFoundCampaign=1
          break;
        }else{
          notFoundCampaign=0
        }
      }
      
      console.log(coreFeaturesLoading,"coreFeaturesLoading",notFoundCampaign,"notFoundCampaign",reduxCampaigns,"reduxCampaigns")
      if(!coreFeaturesLoading&&notFoundCampaign==0){
          navigate("/not-found")
      }
      if(!coreFeaturesLoading&&reduxCampaigns.length==0&&notFoundCampaign==-1){
        navigate("/not-found")
      }
    }
 
      
      const functionFilterStatus = (data) => {

        const newData = data.map((item) => {
          if (item.status) {
            // Create a new object with lowercaseStatus property 
            return { ...item, lowercaseStatus: item.status.toLowerCase() };
          }
          return item; // Return the original object if status is missing or falsy
        });
        
       
        const statusOrder = { active: 1, scheduled: 2, inactive: 3 };
      
        newData.forEach((item) => {
          item.lowercaseStatus = item.status.toLowerCase();
        });
      
        newData.sort((a, b) => {
          return statusOrder[a.lowercaseStatus] - statusOrder[b.lowercaseStatus];
        });
      
        newData.forEach((item) => {
          delete item.lowercaseStatus;
        });
      
        return newData;
      };
      
      // if variant is on, only one variant will be on and will be on the top
      
      const fetchVariants = async () => {
        
        const updatedVariants=reduxVariants.filter((el)=>el.campaignId._id==campaignId&&el.isDeleted==false)
        const activeVaraints=reduxVariants.filter((el)=>el.campaignId._id==campaignId&&el.isDeleted==false&&el.status=="active")
        let finalVariants=[]
        setActiveFilter(activeVaraints)
        for(let el of updatedVariants){
       
          if(el.status==variantViewStatus){
              finalVariants.push(el)    

          }
        }
        if(variantViewStatus==="active"){
          handleActiveCheck()
        }
        if(variantViewStatus==="inactive"){
          setInactiveFilter(finalVariants)
         handleInactiveCheck()
        }
        if(finalVariants.length==0&&variantViewStatus=="all"){
          finalVariants=updatedVariants
          setViewallFilter(updatedVariants)
          handleViewAllCheck()
        }

      
        if(variantViewStatus===""&&campaign){
          if(activeVaraints.length!==0){
            setVariantViewStatus('active')
            handleActiveCheck()
          }else{
            if(Object.keys(campaign).length!==0){
              // handleViewAllCallBack()
              setVariantViewStatus('all')
              handleViewAllCheck()
            }
          }

        }

    
       

        const newResp = functionFilterStatus(updatedVariants);
        setCampaignStatus(newResp[0]?.status === 'active' ? true : false)
        if(newResp.length){
          
            setVariants(finalVariants || []);
   
            const filteredData = newResp.filter((item) => item.isDraft === false);
  
 
            if(filteredData.length){
              setActiveIndexVariant(filteredData[0]);
              setActiveIndexVariantId(filteredData[0]?._id)
              setActiveIndexVariantStatus(filteredData[0]?.status)
              setActiveIndexVariantDraftStatus(filteredData[0]?.isDraft);
            }
            else{
              setActiveIndexVariant(newResp[0]);
              setActiveIndexVariantId(newResp[0]?._id)
              setActiveIndexVariantStatus(newResp[0]?.status)
              setActiveIndexVariantDraftStatus(newResp[0]?.isDraft);
            }
            newResp.forEach((item) => {
              if(item){
              
                if(!metricsObj[item._id]){

                  metricsObj[item._id] = {clicks: 0, loads: 0};
                }
                setMetrics(metricsObj)
              }
            })
            setLoading(false);
        }
        else{
          
          setVariants(finalVariants)
          setLoading(false)
        }

      }

    const handleCreateNewVariant=async()=>{
                 
      setVariantLoader(true)
     try {
      const segmentObj = getSegmentObject(reduxSegments , activeStatusSegmentId)
      let variant
      if(segmentObj.type === 'custom')
          variant = await variantService.postConfiguration({  accountId, containerId,customSegmentId: activeStatusSegmentId, useCaseId: activeStatusUseCaseId , campaignId: campaign._id, configuration:{}})
      else 
          variant = await variantService.postConfiguration({  accountId, containerId,segmentId: activeStatusSegmentId, useCaseId: activeStatusUseCaseId , campaignId: campaign._id, configuration:{}})

      dispatch(addNewVariantInRedux(variant))
      navigate(`/variants/${variant._id}/template`)
      setVariantLoader(false)
    
     } catch (error) {
      console.log(error)
      setVariantLoader(false)
     }
    }

    const handleClick = (e, item: T) => {
      if(coreFeaturesLoading)
        return
      
        if(queryStatus){
          dispatch(setStatusTabTitle(queryStatus))
        }
        if(item.progress?.completed?.route!==""){
        navigate(`/variants/${item._id}/${item.progress?.completed?.route}`)
        }else{
        navigate(`/variants/${item._id}/template`)
        }
      // here manage the click of the variant 

    }

    const handleDelete = async(rowItem) => {
      setDeleteLoadder(true)
    try {
      const undeletedVariants = [];
  
      if (rowItem.status === 'active') {
        setCampaignStatus(false);
      }
  
     await putVariants(rowItem._id, { isDeleted: true, status: "inactive" });
     dispatch(handleDeleteVariantInRedux({variant:rowItem}))
      dispatch(setAlertVisible({ theme: "success", content: "Variant Deleted Successfully", visible: true }));
      dispatch(callCoreFeaturesApiData(true))
      variants.forEach((item) => {
        if (item._id !== rowItem._id) {
          undeletedVariants.push(item);
        }
      });
      
      setVariants(undeletedVariants);
      setDeleteLoadder(false)
      
      setShowDeleteVarientPopup(false);
    } catch (error) {
      dispatch(setAlertVisible({ theme: "warning", content: "Failed to Delete Variant", visible: true }));
      setDeleteLoadder(false)
      setShowDeleteVarientPopup(false);
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

    const updateVariantStatus = async(rowItem) => {
      const updatedStatus = rowItem?.status === 'inactive' ? 'active' : 'inactive';
      try {
      
     const updatedVariantStatus=await  putVariants(rowItem._id, {status: updatedStatus});
     
     if(updatedVariantStatus){
       renderUpdatedVariants(rowItem._id,updatedStatus)
       dispatch(updateVaraintStatusInRedux({variant:rowItem,status:updatedStatus}))
      if(updatedStatus==="active"){
       dispatch(setAlertVisible({theme:"success",content:`Variant Turned On, Campaign is now Active`,visible:true}))
      }else{
        dispatch(setAlertVisible({theme:"danger",content:"Variant Turned Off, Campaign is now Inactive ",visible:true}))
        
      }
    }
      } catch (error) {
        if(updatedStatus==="active"){
          dispatch(setAlertVisible({theme:"warning",content:`Failed to Turn On ${rowItem.name} Variant`,visible:true}))
        }else{
          dispatch(setAlertVisible({theme:"warning",content:`Failed to Turn Off`,visible:true}))
        }
        console.error('Failed to update Variant status:', error);
      }
       
    };


    interface DropdownItem {
      _id: number;
      value: string;
      callbackFunction: () => void;
    }
    

    
    const returnThreeDotDropDown = (item) => {
      const VariantDropdown: DropdownItem[] = [
     {
       _id: 1,
       value: item.status === 'active' ? "Turn Off Variant" : "Turn On Variant",
       callbackfunction: (event, row_id, rowItem) => {
         event.stopPropagation();

        

         handleCrossPopup(rowItem);

       },
     },
     {
       _id: 6,
       value: "Delete",
       callbackfunction: (event, row_id, rowItem) => {
        event.stopPropagation();
        setShowDeleteVarientPopup(true);
        setDeleteVarientState(item);
         
         },
     },
   ];
     
       return VariantDropdown;
     };
    
     function formatDate(date : string) {
        if(date){
            const formattedDate = moment(date).utc().format('DD MMM YYYY, hh:mm A')
            return formattedDate
        } else {
            return "-"
        }
    }
    

        const getMetrics=(_id)=>{
        return  metricsObj[_id]
        }




    const columns: IColumnType<any>[] = [
      {
        key: "vRespTitle",
        title: "Variant",
        style:{maxWidth: "35.25rem"},
        render: (_, vRespTitle) => (
          <>
            {coreFeaturesLoading ? (
              <IconLabelSkeleton isIcon={true} isDescription={false} isHeader={true} />
            ) : (
              <HTMLTableCell
                header={vRespTitle?.name}
                description={vRespTitle?.description}
                isDraft={vRespTitle?.isDraft}
              />
            )}
          </>
        )
      },
      


        {
          key: "vRespStatus",
          title: "Status",
          style:{whiteSpace: "nowrap"},
          render: (_, vRespStatus) => (
<>
              {coreFeaturesLoading ? (
                <Skeleton width={"4.783rem"} height={"1.25rem"} />
              ) : (
                <>
                  {vRespStatus?.status === 'active' ? (
                    <Badge  style={{cusor:"pointer"}} labelText={"Active"} variant={'success'} isDot={true} />
                  ) : vRespStatus?.status === 'inactive' ? (
                    <Badge  style={{cusor:"pointer"}} labelText={"Inactive"} variant={'danger'} isDot={true} />
                  ): vRespStatus?.status === 'scheduled' ? (
                    <Badge  style={{cusor:"pointer"}} labelText={"Scheduled"} variant={'indigo'} isDot={true} />
                  ): (
                    <Badge  style={{cusor:"pointer"}} labelText={'Inactive'} variant={'danger'} isDot={true} />
                  )}
                </>
              )}
            </>
          )
        },
        {
            key: "vRespST",
            title: "Start Time",
            style:{whiteSpace: "normal"},
            render: (_, vRespST) => (
              <>
              {coreFeaturesLoading? <Skeleton width={"4.783rem"} height={"1.25rem"} />:vRespST.configuration?.schedule?.start_date ? formatDate(vRespST?.configuration?.schedule?.start_date) : "-"}
              </>
            )
            
        },
        
        {
            key: "vRespET",
            title: "End Time",
            style:{whiteSpace: "normal"},
            render: (_, vRespET) => (
              <>
              {coreFeaturesLoading?<Skeleton width={"4.783rem"} height={"1.25rem"}/>:vRespET?.configuration?.schedule?.end_date ? formatDate(vRespET?.configuration?.schedule?.end_date) : "-"}
              </>
            )
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
              _id !== undefined ? formatNumber(getMetrics(_id)?.loads , false) : '-'
              }
            </>
          ),
        },
        {
          key: "Conversions",
          title: "Conversions",
          style: { whiteSpace: "nowrap" , textAlign: "center"},
          headerStyle : { textAlign: "center", justifyContent: "center" },
          render: (_, { _id }) => (
            
            <>
              {coreFeaturesLoading ? (
                <Skeleton width={"4.783rem"} height={"1.25rem"} />
              ) : 
              _id !== undefined ? formatNumber(getMetrics(_id)?.clicks , false)  : '-'
              }
            </>
          ),
        },
        {
          key: "vRespCR",
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
          }
          }
      
      ];
      
       const handleToggleCampaignStatus = () => {
        if(activeIndexVariantDraftStatus){
            // handleOpenAlert();
            dispatch(setAlertVisible({theme:"warning",content:"Finish Configuring Atleast One Of The Variants First!",visible:true}))
            
        }


        else{
          const updatedStatus = !campaignStatus;
          setCampaignStatus(updatedStatus);
  
            if(activeIndexVariantStatus === 'active'){
              putVariants(activeIndexVariantId, {status: 'inactive'})
            
              .then((updatedVariant) => {
                if (updatedVariant) {
                  dispatch(updateVaraintStatusInRedux({variant:activeIndexVariant,status:"inactive"}))
                  fetchVariants();
                  dispatch(setAlertVisible({theme:"danger",content:"Campaign Turned Off ",visible:true}))
                }
              })
              .catch((error) => {
                console.error('Failed to update Variant status:', error);
                dispatch(setAlertVisible({theme:"warning",content:"Failed to Turn Off Campaign",visible:true}))
                // fetchVariants();
              });
            }
  
            else{
              putVariants(activeIndexVariantId, {status: 'active'})
              .then((updatedVariant) => {
                if (updatedVariant) {
                  dispatch(updateVaraintStatusInRedux({variant:activeIndexVariant,status:"active"}))
                  fetchVariants();
                  dispatch(setAlertVisible({theme:"success",content:`Campaign Turned On, ${updatedVariant.data.name} Variant is Active`,visible:true}))
                }
              })
              .catch((error) => {
                // fetchVariants(); 
                dispatch(setAlertVisible({theme:"warning",content:"Failed to Turn On Campaign",visible:true}))
              });
            }
        }


       }
      
    
   
    return(
        <div className="usecase-container">
             <div className="usecase-heading-wrapper">
             {!campaign?.name?<div className="campaign-name-header-loader-skeleton">
              <Skeleton width={"25rem"} height={"2.6344rem"}/>
              <Skeleton width={"16.125rem"} height={"1.4rem"}/>

             </div>:  <HeaderContent campaign={campaign}  editable={true} spellCheck={false}    heading={campaign?.name || "Campaign Name"} 
             description={campaign?.description} pillStatus={campaign.status=="active"?true:false}/>}

           
             <div className="usecase-right-buttons">
             <DateRangePickerComponent handleChangeEvent={handleSetDateRange} />
             {campaign.status=="active" ? (
        <Button
          variant="outline-fill"
          colorScheme="danger"
          style={{ minHeight: '2.625rem', minWidth: '10rem' }}
          onClick={handleCrossPopup2}
        >
          Turn Off Campaign
        </Button>
      ) : (
        <Button
          variant="outline-fill"
          colorScheme="success"
          style={{ minHeight: '2.625rem', minWidth: '10rem' }}
          onClick={handleCrossPopup2}
        >
          Turn On Campaign
        </Button>
      )}

            </div>
            </div>
             
            <div className="metric-card--wrapper" style={{ marginBottom: "1.5rem" }}>
              <KpiCard numbers={formatNumber(impressions , false)} header={"Impressions"} statistic={"14.6%"} context={"vs last month"} graph={graphImpression}  />
              <KpiCard numbers={formatNumber(conversions , false)} header={"Conversions"} statistic={"16.4%"} context={"Due to Assistance"} graph={graphLoad} />
              <KpiCard numbers={`${conversionRate}`} header={"Conversion Rate"} statistic={"7.1%"} context={"vs last month"} graph={graphConversion} />
              <KpiCard numbers={`${currency} ${formatNumber(aov)}`} header={"Average Order Value"} statistic={"3.3%"} context={"Due to Assistance"} graph={graphAov} />
				
			</div>


            <div className="usecase-heading-wrapper">
             <HeaderContent heading={"Variants"} description={"Manage Variants applicable for this Campaign"} headingTypeClass={"text-lg--sb"} descriptionTypeClass={"text-sm"}/>

                <div className="usecase-right-buttons">
                </div>
            </div>			
            
            <div className="table-parent" style={{width: "100%", marginBottom: "7.5rem"}}>
              <TableTopFunctionalityBar
              inactiveCallback={handleInactiveCallback}
              viewallCallback={handleViewAllCallBack}
              activeOption={variantViewStatus}
              activeCallback={handleActiveCallBack}
               isVariantCreation={variantLoader&&"loading"}
                searchBarPlaceholder={""}
                 addNewBtnPlaceholder={"Create New Variant"} 
                 addBtnCallback={handleCreateNewVariant}
                  setSearchItem={setSearchItem}/>
              <LineLoader isVisible={lineLoading} />
              {<div className={lineLoading && 'line-loading'}>
                <Table 
                
                    onClickRow={handleClick}
                    data={coreFeaturesLoading?[{},{},{}]:(variants||[].filter(item => searchItem ? item.name && item.name.toLowerCase().includes(searchItem.toLowerCase()) : true))}
                    columns={columns} 
                    showPaginationFooter={false} 
                />
              </div>}
        </div>
        {showCrossIconPopup && <StatusPopup close={() => setshowCrossIconPopup(false)} selectedRow={selectedRowItem} type={"Variant"} toggleCallBack={() => updateVariantStatus(selectedRowItem)}/>}
        {showCrossIconPopup2 && <StatusPopup close={() => setshowCrossIconPopup2(false)} explicitStatus={campaignStatus} type={"Campaign"} toggleCallBack={handleToggleCampaignStatus}/>}
        {showDeleteVarientPopup && <VarientDeletePopup handleDelete={() => { 
        handleDelete(deleteVarientState)
       
         }} close={(e) => { setShowDeleteVarientPopup(false) }} deleteLoadder={deleteLoadder} />}
        </div>
    )
}