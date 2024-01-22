// @ts-nocheck
import React, {useContext, useEffect, useState} from "react";
import "./index.sass";
import HeaderContent from "../../Settings/Components/header-content";
import { Table, HTMLTableCell, Button, Badge } from "@attrybtech/attryb-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAudiences, getVisitors, getCustomers, getUsers } from "../../../services/audiences";
import IconLabelSkeleton from "../../../components/icon-label-skeleton/icon-label-skeleton";
import TableFunctionalityBar from "../../../components/table-functionality-bar";
import LineLoader from "../../../components/Lineloader/LineLoader";
import { useNavigate } from "react-router";
import moment from "moment";
import { getRandomProfileIcon } from "../../UserProfileView/DynamicProfileIcon";
import CustomCheckbox from "../../../components/customCheckbox";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCurrentPageInRedux, setDataCountInRedux, setDataObjectInRedux, setReduxCoreAudienceEmpty } from "../../../features/core-audience-configs/core-audience-slice";
import { useSearchParams } from "react-router-dom";
import { AUDIENCE_VARIABLE } from "../../../utils/constants";
import { AuthContext } from "../../../auth/AuthContext";
import { capitalizeFirstLetter, capitalizeFirstLetterText, convertTimeToUtcZone, formatNumber } from "../../../utils/helpers";
import { createSegment } from "../../../services/segments";
import { createSegmentPopup } from "./createNewSegment";
import AppPopup from "../../../components/app-popup";
import TextInput from '../../../components/text-input/index';
import cirleIcon from "../../../assets/icons-v2/circle-icon.svg"
import bulbIcon from "../../../assets/icons-v2/BulbFeatured icon.svg"
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import { setSegmentsInRedux } from "../../../features/core-feature-configs/core-features-slice";
import { setAlertVisible } from "../../../features/globalConfigs/global-slice";
import UserTwo from "../../../assets/icons-v2/user-two-icon.svg"
import fliterClose from "../../../assets/audience-images/filter-close.svg"
import DateRangePickerComponent from "../../../components/DateRangePicker"; 
import { createNewSegmentRule } from "../../../services/impressions";

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties;
	render?: (column: IColumnType<T>, item: T) => void;
}

