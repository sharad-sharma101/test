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
import { useSearchParams } from "react-router-dom";
import { AUDIENCE_VARIABLE } from "../../../utils/constants";
import { AuthContext } from "../../../auth/AuthContext";
import { capitalizeFirstLetter, capitalizeFirstLetterText, convertTimeToUtcZone, formatNumber } from "../../../utils/helpers";
import UserTwo from "../../../assets/icons-v2/user-two-icon.svg"

interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties;
	render?: (column: IColumnType<T>, item: T) => void;
}

export default function Audiences() {

	const [openFilter,setOpenFilter]=React.useState(false)
	const [apiFilterData,setApiFilterData]=useState([])


	const limitRows=[
		{ _id: "1", value: "10", data: { data: "10" } },
		 { _id: "20", value: "20", data: { data: "20" } },
		 { _id: "30", value: "30", data: { data: "30" } },
		 { _id: "50", value: "50", data: { data: "50" } },
		 { _id: "100", value: "100", data: { data: "100" } }]

	
	
	const [lineLoader, setLineLoader] = useState(false)
	const [coreLoader, setCoreLoader] = useState(true)
	const [searchParams, setSearchParams] = useSearchParams()
	const [totalData, setTotalData] = useState();
	const [selectAll, setSelectAll] = useState(false);
	const [btnState, setBtnState] = useState('none');
	const [data, setData] = useState([]);
	const [selectedRows, setSelectedRows] = useState({});
	const [uncheckedIds, setUncheckedIds] = useState([]);
	const [checkedIds, setCheckedIds] = useState([]);
	const [checkedObject, setcheckedObject] = useState([])
	const navigate = useNavigate();
	const tabQueryStatus = searchParams.get('tab')
	const pageQueryStatus = searchParams.get('page')
	const sortQueryStatus = searchParams.get('sortBy')
	const orderQueryStatus = searchParams.get('orderBy')
	const [buttonState, setbuttonState] = useState(false)
	const urlSearchParams = new URLSearchParams(window.location.search);
	const paramsObject = Object.fromEntries(urlSearchParams.entries());
	const [isAsc, setIsAsc] = useState(orderQueryStatus === 'asc' ? true : false);
	const [currentLimit,setCurrentLimit]=useState<SelectListItem>(limitRows[1])
	const [description, setDescription] = useState("")
    const [openPopup, isOpenPopup] = useState(false);
    const [segmentName, setsegmentName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const { containerId , accountId} = useContext(AuthContext);
	
	const [endDate, setEndDate] = useState('');
	 const currentDate = new Date();
	 const currentYear = currentDate.getFullYear();
	 const formattedDate = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0))
	 const [startDate, setStartDate] = useState(moment.utc(formattedDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));

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
		handleLoaders(pageQueryStatus ||  1)
		setCurrentPage(pageQueryStatus ||  1)
	},[tabQueryStatus, containerId, currentLimit, startDate, endDate]) 

	useEffect((e)=>{
		handleOnPageChange(e, Number(pageQueryStatus))
	},[pageQueryStatus,currentLimit, startDate, endDate])

	useEffect(()=>{
		let newObj = {...selectedRows}
		
		if(data){
			if(selectAll){
				let arr = [...checkedIds]
				let rowObj = []
				for(let el of data){
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
				for(let el of data){
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
	},[selectAll, currentPage, data])

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
		if(data?.length){
			setLineLoader(true)
			setCoreLoader(false)
		}
		if(data?.length==0){
			setCoreLoader(true)
			let data = await fetchData(currentPageValue || 1, apiFilterData)
			if(data?.data?.length){
				setCoreLoader(false)
			}
		}
		
	}
	const fetchData= async(currentPageValue,filters)=>{
		if(containerId){
			let result = await fetchAudiences(currentPageValue , sortQueryStatus,filters, isAsc)
			setData(result?.data)
			setCoreLoader(false)
			setLineLoader(false)
			return result
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

	const handleSorting = async(e,columns)=>{
		if(columns?.key== 'id') return
		if(containerId){
			
			setIsAsc(!isAsc)
			setLineLoader(true)
			let result = await fetchAudiences(pageQueryStatus || currentPage || 1 ,columns?.key, apiFilterData, !isAsc)
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
	
	const calculateTotalPages =(totalData, currentLimit)=>{
		try{
			return Math.ceil(Number(totalData) / Number(currentLimit?.value))
		}catch(error){
			console.error('Error occurred:', error);
		}
	}

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
	
	const handleKeyDownPress=(event)=>{
		if (event.key === 'Enter') {
			handleLoaders(currentPage)
			fetchData(currentPage,apiFilterData)
		  }
	}

	const getTableEmptyState =()=>{
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

	return (
		<div onKeyDown={handleKeyDownPress} className="segment-audiences-container">
			
			<div className="table-parent" style={{ width: "100%", marginBottom: "7.5rem" }}>
				<TableFunctionalityBar
					filterLocationData={data || []}
					isFilterOpen={openFilter}
					handleCallApi={async(e)=>{setLineLoader(true); await fetchData(currentPage,e)}}
					sendFinalFilterData={(e)=>setApiFilterData(e)}
					handleOpenFilters={(e)=>setOpenFilter(e)}
					activeOption={'all'}
					selectAll={selectAll}
					selectedExportData={checkedObject}
					unSelectedIds={uncheckedIds}
					hidetabs={true}
				/>
				<LineLoader isVisible={lineLoader} />
				{<div className={lineLoader? 'line-loading':"audience-table-wrapper"}>
					<Table
						data={coreLoader?[{},{},{},{},{},{},{},{},{},{}] : (data || [])}
						columns={columnsAllAudience}
						showPaginationFooter={(totalData) ? true : false}
						onPageChange={(e,selectedPage)=>{handleOnPageChange(e,selectedPage); setQueryTotheUrl({...paramsObject, page:Number(selectedPage) || 1})}}
						totalPageCount={calculateTotalPages(totalData, currentLimit)}
						currentPage={currentPage}
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

