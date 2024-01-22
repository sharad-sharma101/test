import chevronUp from "../../assets/images/sidebar/chervon-up.svg"
import chevronDown from "../../assets/images/sidebar/chevron-drop-down.svg"
import "./index.sass"
import optionalTick from "../../assets/images/sidebar/optionTick.svg"
import ClickAwayListener from 'react-click-away-listener';
import { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { patchContainerEnabledState } from "../../services/containers";

interface Option {
    _id: string;
    domainName: string;
  }

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedElement: Option;
    listOfItems: Option[];
    DropDownFunction: (option: Option) => void;
  }
 
const AppDropDown = ({isOpen , setIsOpen , selectedElement , listOfItems , DropDownFunction } : Props) => {
  const {allContainers}:any=useContext(AuthContext)
    function convertString(str: string): string {
        // if (input?.length <= 20) {
        //   return input;
        // } else {
        //   return input?.substring(0, 25) + "...";
        // }
        let input = str ;
        
        if(str.split(".")){
          input = str.split(".")[0]
        }
        const maxWidth = 398;
        const fontSize = 16;
        
        const maxCharacters = Math.floor(maxWidth / fontSize); 
        if (input?.length <= maxCharacters) {
          return input;
        } else {
          return input?.substring(0, maxCharacters) + "...";
        }
    }

    const handleClickAway = () =>{
        if(isOpen){
          setIsOpen(false)
        }
    }
   

  return (

    <ClickAwayListener onClickAway={handleClickAway}>
     <div className='app-sidebar__container'>
        <div className='app-dropdown__wrapper' onClick={() => setIsOpen(!isOpen)} style={{ borderBottomLeftRadius: `${isOpen ? '0' : '4px'}` , borderBottomRightRadius: `${isOpen ? '0' : '4px'}` }} >
                <div className="dropdown-selected-option">
                    <div className="option-title">
                        <p className="text-md--md">{selectedElement?.domainName ? convertString(selectedElement?.domainName) : ''}</p>
                    </div>
                </div>
                {/* <div className="dropdown-selected-option">
                  <div className="option-title">
                    <p className="text-md--md">{selectedElement ? selectedElement?.domainName : ''}</p>
                  </div>
                </div> */}
                <div className="option-caret"><img src={isOpen ? chevronDown : chevronUp} alt="" /></div>
        </div>
        {
            isOpen && 
            <div className="app-dropdown-options " style={{borderTop: `${isOpen ? '1px solid #667085' : '0px' }`}}>
                {allContainers?.map((response: any) => (
                    <div className={`app-dropdown__wrapper domain-name-option ${response._id === selectedElement._id ? 'selected-domain-name' : ''}`} onClick={() => DropDownFunction(response)}>
                    <div className="dropdown-selected-option">
                        <div className="option-title">
                            <p className="text-md--md">{convertString(response.domainName)}</p>
                        </div>
                    </div>
                    {  response._id === selectedElement._id
                         ? 
                         <img src={optionalTick} alt="" />
                         :
                         <></>
                    }
                    </div>
                ))}
            </div>
        }
    </div>
 </ClickAwayListener>
   
  )
}

export default AppDropDown