export default function AudiencesFindPeople() {

	const [openFilter,setOpenFilter]=React.useState(false)
	const [apiFilterData,setApiFilterData]=useState([])
	const [segmentRules,setSegmentRules]=useState<any>([])


	const limitRows=[
		{ _id: "1", value: "10", data: { data: "10" } },
		 { _id: "20", value: "20", data: { data: "20" } },
		 { _id: "30", value: "30", data: { data: "30" } },
		 { _id: "50", value: "50", data: { data: "50" } },
		 { _id: "100", value: "100", data: { data: "100" } }]

	
	const {currentPageObject, dataCount, dataObject}=useAppSelector((store)=>store.coreAudienceSlice)
	
	const {reduxSegments}=useAppSelector((store)=>store.coreFeaturesSlice)
	const [lineLoader, setLineLoader] = useState(false)
	const [coreLoader, setCoreLoader] = useState(true)
	const [searchParams, setSearchParams] = useSearchParams()
	const [totalData, setTotalData] = useState();
	const [selectAll, setSelectAll] = useState(false);
	const [btnState, setBtnState] = useState('none');
	const [selectedRows, setSelectedRows] = useState({});
	const [uncheckedIds, setUncheckedIds] = useState([]);
	const [checkedIds, setCheckedIds] = useState([]);
	const [checkedObject, setcheckedObject] = useState([])
	const navigate = useNavigate();
    const dispatch=useAppDispatch()
	const tabQueryStatus = searchParams.get('tab')
	const pageQueryStatus = searchParams.get('page')
	const sortQueryStatus = searchParams.get('sortBy')
	const orderQueryStatus = searchParams.get('orderBy')
	let openFilterStatus: string | null = searchParams.get('filters');
	const [buttonState, setbuttonState] = useState(false)
	const urlSearchParams = new URLSearchParams(window.location.search);
	const paramsObject = Object.fromEntries(urlSearchParams.entries());
	const [isAsc, setIsAsc] = useState(orderQueryStatus === 'asc' ? true : false);
	const [currentLimit,setCurrentLimit]=useState<SelectListItem>(limitRows[1])
	const [description, setDescription] = useState("")
	const [openPopup, isOpenPopup] = useState(false);
	const [segmentName, setsegmentName] = useState("");
	const [activeOption, setActiveOption] = useState( tabQueryStatus || AUDIENCE_VARIABLE.allaudience);
	const [currentPage, setCurrentPage] = useState(pageQueryStatus || currentPageObject[activeOption] || 1);
	const { containerId , accountId} = useContext(AuthContext);
	
	const [endDate, setEndDate] = useState('');
	 const currentDate = new Date();
	 const currentYear = currentDate.getFullYear();
	 const formattedDate = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0))
	 const [startDate, setStartDate] = useState(moment.utc(formattedDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
	 if (openFilterStatus !== null) {
		openFilterStatus = JSON.parse(openFilterStatus);
	  }
	  
    const handleSegmentClick = (e, item: T) => {
		if(e.target.className.includes('checkbox')) return;
		navigate(`/audiences/find-visitors/${item?.type?.toLowerCase()}/${item?.id}`);
	};
	const setQueryTotheUrl=(value)=>{
		setSearchParams(value)
	}
	const handleLimitCallBack=(e)=>{
		setCurrentLimit(e)
		setQueryTotheUrl({...paramsObject, limit: Number(e?.value)})
	 }
	useEffect(()=>{
		handleLoaders(pageQueryStatus || currentPageObject[activeOption] || 1)
		setCurrentPage(pageQueryStatus || currentPageObject[activeOption] || 1)
		setActiveOption(tabQueryStatus || AUDIENCE_VARIABLE?.allaudience)
		if(openFilterStatus==true) setOpenFilter(true)
		// setLineLoader(false)
		// fetchData(currentPage,filter)
	},[tabQueryStatus, containerId, currentLimit, startDate, endDate]) 

	useEffect((e)=>{
		handleOnPageChange(e,currentPageObject[activeOption] || Number(pageQueryStatus))
	},[pageQueryStatus,currentLimit, startDate, endDate])

	useEffect(()=>{
		let newObj = {...selectedRows}
		
		if(dataObject[activeOption]){
			if(selectAll){
				let arr = [...checkedIds]
				let rowObj = []
				for(let el of dataObject[activeOption]){
					rowObj?.push(el)
					if (!arr?.includes(el?.id)) {
						arr?.push(el?.id);
					}
					if (!uncheckedIds.includes(el?.id)) {
						selectedRows[el?.id] = true
					}
					newObj[el?.id] = true
				}
				setCheckedIds(arr)
				setcheckedObject([...rowObj])
			}else{
				let arr = [...uncheckedIds]
				for(let el of dataObject[activeOption]){
					if (!arr?.includes(el?.id)) {
						arr?.push(el?.id);
					}
				}
				for(let key in newObj){
					newObj[key] = false
				}
				// setUncheckedIds(arr)
			}
		}
	},[selectAll, activeOption, currentPage, dataObject[activeOption]])

	useEffect(()=>{
		// if(checkedIds.length && uncheckedIds.length){
		// 	setBtnState('mixed')
		// }
		if(uncheckedIds?.length && checkedIds?.length==0){
			setBtnState('none')
		}
		if(checkedIds?.length && uncheckedIds?.length==0){
			setBtnState('all')
		}
		
	},[checkedIds, uncheckedIds])

	const handleOnPageChange=async(e,val)=>{
		setCurrentPage(val || 1)
		setLineLoader(true)
		await fetchData(val || 1, apiFilterData)
		setLineLoader(false)
	}
	const handleLoaders = async(currentPageValue) =>{
		if(dataObject[activeOption]?.length){
			setLineLoader(true)
			setCoreLoader(false)
		}
		if(dataObject[activeOption]?.length==0){
			setCoreLoader(true)
			let data = await fetchData(currentPageValue || 1, apiFilterData)
			if(data?.data?.length){
				setCoreLoader(false)
			}
		}
		
	}

	const fetchData= async(currentPageValue,filters)=>{
		if(containerId){
			if(activeOption == AUDIENCE_VARIABLE?.allaudience){
				dispatch(setCurrentPageInRedux({allaudience:currentPageValue}))
				let result = await fetchAudiences(currentPageValue , sortQueryStatus,filters, isAsc)
				dispatch(setDataCountInRedux({allaudience: result?.count}))
				dispatch(setDataObjectInRedux({allaudience: result?.data}))
				setCoreLoader(false)
				setLineLoader(false)
				return result
			}else if(activeOption == AUDIENCE_VARIABLE?.visitors){
				dispatch(setCurrentPageInRedux({visitors:currentPageValue}))
				let result = await fetchVisitors(currentPageValue , sortQueryStatus,filters, isAsc)
				dispatch(setDataCountInRedux({visitors: result?.count}))
				dispatch(setDataObjectInRedux({visitors: result?.data}))
				setCoreLoader(false)
				setLineLoader(false)
				return result
			}else if(activeOption == AUDIENCE_VARIABLE?.customers){
				dispatch(setCurrentPageInRedux({customers:currentPageValue}))
				let result = await fetchCustomers(currentPageValue , sortQueryStatus,filters, isAsc)
				dispatch(setDataCountInRedux({customers: result?.count}))
				dispatch(setDataObjectInRedux({customers: result?.data}))
				setCoreLoader(false)
				setLineLoader(false)
				return result
			}else if(activeOption == AUDIENCE_VARIABLE?.users){
				dispatch(setCurrentPageInRedux({users:currentPageValue}))
				let result = await fetchUsers(currentPageValue , sortQueryStatus,filters, isAsc)
				dispatch(setDataCountInRedux({users: result?.count}))
				dispatch(setDataObjectInRedux({users: result?.data}))
				setCoreLoader(false)
				setLineLoader(false)
				return result
			}
		}
	}

	
	const fetchAudiences = async (currentPageValue,sortBy,filters, isAscending) => {
		try {
			const audiencePromise = await getAudiences(containerId, `limit=${currentLimit?.value}&page=${currentPageValue}${sortBy ? `&sortBy=${sortBy}` : ""}&orderBy=${isAscending ? 'ASC': 'DESC'}${startDate ? `&start=${startDate}` : ""}${endDate ? `&last=${endDate}` : ""}`,{filters:filters});
			setTotalData(audiencePromise?.count);
			return audiencePromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchVisitors = async (currentPageValue,sortBy,filters, isAscending) => {
		try {
			const visitorsPromise = await getVisitors(containerId, `limit=${currentLimit?.value}&page=${currentPageValue}${sortBy ? `&sortBy=${sortBy}` : ""}&orderBy=${isAscending ? 'ASC': 'DESC'}${startDate ? `&start=${startDate}` : ""}${endDate ? `&last=${endDate}` : ""}`,{filters:filters});
			setTotalData(visitorsPromise?.count);
			return visitorsPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchCustomers = async (currentPageValue,sortBy,filters, isAscending) => {
		try {
			const customersPromise = await getCustomers(containerId, `limit=${currentLimit?.value}&page=${currentPageValue}${sortBy ? `&sortBy=${sortBy}` : ""}&orderBy=${isAscending ? 'ASC': 'DESC'}${startDate ? `&start=${startDate}` : ""}${endDate ? `&last=${endDate}` : ""}`,{filters:filters});
			setTotalData(customersPromise?.count);
			return customersPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	const fetchUsers = async (currentPageValue,sortBy,filters, isAscending) => {
		try {
			const customersPromise = await getUsers(containerId, `limit=${currentLimit?.value}&page=${currentPageValue}${sortBy ? `&sortBy=${sortBy}` : ""}&orderBy=${isAscending ? 'ASC': 'DESC'}${startDate ? `&start=${startDate}` : ""}${endDate ? `&last=${endDate}` : ""}`,{filters:filters});
			setTotalData(customersPromise?.count);
			return customersPromise
		}
		catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	const handleSorting = async(e,columns)=>{
		if(columns?.key== 'id') return
		if(containerId){
			
			setIsAsc(!isAsc)
			setLineLoader(true)
			if(activeOption == AUDIENCE_VARIABLE?.allaudience){
				let result = await fetchAudiences(pageQueryStatus || currentPageObject[activeOption] || 1 ,columns?.key, apiFilterData, !isAsc)
				dispatch(setDataObjectInRedux({allaudience: result?.data}))
			}else if(activeOption == AUDIENCE_VARIABLE?.visitors){
				let result = await fetchVisitors(pageQueryStatus || currentPageObject[activeOption] || 1 ,columns?.key, apiFilterData, !isAsc)
				dispatch(setDataObjectInRedux({visitors: result?.data}))
			}else if(activeOption == AUDIENCE_VARIABLE?.customers){
				let result = await fetchCustomers(pageQueryStatus || currentPageObject[activeOption] || 1 ,columns?.key, apiFilterData, !isAsc)
				dispatch(setDataObjectInRedux({customers: result?.data}))
			}else if(activeOption == AUDIENCE_VARIABLE?.users){
				let result = await fetchUsers(pageQueryStatus || currentPageObject[activeOption] || 1 ,columns?.key, apiFilterData, !isAsc)
				dispatch(setDataObjectInRedux({users: result?.data}))
			}
			setQueryTotheUrl({...paramsObject, sortBy: columns?.key, orderBy: isAsc ? "asc" : "desc"})
			setCoreLoader(false)
			setLineLoader(false)
		}
	}
	const handleCheckBoxes=(isChecked,id , rowObj)=>{
		let newObj = {...selectedRows}
		if(isChecked && id){
			newObj[id] = true;
			let arr = [...checkedIds]
			if (!arr?.includes(id)) {
				arr?.push(id);
			}
			setcheckedObject([...checkedObject , rowObj])
			setCheckedIds(arr)
			uncheckedIds?.splice(uncheckedIds?.indexOf(id), 1);
		}else{
		  	newObj[id] = false;
			let arr = [...uncheckedIds]
			if (!arr?.includes(id)) {
				arr?.push(id);
			}
			setUncheckedIds(arr)
			checkedIds?.splice(checkedIds?.indexOf(id), 1);
			let arrObj = [...checkedObject];
			const updatedList = arrObj?.filter((ele: any) => ele.id !== id)
			setcheckedObject([...updatedList])
		}
		setSelectedRows(newObj)
	}
	
	const handleSelectAll =(e)=>{
		if(e?.target?.checked){
			setSelectAll(true)
			setBtnState('all')
		}else{
			setSelectAll(false)
			setBtnState('none')
			setSelectedRows({})
			setCheckedIds([])
			setcheckedObject([])
			setUncheckedIds([])
		}
	}
	
	const calculateTotalPages =(dataCount, currentLimit)=>{
		try{
			return Math.ceil(Number(dataCount[activeOption]) / Number(currentLimit?.value))
		}catch(error){
			console.error('Error occurred:', error);
		}
	}
	const getColumns =(activeOption)=>{
		if(activeOption==AUDIENCE_VARIABLE?.allaudience){
			return columnsAllAudience
		}else if(activeOption==AUDIENCE_VARIABLE?.visitors){
			return columnsVisitors
		}else if(activeOption==AUDIENCE_VARIABLE?.customers){
			return columnsCustomers
		}else{
			return columnsUsers
		}
	}

	const handleSetDateRange = (dateStr) => {
		const dateRangeArray = dateStr.split(" - ");
		let start = moment.utc(dateRangeArray[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
		let end = moment.utc(dateRangeArray[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');	  
	  
		setStartDate(start);
		setEndDate(end);
	  };
	  
	
	const columnsAllAudience: IColumnType<IData>[] = [
		{
			key: "id",
			title: <div className="checkbox-wrapper"><CustomCheckbox handleChecked={(e)=>handleSelectAll(e)} checked={selectAll ? true : false} varient={'default'} /></div>,
			style: { maxWidth: "4rem", width: '1rem'},
			clickable:false,
			render: (_, el ) => {
				return (<div key={el?.id} className="checkbox-wrapper">
					{coreLoader? (
						<Skeleton width={"1.125rem"} height={"1rem"} />
					) : el?.id ? (
						<CustomCheckbox name={el?.id} checked={selectedRows[el?.id] || false} handleChecked={(e)=>{handleCheckBoxes(e?.target?.checked,el?.id,el )}}/>
					) : (
						""
					)}
				</div>)
			},
		},
		{
			key: "name",
			title: "Visitor",
			style: { maxWidth: "17rem"},
			render: (_, { id, name, type }) => (
				<>
					{coreLoader ? (
						<IconLabelSkeleton isHeader={true} isIcon={true} isDescription={false} />
					) : id ? (
						(type=='Visitor' ? <HTMLTableCell icon={getRandomProfileIcon(id)} header={`${id}`} /> : <HTMLTableCell header={`${name?.trim()?.length ? name : id}`} />)
					) : (
						""
					)}
				</>
			),
		},
		{
			key: "type",
			title: "Type",
			// style: { whiteSpace: "nowrap" },
			render: (_, { type }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : (
						<>
							{type === 'Visitor' ? (
								<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetter(type)} variant="purple" />
							) : type === 'Customer' ? (
								<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetter(type)} variant="pink" />
							) : (
								<Badge  style={{cusor:"pointer"}} labelText={capitalizeFirstLetter(type)} variant="orange" />
							)}
						</>
					)}
				</>
			),
		},
		{
			key: "sessions",
			title: "# Sessions",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { sessions }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : sessions ? (
						sessions
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "orders",
			title: "# Orders",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { orders }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : orders ? (
						formatNumber(orders , false)
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_city",
			title: "City",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_city }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_city ? (
						location_city
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_country",
			title: "Country",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_country }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_country ? (
						location_country
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "lastSeen",
			title: "Last Seen",
			sortingEnable: true,
			// style: { whiteSpace: "nowrap" },
			render: (_, { lastSeen }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : lastSeen ? (
						moment(lastSeen).format('DD MMM YYYY, hh:mm A')
					) : (
						"-"
					)}
				</>
			),
		}
	];
	
	const columnsVisitors: IColumnType<IData>[] = [
		{
			key: "id",
			title: <div className="checkbox-wrapper"><CustomCheckbox handleChecked={(e)=>handleSelectAll(e)} checked={selectAll ? true : false} varient={'default'} /></div>,
			style: { maxWidth: "4rem", width: '1rem'},
			clickable:false,
			render: (_, el) => {
				return <div key={el?.id} className="checkbox-wrapper">
					{coreLoader? (
						<Skeleton width={"1.125rem"} height={"1rem"} />
					) : el?.id ? (
						<CustomCheckbox name={el?.id} checked={selectedRows[el?.id] || false} handleChecked={(e)=>{handleCheckBoxes(e?.target?.checked,el?.id , el)}}/>
					) : (
						""
					)}
				</div>
			},
		},
		{
			key: "name",
			title: "Visitor",
			style: { maxWidth: "17rem"},
			render: (_, { id, name, type }) => (
				<>
					{coreLoader ? (
						<IconLabelSkeleton isHeader={true} isIcon={true} isDescription={false} />
					) : id ? (
						(type=='Visitor' ? <HTMLTableCell icon={getRandomProfileIcon(id)} header={`${id}`} /> : <HTMLTableCell header={`${name?.trim()?.length ? name : id}`} />)
					) : (
						""
					)}
				</>
			),
		},
		{
			key: "sessions",
			title: "# Sessions",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { sessions }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : sessions ? (
						sessions
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "orders",
			title: "# Orders",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { orders }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : orders ? (
						formatNumber(orders , false)
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_city",
			title: "City",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_city }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_city ? (
						location_city
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_country",
			title: "Country",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_country }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_country ? (
						location_country
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "lastSeen",
			title: "Last Seen",
			sortingEnable: true,
			// style: { whiteSpace: "nowrap" },
			render: (_, { lastSeen }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : lastSeen ? (
						moment(lastSeen).format('MMM D, YYYY, hh:mm A')
					) : (
						"-"
					)}
				</>
			),
		}
	];
	const columnsCustomers: IColumnType<IData>[] = [
		{
			key: "id",
			title: <div className="checkbox-wrapper"><CustomCheckbox handleChecked={(e)=>handleSelectAll(e)} checked={selectAll ? true : false} varient={'default'} /></div>,
			style: { maxWidth: "4rem", width: '1rem'},
			clickable:false,
			render: (_, el) => {
				return <div key={el?.id} className="checkbox-wrapper">
					{coreLoader? (
						<Skeleton width={"1.125rem"} height={"1rem"} />
					) : el?.id ? (
						<CustomCheckbox name={el?.id} checked={selectedRows[el?.id] || false} handleChecked={(e)=>{handleCheckBoxes(e?.target?.checked,el?.id,el)}}/>
					) : (
						""
					)}
				</div>
			},
		},
		{
			key: "name",
			title: "Visitor",
			style: { maxWidth: "17rem"},
			render: (_, { id, name, type }) => (
				<>
					{coreLoader ? (
						<IconLabelSkeleton isHeader={true} isIcon={true} isDescription={false} />
					) : id ? (
						(type=='Visitor' ? <HTMLTableCell icon={getRandomProfileIcon(id)} header={`${id}`} /> : <HTMLTableCell header={`${name?.trim()?.length ? name : id}`} />)
					) : (
						""
					)}
				</>
			),
		},
		{
			key: "sessions",
			title: "# Sessions",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { sessions }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : sessions ? (
						sessions
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "orders",
			title: "# Orders",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { orders }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : orders ? (
						formatNumber(orders , false)
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_city",
			title: "City",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_city }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_city ? (
						location_city
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_country",
			title: "Country",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_country }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_country ? (
						location_country
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "lastSeen",
			title: "Last Seen",
			sortingEnable: true,
			// style: { whiteSpace: "nowrap" },
			render: (_, { lastSeen }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : lastSeen ? (
						moment(lastSeen).format('MMM D, YYYY, hh:mm A')
					) : (
						"-"
					)}
				</>
			),
		}
	];
	const columnsUsers: IColumnType<IData>[] = [
		{
			key: "id",
			title: <div className="checkbox-wrapper"><CustomCheckbox handleChecked={(e)=>handleSelectAll(e)} checked={selectAll ? true : false} varient={'default'} /></div>,
			style: { maxWidth: "4rem", width: '1rem'},
			clickable:false,
			render: (_, el) => {
				return <div key={el?.id} className="checkbox-wrapper">
					{coreLoader? (
						<Skeleton width={"1.125rem"} height={"1rem"} />
					) : el?.id ? (
						<CustomCheckbox name={el?.id} checked={selectedRows[el?.id] || false} handleChecked={(e)=>{handleCheckBoxes(e?.target?.checked,el?.id,el)}}/>
					) : (
						""
					)}
				</div>
			},
		},
		{
			key: "name",
			title: "Visitor",
			style: { maxWidth: "17rem"},
			render: (_, { id, name, type }) => (
				<>
					{coreLoader ? (
						<IconLabelSkeleton isHeader={true} isIcon={true} isDescription={false} />
					) : id ? (
						(type=='Visitor' ? <HTMLTableCell icon={getRandomProfileIcon(id)} header={`${id}`} /> : <HTMLTableCell header={`${name?.trim()?.length ? name : id}`} />)
					) : (
						""
					)}
				</>
			),
		},
		{
			key: "sessions",
			title: "# Sessions",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { sessions }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : sessions ? (
						sessions
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "orders",
			title: "# Orders",
			style: { textAlign: "center" },
			headerStyle : { textAlign: "center", justifyContent: "center" },
			sortingEnable: true,
			render: (_, { orders }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : orders ? (
						formatNumber(orders , false)
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_city",
			title: "City",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_city }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_city ? (
						location_city
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "location_country",
			title: "Country",
			// style: { whiteSpace: "nowrap" },
			render: (_, { location_country }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : location_country ? (
						location_country
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "lastSeen",
			title: "Last Seen",
			sortingEnable: true,
			// style: { whiteSpace: "nowrap" },
			render: (_, { lastSeen }) => (
				<>
					{coreLoader ? (
						<Skeleton width={"4.783rem"} height={"1.25rem"} />
					) : lastSeen ? (
						moment(lastSeen).format('MMM D, YYYY, hh:mm A')
					) : (
						"-"
					)}
				</>
			),
		}
	];
	async function handleCreateNewSegment (){
		isOpenPopup(true)
	}
	async function handleCreateSegment(){
		setbuttonState(true)
		let visitorId = [] ,userId = [] 
		
	    for(let ele of reduxSegments){
		
			if(ele.name.toLowerCase() === segmentName.toLowerCase()){
				setbuttonState(false)
				dispatch(setAlertVisible({content:"Segment name already Exists!",visible:true,theme:"danger",ctaData:{
					route:`/segments/all`,title:"Go To all segment"
				  }}))
				return;
			} 
		}
		// return
		checkedObject.map((ele:any) =>{
		  if(ele.type === "Customer" || ele.type === "User"){
			userId.push(ele.id)
			visitorId = [...visitorId , ...ele.anonymous_ids]
		  } else {
			visitorId = [...visitorId , ...ele.anonymous_ids]
		  }
	    })
		
		const segmentBody = {
			name: segmentName,
			description: description,
			accountId: accountId,
            containerId: containerId,
			anonymousIds: visitorId,
			userIds: userId,
			type: checkedIds.length!=0?"list":"custom segment",
			meta: {
				description: description,
				header: segmentName,
				icon: ""
			}
		}
		const segmentResp = await createSegment(segmentBody)
		segmentResp.status = "inactive"
		segmentResp.type = checkedIds.length!=0?"list":"custom segment"
		dispatch(setSegmentsInRedux([...reduxSegments , segmentResp ]))
		setbuttonState(false)
		setsegmentName("")
		setDescription("")  
		if(apiFilterData.length!==0){
			await createNewSegmentRule(containerId,{segmentId:segmentResp._id,rules:segmentRules})
		} 
		isOpenPopup(false)
		navigate(`/segments/all/${segmentResp._id}`)
		dispatch(setAlertVisible({content:"Segment Created Successfully",theme:"success",visible:true}))
	}
	function changeCross (){
		isOpenPopup(false)
	}

	const PopupHeader = () => {

        return (
            <div className='create-campaign-popup-header-container'>
                <div className="create-campaign-icons">
                    <div className='create-campaign-left-icon'>
                        <div className="create-campaign-background-circles">
                            <img src={cirleIcon} alt="" />
                        </div>
                        <div className="create-campaign-message-icon">
                            <img src={bulbIcon} alt="" />
                        </div>
                    </div>
                    <div className="create-campaign-close" onClick={() => changeCross()} >
                    <span className="create-campaign-hover-circle"></span>
                    <img src={closeIcon} alt="" className="default-icon" />
                    <img src={hoverX} alt="" className="hover-icon" />
                    </div>
                </div>
                <div>
                    <div className="create-campaign-popup-header-text text-lg--sb">
                        <p>Create New List</p>
                    </div>
                </div>
            </div>
        )
    }
    
    const PopupBody = () => {
        return (
            <div className="create-campaign-popup-body">
                <div className="create-campaign-input">
                    <TextInput
                        label={"List Name"}
                        placeholder="Enter a List Name"
                        value={segmentName}
                        onChange={(e) => setsegmentName(e.target.value)}                    />
                </div>
                <div className="create-campaign-input">
                    <TextInput
                        label={"Description"}
                        placeholder="Enter a Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
        )
    }

	const handleKeyDownPress=(event)=>{
		if (event.key === 'Enter') {
			handleLoaders(currentPage)
			fetchData(currentPage,apiFilterData)
		  }
	}
    const PopupFooter = () => {
        return (
            <>
            <div className="create-campaign-submit-buttons">
                <Button onClick={() => changeCross()} variant="solid" colorScheme="secondary">
                    Cancel
                </Button>
                    <Button onClick={handleCreateSegment} variant="solid"
					state={buttonState ? "loading" : (segmentName?.trim()?.length ? "" : "disabled")}
                        style = {{ minWidth : "10rem" }} >
                    Create Segment
                </Button>
            </div>

            </>
          

         
        )
    }

	const getTableEmptyState =()=>{
        if(activeOption == AUDIENCE_VARIABLE?.allaudience){
          return {
            icon:UserTwo,
            primaryHeading:"No visitor data yet, check back later",
            secondaryHeading:"Get insights on visitor activity once the data is available",
            button:<Button onClick={() => navigate('/my-campaigns')}
			colorScheme="secondary" style={{margin:"auto",marginTop:"1.5rem"}}>
            <p class="text-sm--sb">Go to Campaigns</p>
          </Button>
          }
        }
        if(activeOption == AUDIENCE_VARIABLE?.visitors){
          return {
            icon:UserTwo,
            primaryHeading:"No visitor data yet, check back later",
            secondaryHeading:"Get insights on visitor activity once the data is available",
			button:<Button onClick={() => navigate('/my-campaigns')}
			colorScheme="secondary" style={{margin:"auto",marginTop:"1.5rem"}}>
            <p class="text-sm--sb">Go to Campaigns</p>
          </Button>
          }
        }
    
        if(activeOption == AUDIENCE_VARIABLE?.customers){
          return {
            icon:UserTwo,
            primaryHeading:"No Customer data yet, check back later",
            secondaryHeading:"Get insights on Customer activity once the data is available",
			button:<Button onClick={() => navigate('/my-campaigns')}
			colorScheme="secondary" style={{margin:"auto",marginTop:"1.5rem"}}>
            <p class="text-sm--sb">Go to Campaigns</p>
          </Button>
          }
        }

		if(activeOption == AUDIENCE_VARIABLE?.users){
			return {
				icon:UserTwo,
				primaryHeading:"No User data yet, check back later",
				secondaryHeading:"Get insights on User activity once the data is available",
				button:<Button onClick={() => navigate('/my-campaigns')}
			colorScheme="secondary" style={{margin:"auto",marginTop:"1.5rem"}}>
            <p class="text-sm--sb">Go to Campaigns</p>
          </Button>
			  }
		}
      }

	return (
		<div onKeyDown={handleKeyDownPress} className="audiences-container">
			 <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter()} openModal={openPopup} setOpenModal={isOpenPopup} />
   
			<div className="audiences-heading-wrapper">
				<HeaderContent
					heading={"Find Visitors"}
				/>
				<div className="audiences-right-buttons">
				<Button  variant="solid"  colorScheme="primary" state={checkedObject.length ? "" : "disabled"} onClick={handleCreateNewSegment} >
                	<img src="/attryb-ui/assets/icons/button/plusButtonIcon.svg"></img>
                	<p className="text-sm--sb">Create New List</p>
                </Button>
				<DateRangePickerComponent handleChangeEvent={handleSetDateRange} defaultStartDate={startDate} defaultEndDate={endDate} />
				</div>
			</div>
			
			<div className="table-parent" style={{ width: "100%", marginBottom: "7.5rem" }}>
				<div className="table-users-header-wrapper-parent">
				<div className="usercount-filter">
					<p className="usercount-text text-md--md">
						<span>{formatNumber(dataCount[activeOption] , false) || 0}</span>Visitors with matching profiles</p>
				</div>
				
				</div>
				<TableFunctionalityBar
					handleAddNewSegmentRule={()=>isOpenPopup(true)}
					sendSegmentRuleData={(e)=>setSegmentRules(e)}
					filterLocationData={dataObject[activeOption] || []}
					isFilterOpen={openFilter}
					handleCallApi={async(e)=>{setLineLoader(true); await fetchData(currentPage,e)}}
					sendFinalFilterData={(e)=>setApiFilterData(e)}
					handleOpenFilters={(e)=>setOpenFilter(e)}
					activeOption={activeOption}
					selectAll={selectAll}
					selectedExportData={checkedObject}
					unSelectedIds={uncheckedIds}
				/>
				<LineLoader isVisible={lineLoader} />
				{<div className={lineLoader? 'line-loading':"audience-table-wrapper"}>
					<Table
						data={coreLoader?[{},{},{},{},{},{},{},{},{},{}] : (dataObject[activeOption] || [])}
						columns={getColumns(activeOption)}
						showPaginationFooter={(totalData) ? true : false}
						onPageChange={(e,selectedPage)=>{handleOnPageChange(e,selectedPage); setQueryTotheUrl({...paramsObject, page:Number(selectedPage) || 1, tab:activeOption})}}
						totalPageCount={calculateTotalPages(dataCount, currentLimit)}
						currentPage={Number(currentPageObject[activeOption] )}
						pageSize={Number(currentLimit?.value)}
						onClickRow={handleSegmentClick} 
						showRowsLimit={true}
						onSelect={(e)=>{handleLimitCallBack(e)}}
						rowActiveItem={currentLimit}
						limitRows={limitRows}
						onHeaderClick={handleSorting}
						sortingType='server'
						emptyStateComponent={getTableEmptyState()}
					/>
				</div>}
			</div>
		</div>
	);
}

