import "./index.sass"
import { Badge } from "@attrybtech/attryb-ui";
import { useState , useRef, KeyboardEventHandler} from "react";
import ClickAwayListener from "react-click-away-listener";
import { putCampaign } from "../../../../services/campaigns";
import { handleUpdateCampaignInRedux } from "../../../../features/core-feature-configs/core-features-slice";
import { useAppDispatch } from "../../../../app/hooks";
import { setAlertVisible } from "../../../../features/globalConfigs/global-slice";
type Props = {
    heading: string;
    description: string;
    headingTypeClass?: string;
    descriptionTypeClass?: string;
    pillStatus?: boolean,
    editable?: boolean ,
    onclickAway ?: (str: string) => void,
    descriptionCallback?: (str: string) => void ,
    handleKeyDown?:(event: React.KeyboardEvent<HTMLHeadingElement>)=>void
    campaign?:any
};

const HeaderContent = ({
    heading,
    description,
    headingTypeClass="display-sm--sb",
    descriptionTypeClass="text-md",
    pillStatus,
    editable=false,
    descriptionCallback,
    onclickAway,handleKeyDown,
    campaign
}: Props) => { 
    const [headerHeading, setheaderHeading] = useState<string>(heading)
    const [prevHeading,setPrevHeading]=useState<string>(heading)
    const [descriptionContent, setDescriptionContent] = useState<string>(description)
    const [prevDescription,setPrevDescription]=useState<string>(description)

    const inputRef = useRef<HTMLHeadingElement | null>(null)
    const descriptionRef = useRef<HTMLHeadingElement | null>(null)

    const dispatch=useAppDispatch()
   
    async function handleCampaignNameChanges () {

        let text = ""
        if(inputRef.current)
            text = inputRef.current.textContent || ""

        if (text.trim().length === 0) {
            setheaderHeading(prevHeading)
            if(inputRef.current)
                inputRef.current.textContent = prevHeading
            return
        } else {
            setheaderHeading(text)
        }

        if(prevHeading===text)return
        try {
            await putCampaign(campaign._id , {name : text})
            setPrevHeading(text)
                dispatch(handleUpdateCampaignInRedux({campaign,name:text}))
                dispatch(setAlertVisible({theme:"success",content:`Campaign Renamed Successfully`,visible:true}))
        } catch (error) {
            dispatch(setAlertVisible({theme:"warning",content:`Failed to Rename Campaign`,visible:true}))
        }
    }
    async function handleDescriptionChanges () {
        let text = ""
        if(descriptionRef.current)
            text = descriptionRef.current.textContent || ""

        if (text.trim().length === 0) {
            setDescriptionContent(prevDescription)
            if(descriptionRef.current)
            descriptionRef.current.textContent = prevDescription
            return
        } else {
            setDescriptionContent(text)
        }
        if(prevDescription===descriptionContent)return
        await putCampaign(campaign._id , {description : text})
        setPrevDescription(text)
        dispatch(handleUpdateCampaignInRedux({campaign,description:text}))
        dispatch(setAlertVisible({theme:"success",content:`Campaign Description Changed Successfully`,visible:true}))
    }

    const handleKeyDownCampaignName=(e:React.KeyboardEvent)=>{
        if(e.key==="Enter"){
            e.preventDefault()
            if(e.target instanceof HTMLElement){
                e.target.blur()
            }
            handleCampaignNameChanges()
        }
    }
    const handleKeyDownCampaignDescription=(e:React.KeyboardEvent)=>{
        if(e.key==="Enter"){
            e.preventDefault()
            if(e.target instanceof HTMLElement){
                e.target.blur()
            }
            handleDescriptionChanges()
        }
    }
      
    return (
        <div className="header-of-section">
            <div className="heading--header-of-section">
          
            <ClickAwayListener onClickAway={(e)=>handleCampaignNameChanges()}>
            <h1 ref={inputRef} onKeyDown={handleKeyDownCampaignName} 
                 contentEditable={editable} spellCheck={false} className={headingTypeClass}>{headerHeading}</h1>
            </ClickAwayListener>

                {(pillStatus === true || pillStatus === false) && (
                    <Badge
                        labelText={pillStatus === true ? 'Active' : pillStatus === false ? 'Inactive' : ''}
                        variant={pillStatus === true ? 'success' : pillStatus === false ? 'danger' : ''}                            
                        isDot={true}
                    />
                )}

            </div>
            <div className="header-description-section">
              <ClickAwayListener onClickAway={(e)=>handleDescriptionChanges()}>
              <p  onKeyDown={handleKeyDownCampaignDescription} ref={descriptionRef}  contentEditable={editable} spellCheck={false} className={descriptionTypeClass}>{descriptionContent}</p>
              </ClickAwayListener>
            </div>

            
        </div>
    )
}

export default HeaderContent;