
// import "./index.sass"
import React, { useState, useRef, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import "./index.sass"

type Props = {
    width?: string | number;
    placeholder?: string;
    isOpenInit?: boolean;
    onTextChange?:(e:string)=>void
};


const SearchBarComponent = ({width, placeholder="Search", isOpenInit=true,onTextChange }:Props) => { 
    const [toggleMode, setToggleMode]  = useState<boolean>(isOpenInit)  
    const inputRef = useRef<HTMLInputElement>(null);  
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleClickAway);
        };
    }, []);
    useEffect(() => {
        if (toggleMode && inputRef.current) {
          inputRef.current.focus();
        }
      }, [toggleMode]);
    const handleSearchFunctionality = () => {

        // perform the search functionality here 

    };
    const handleOpen = () => {
            setToggleMode(!toggleMode);
    };

    const handleClickAway = () => {
        setToggleMode(false);
        if(onTextChange){
            onTextChange("")
         }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setToggleMode(false);
            if(onTextChange){
                onTextChange("")
             }
        }
      };

   

    return(
        <>
        {toggleMode ? 
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className="search-bar--wrapper" style={{width}}>
            <div className="search-bar--content">
                <div className="search-bar--imageicon" onClick={handleSearchFunctionality}><img src={"/attryb-ui/assets/icons/table/search.svg"} alt="" /></div>
                <div className="search-bar--input text-sm">
                    <input ref={inputRef} onChange={(e)=>{
                        if(onTextChange){onTextChange(e.target.value)}
                    }}
                    className = "text-sm" type="text" placeholder={placeholder} name="search" /></div>
            </div>
            </div>
        </ClickAwayListener>
        :
            <div className="search-bar--imageicon search-bar--btn" onClick={handleOpen}>
                <img src={"/attryb-ui/assets/icons/table/search.svg"} alt="searchIcon" />
            </div>

        }
        </>
    )
}

export default SearchBarComponent;