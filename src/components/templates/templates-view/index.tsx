import React, { lazy, useRef, useState , useEffect , useCallback } from "react";
import "./index.sass"
// const TemplateCard = lazy(() => import("../template-card"));
import carouselLeftArrow from '../../../assets/images/chevron-right--black.svg'
import carouselRightArrow from '../../../assets/images/chevron-right.svg'
import TemplateCard from "../template-card";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import AddTemplateCard from "../../add-template-card";

export default function TemplatesView({ userTemplates, masterTemplates, handleSelectTemplate, selectedTemplateId, handleEditClick , handlePreviwe ,showMyTemplate = false }:TemplatesView) {
	const [hidePrevButton, setHidePrevButton] = useState(true);
	const [hideNextButton, setHideNextButton] = useState(false);
	const carouselRef = useRef<HTMLDivElement>(null);
	const [updatedUserTemplates, setupdatedUserTemplates] = useState(userTemplates)
	const [userTemplateState, setuserTemplateState] = useState(userTemplates)
	const temp=useAppSelector((store)=>store.templateConfigs.template) || {_id:""}
  
  const scroll=272
  
  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isEndReached = scrollLeft + clientWidth >= scrollWidth-20;

      setHidePrevButton(scrollLeft <= 0);
      setHideNextButton(isEndReached);
    }
  }, []);

  const handleScrollClick = (scroll: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scroll;
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll , userTemplates]);

  useEffect(() => {
    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll , userTemplates]);
	function changeCustomTemplate () {
		if(userTemplates?.length !== userTemplateState?.length )
			return true;
		for (let i = 0; i < userTemplates.length; i++) {
			if (userTemplates[i]._id !== userTemplateState[i]._id) {
			return true;
			}
		}
		return false;
	}
  useEffect(()=>{
		let isPresentInCopies=userTemplates.find((el)=>el._id===temp._id)
		if(Object.keys(temp).length>2&&isPresentInCopies){
			let templatesWithoutSelectedOne=userTemplates.filter((el)=>el._id!==temp._id)
			let updatedTemplates=[temp,...templatesWithoutSelectedOne]
			setupdatedUserTemplates(updatedTemplates)
		}
    },[])
	useEffect(() => {
        if(changeCustomTemplate())
		    setupdatedUserTemplates(userTemplates)
	}, [userTemplates])
	
	return (
	<div className="template-view-section">
		{
			updatedUserTemplates.length || showMyTemplate ?
			<div className="custom-template--wrapper">
				<div className="template-view--header">
					<p className="text-xl--md my-template-heading ">My Templates</p>
					<p className="text-sm--sb see-all-template" >
						{
							showMyTemplate ? 
							<Link to="/template-library/my-templates" >See All</Link>	:
							 'See All'
						}
					</p>
				</div>

				 <div className="user-template--container">
					<div className="user-template-section">
							    {hidePrevButton ? 
								  <div></div> :
								  <div onClick={()=>handleScrollClick(-scroll)}  className='carousel-prev-button'>
							        <div className='carousel-chevron-wrapper' >
								      <img src={carouselLeftArrow} alt="" />
									</div>
								  </div>
                                 }
						<div className="user-template-carousel" ref={carouselRef}>
							{
								showMyTemplate && <AddTemplateCard/>
							}
						{updatedUserTemplates.slice(0,10).map((template, idx) => (
							<TemplateCard
								template={template}
								handleSelectTemplate={handleSelectTemplate}
								active={showMyTemplate ? false :  temp._id === template._id}
								handleEditClick={handleEditClick}
								handlePreviwe={handlePreviwe}
								key={idx}
								/>
						))}
						</div>
						
								{hideNextButton ? 
								  <div></div> :
								  <div onClick={()=>handleScrollClick(scroll)} className='carousel-next-button'>
							        <div className='carousel-chevron-wrapper' >
								        <img src={carouselRightArrow} alt="" />
									</div>
								   </div>
                                 }
					</div>
				</div>
			</div> 
			: <></>
		}

			{masterTemplates&&<div className="master-template--container">
				<div className="text-xl--md master-template--header ">From Our Library</div>
				<div className="master-template-section">
					
					{masterTemplates.slice().reverse().map((template, idx) => (
						<TemplateCard {...template}
							template={template}
							handleSelectTemplate={handleSelectTemplate}
							active={showMyTemplate ? false : temp._id === template._id}
							handleEditClick={handleEditClick}
							handlePreviwe={handlePreviwe}
							key={idx}/>
					))}
				</div>			
			</div>}

		</div>
	);
}

