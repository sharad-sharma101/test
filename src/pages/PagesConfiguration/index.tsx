import React, { useEffect, useState } from 'react'
import "./index.sass"
import PagesConfig from '../../components/pages-config'
import { useSearchParams } from 'react-router-dom'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSelectedPages } from '../../features/templates/template-slice';
import { update } from 'lodash';

const PagesConfiguration = ({ pagesData, handlePageData, isPageSelected, handleAnyPageSelected, handlePagesSelection }: any) => {
  
  const [isAllPageSelected, setIsAllPageSelected] = useState<boolean>(false)
  const [pageAvtiveState, setpageAvtiveState] = useState<any>({})
  const [check,setCheck]=useState(false)
  const dispatch=useAppDispatch()
  const {selectedPagesObject,selectedPagesforFlow}=useAppSelector((store)=>store.templateConfigs)


  useEffect(() => {
    if(isPageSelected){
      setpageAvtiveState(isPageSelected)
    }
  }, [isPageSelected])

  useEffect(() => {
    let totalSelectedPages = 0;
    pagesData.map((page: Page) => {
      if (isPageSelected[page._id]) {
        totalSelectedPages++;
      }
    })
    
    totalSelectedPages === 0 ? handleAnyPageSelected(false) : handleAnyPageSelected(true)
    totalSelectedPages === pagesData.length ? setIsAllPageSelected(true) : setIsAllPageSelected(false)
  }, [isPageSelected , check])


  function handleAllCheckboxChange() {
    const checked = !isAllPageSelected
    setIsAllPageSelected(!isAllPageSelected)
    const updatedPagesState = pagesData.reduce((element: PagesState, page: Page) => {
      element[page._id] = checked;
      return element;
    }, {});
    dispatch(setSelectedPages(updatedPagesState))

    handlePagesSelection(updatedPagesState)
    setpageAvtiveState(updatedPagesState)
  }


   useEffect(() => {
     if(check){
      setCheck(false)
     }
   }, [check])

  const getImage=(el:Page)=>{
    if(isAllPageSelected || selectedPagesObject[el._id] ){

      // return `/attryb-ui/assets/icons/pages/${el.img}-selected.svg`
      return `/pages/${el.img}-selected.svg`
    }else{
      // return `/attryb-ui/assets/icons/pages/${el.img}.svg`
      return `/pages/${el.img}.svg`
    }
  }
  
  function handlePageSelection(page: Page) {
    const newObj = { ...selectedPagesObject }; 
    newObj[page._id] = !newObj[page._id];
    setpageAvtiveState(newObj);
    dispatch(setSelectedPages(newObj));
    handlePagesSelection(newObj)
    setCheck(true);
  }
  
  const numSkeletons = 7;

  return (
    <div  className="configuration-section__pages-parent-wrapper">   
      <div className="upload-image-header-parent">
      <p className="upload-image-text display-sm--sb">{"Pages"}</p>
      <p className="upload-image-supporting-text text-md">
    {"Select which pages to display your campaign on"}
      </p>
    </div>

    {pagesData.length==0? (<div className='page-skeleton-template'>
    {Array.from({ length: numSkeletons }).map((_, index) => (
        <div key={index} className='page-skeleton-wrapper'>
          <Skeleton width={"16.5rem"} height={"9.3rem"} />
          <Skeleton width={"8rem"} height={"1.5rem"} />
        </div>
      ))}
        </div>
        ):
        (pagesData&&<>
        <div className='pages-cards-wrapper'>
        <div onClick={handleAllCheckboxChange} className={`pages-card ${isAllPageSelected||selectedPagesforFlow.length===pagesData.length?"selected-page-card":""}`}>
                  <div  className='pages-card-image-wrapper'>

               <img   src={isAllPageSelected||selectedPagesforFlow.length===pagesData.length?`/pages/allpage-selected.svg`:`/pages/allpage.svg`} alt="" />
                  </div>
                  <div className='pages-card-title'>
                    <p className='text-md'>All Pages</p>
                  </div>
        </div>
         {pagesData&&pagesData.map((el :Page)=><div onClick={()=>handlePageSelection(el)} key={el._id} 
         className={`pages-card ${selectedPagesObject[el._id]?"selected-page-card":""} ${isAllPageSelected?"selected-page-card":""}`}>
                  <div className='pages-card-image-wrapper'>
               <img  src={getImage(el)} alt="" />
                  </div>
                  <div className='pages-card-title'>
                    <p className='text-md'>{el?.name}</p>
                  </div>
        </div>)}
        </div></>)}
      
       
      </div>

    
  )
}

export default PagesConfiguration
