import "./index.sass"
import searchIcon from "../../assets/images/sidebar/search.svg"
import React, { useContext, useState, useEffect, useRef } from "react";

// type Props = {
//     toggleMode: boolean;
// };

type Props = {
    width?: string | number;
    placeholder?: string;
    handleSearchInput?: any;
};


const SearchBarComponent = ({width, placeholder="Search",handleSearchInput}:Props) => { 
    const [toggleMode, setToggleMode]  = useState<boolean>(false)
    const [searchInput, setsearchInput] = useState<string>("")
    const searchInputRef = useRef(null);
    const handleSearchFunctionality = () => {};
    const handleOpen = () => {setToggleMode(!toggleMode)};
    useEffect(() => {
        handleSearchInput(searchInput)
    }, [searchInput])
    function handleOnChange(event: any) {
        setsearchInput(event.target.value)
    }

    return(
        <>
        {toggleMode ? 
            <div className="search-bar--wrapper" style={{width}}>
            <div className="search-bar--content">
                <div className="search-bar--imageicon" onClick={handleSearchFunctionality}><img src={searchIcon} alt="" /></div>
                <div className="search-bar--input text-sm"><input className = "text-sm" type="text" onChange={(event) => handleOnChange(event)} value={searchInput} placeholder={placeholder} name="search" /></div>
            </div>
            </div>
        :
            <div className="search-bar--imageicon search-bar--btn" onClick={handleOpen}>
                <img src={searchIcon} alt="" />
            </div>

        }
        </>
    )
}

export default SearchBarComponent;