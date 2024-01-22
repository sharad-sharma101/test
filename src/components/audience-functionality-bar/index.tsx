
import { Button } from "@attrybtech/attryb-ui"
import "./index.sass"
import SearchBarComponent from "../search-bar-component";

type Props = {
  setSearchItem:(e:string)=>void;
};

const AudienceTableFunctionalityBar= ({setSearchItem}:Props) => {


  return(
          
		  <div className="top-functionality--wrapper">
        <div className="left-container--wrapper"></div>
        <div className="right-container--wrapper">
          <SearchBarComponent placeholder={''} isOpenInit={false} onTextChange={setSearchItem} />
					<Button variant="solid" colorScheme="secondary"> <img src="/attryb-ui/assets/icons/loader/filter-linesicon.svg" />Filters</Button>
        </div>
      </div>
    )
}

export default AudienceTableFunctionalityBar;