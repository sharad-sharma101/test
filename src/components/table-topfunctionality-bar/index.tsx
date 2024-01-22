
import { Button } from "@attrybtech/attryb-ui"
import SearchBarComponent from "../search-bar-component"
import "./index.sass"
import { useState,useEffect } from "react";

type Props = {
    searchBarPlaceholder?: string;
    activeOption?:any
    addNewBtnPlaceholder?: string;
    defaultSelected?: string;
    addBtnCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isVariantCreation:(e:string)=>void;
    viewallCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    activeCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    inactiveCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    setSearchItem:(e:string)=>void;

};

const TableTopFunctionalityBar= ({searchBarPlaceholder= "Search",isVariantCreation, addNewBtnPlaceholder, addBtnCallback, viewallCallback, activeCallback, inactiveCallback, defaultSelected, activeOption,setSearchItem}:Props) => {
  

  const [viewallFilterClickedState,  setViewallFilterClickedState] = useState(defaultSelected === 'viewall'? true : false);
  const [activeFilterClickedState,  setActiveFilterClickedState] = useState(defaultSelected === 'active' ? true : false);
  const [inactiveFilterClickedState,  setInactiveClickedState] = useState(defaultSelected === 'inactive' ? true : false);
  

  const handlefilterClickViewAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveFilterClickedState(false);
    setInactiveClickedState(false);
    setViewallFilterClickedState(true);
        if (viewallCallback) {
        viewallCallback(e);
    }
};

  
  const handleFilterClickActive = (e: React.MouseEvent<HTMLButtonElement>) => {
    setViewallFilterClickedState(false);
    setInactiveClickedState(false);
    setActiveFilterClickedState(true);
    if (activeCallback) {
      activeCallback(e);
  }
  }

  const handleFilterClickInactive = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveFilterClickedState(false);
    setViewallFilterClickedState(false);
    setInactiveClickedState(true);
    if (inactiveCallback) {
      inactiveCallback(e);
  }
  }
useEffect(()=>{

},[activeOption])
  return(
          
		  <div className="top-functionality--wrapper">
      <div className="left-container--wrapper">
        <Button
          onClick={handlefilterClickViewAll}
          variant="solid"
          state={activeOption === 'all' ? 'clicked' : ''}
          colorScheme="secondary"
          style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderRight: '0px' }}
        >
          View All
        </Button>
        <Button
          onClick={handleFilterClickActive}
          variant="solid"
          state={activeOption === 'active' ? 'clicked' : ''}
          colorScheme="secondary"
          style={{ borderRadius: '0px', borderRight: '0px'}}
        >
          Active
        </Button>
        <Button
          onClick={handleFilterClickInactive}
          variant="solid"
          state={activeOption === 'inactive' ? 'clicked' : ''}
          colorScheme="secondary"
          style={{  borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
        >
          Inactive
        </Button>
      </div>
       <div className="right-container--wrapper">
                        <SearchBarComponent placeholder={searchBarPlaceholder} isOpenInit={false} onTextChange={setSearchItem} />
                        {addNewBtnPlaceholder &&                         
                        <Button state={isVariantCreation} variant="solid" colorScheme="secondary" onClick={addBtnCallback}>
                          <img src="/attryb-ui/assets/icons/button/IconPlusBlack.svg"></img>
                          <p className="text-sm--sb">{addNewBtnPlaceholder} </p>
                        </Button>}

                        <Button variant="solid" colorScheme="secondary"> <img src="/attryb-ui/assets/icons/loader/filter-linesicon.svg" />Filters</Button>

                      </div>
      </div>
    )
}

export default TableTopFunctionalityBar;