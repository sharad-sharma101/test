// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react';
import "./index.sass";
import AppPopup from '../../../components/app-popup';
import TextInput from '../../../components/text-input/index';
import cirleIcon from "../../../assets/icons-v2/circle-icon.svg"
import bulbIcon from "../../../assets/icons-v2/BulbFeatured icon.svg"
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import { Button } from '@attrybtech/attryb-ui'
import { List, ListItem } from "@attrybtech/attryb-ui"
import { getSegmentObject, objectKeys } from '../../../utils/helpers';
import  variantService from "../../../services/configurations"
import { AuthContext } from '../../../auth/AuthContext';
import { getCampaigns } from '../../../services/campaigns';
import { createCampaign } from '../../../services/campaigns';
import { useNavigate } from "react-router-dom";
import ClickAwayListener from "react-click-away-listener";
import { useAppDispatch , useAppSelector } from '../../../app/hooks';
import { setAlertVisible } from '../../../features/globalConfigs/global-slice';
import { callCoreFeaturesApiData } from '../../../features/core-feature-configs/core-features-slice';

export const CreateCampaignPopup: React.FC<any> = ({ isOpen,useCase,segment, close,handleCreateCampaignPopup }) => {
    const [campaigns, setCampaigns] = useState([{}, {}, {}]);
    const [activeUseCase, setActiveUseCase] = useState();
    const [activeSegment, setActiveSegment] = useState();
    const [useCaseArray, setUseCaseArray] = useState([]);
    const [description, setDescription] = useState("")
    const [segmentArray, setSegmentArray] = useState([]);
    const [openPopup, isOpenPopup] = useState(true);
    const authContext: any = useContext(AuthContext);
    const [campaignName, setCampaignName] = useState("");
    const [isBtnClick, setIsBtnClick] = useState(false);
    const [openAlert, isOpenAlert] = useState(false);
    const [isCampaign, setIsCampaign] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch=useAppDispatch()
    const navigate = useNavigate();
    const handler=(e)=>{
        close()        
        isOpenPopup(e)
    }
    const {reduxSegments , reduxCampaigns}=useAppSelector((store)=>store.coreFeaturesSlice)
    useEffect(()=>{
        if(useCase.length === 1){
            setActiveUseCase({
                    _id: useCase[0]._id,
                    value:useCase[0].meta?.header,
                    data: useCase[0]
                })
        }
        if(segment.length === 1){
            setActiveSegment({
                _id: segment[0]._id,
                value:segment[0].meta?.header,
                data: segment[0]
            })
        }
    },[])
    useEffect(() => {   
        if (objectKeys(useCase)) {
            const updatedList = useCase?.map((t: any) => {
                return {
                    _id: t._id,
                    value: t.meta?.header,
                    data: t
                }
            })
            setUseCaseArray(updatedList)
        } 
    }, [useCase])
   
    useEffect(()=>{
        if (objectKeys(segment)) {
            const updatedList = segment?.map((t: any) => {
                return {
                    _id: t._id,
                    value: t.meta?.header,
                    data: t
                }
            })
            setSegmentArray(updatedList)
        }
    },[segment])
    // useEffect(() => {
    //     if(!openPopup){
    //         close(false)
    //     }
        
    // },[isOpen , openPopup])


    const handleChange = () => {
        setshowPopup(false)
      }

    const selectUseCaseHandler = (item: any) => {
        setActiveUseCase(item)
        isOpenPopup(true)

    }
    const selectSegementHandler = (item: any) => {
        setActiveSegment(item)
    }
    
    const handleCreateNewVariant = async () => {
        setIsLoading(true);
        setIsBtnClick(true);
        const resp = await getCampaigns(`accountId=${authContext.accountId}&containerId=${authContext.containerId}&useCaseId=${activeUseCase._id}&segmentId=${activeSegment._id}&isDeleted=false`) || [];
        
        setCampaigns(resp);
        if (resp.length !== 0) {
          setIsCampaign(true);
          dispatch(setAlertVisible({content:"Campaign already Exists!",visible:true,theme:"danger",ctaData:{
            route:`/my-campaigns/${resp[0]._id}`,title:"Go To Campaign"
          }}))
        //   <Alert variant = "inActive" content={`This Campaign already exists!`} timeSpan={1000} handleClose={()=>{isOpenAlert()}} />
          setIsLoading(false);
          
        } else {
          try {
            setIsLoading(true);
            // setIsCampaign(true);
            let isCampaignNameUnique = true;
            reduxCampaigns.map((ele: any) => {
                if(ele.name.toLowerCase() === campaignName.toLowerCase())
                       isCampaignNameUnique = false
            })
            if(!isCampaignNameUnique) {
                    dispatch(setAlertVisible({content:"Camapign name already exists! Please change the campaign name to proceed.",visible:true,theme:"danger"}))
                    setIsLoading(false);
                    return;
            }
            const campaignBody = {useCaseIds: [activeUseCase._id],
                accountId: authContext.accountId,
                containerId: authContext.containerId,
                name:  campaignName ,
                description : description} 
                
            if(activeSegment.data.type === 'custom') {
                campaignBody.customSegmentIds = [activeSegment._id]
            } else {
                campaignBody.segmentIds = [activeSegment._id]
            }
            const campaign = await createCampaign(campaignBody);
            const variantBody = {accountId: authContext.accountId,
                containerId: authContext.containerId,
                useCaseId: activeUseCase._id,
                campaignId: campaign._id,
                configuration: {}}
            if(activeSegment.data.type === 'custom') {
                variantBody.customSegmentId = activeSegment._id
            } else {
                variantBody.segmentId = activeSegment._id
            }
            const variant = await variantService.postConfiguration(variantBody);
            dispatch(callCoreFeaturesApiData(true))
            navigate(`/variants/${variant._id}/template`);
          } catch (error) {
            console.log("Error occurred during campaign creation:", error);
          }
        }
    };
    
    const changeCross = () => {
        isOpenPopup(false)
        handleCreateCampaignPopup()
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
                        <p>Create New Campaign</p>
                    </div>
                    <div className='create-campaign-popup-subheader-text text-sm'>Choose a Use Case and Segment to get started</div>
                </div>
            </div>
        )
    }

    const PopupBody = () => {
        return (
            <div className="create-campaign-popup-body">
                <div className="create-campaign-input">
                    <TextInput
                        label={"Campaign Name"}
                        placeholder="Enter a Campaign Name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}                    />
                </div>
                <div className="create-campaign-input">
                    <TextInput
                        label={"Description"}
                        placeholder="Enter a Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="use-case-drop-down-list">
                    <div className="create-campaign-label-text text-xs--b">
                        <p>Use Case</p>
                    </div>
                    <div className='use-cases-list-item'>
                        {!!useCaseArray.length &&
                            <List
                                list={useCaseArray}
                                activeItem={activeUseCase}
                                buttonPlaceholder="Select a Use Case"
                                buttonState={useCase.length==1? "disabled":"default"}
                                selectCallback={selectUseCaseHandler}>
                                {useCaseArray.map((item: any) => {
                                    return (
                                        <ListItem key={item._id} data={item}>
                                            {item?.data?.meta?.header}
                                        </ListItem>
                                    )
                                })}
                            </List>
                        }
                    </div>
                </div>
                <div className="segment-drop-down-list">
                    <div className="create-campaign-label-text text-xs--b">
                        <p>Segment</p>
                    </div>
                    <div className='segment-list-item'>
                        {!!segmentArray.length && 
                        <List
                            list={segmentArray}
                            activeItem={activeSegment}
                            buttonPlaceholder="Select a Segment"
                            buttonState={segment.length==1? "disabled":"default"}
                            selectCallback={selectSegementHandler}>
                            {segmentArray.map((item: any) => {
                                return (
                                    <ListItem key={item._id} data={item}>
                                        {item?.data?.meta?.header}
                                    </ListItem>
                                )
                            })}
                        </List>
                        }
                    </div>
                </div>
            </div>
        )
    }
    const PopupFooter = () => {
        return (
            <>
            <div className="create-campaign-submit-buttons">
                <Button onClick={() => changeCross()} variant="solid" colorScheme="secondary">
                    Cancel
                </Button>
                    <Button onClick={handleCreateNewVariant} variant="solid"
                        style = {{ minWidth : "10rem" }}
                        state={activeUseCase &&
                        activeSegment &&
                        campaignName ?
                        (isLoading && "loading") :
                            "disabled"} >
                    Create Campaign
                </Button>
            </div>

            </>
          

         
        )
    }
    
    return (
        
        <div className="create-campaign-popup-container">
            <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter()} openModal={openPopup} setOpenModal={isOpen} />
   
           
        </div>
        

    )
}