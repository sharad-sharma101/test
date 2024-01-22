import React, {useEffect, useRef} from 'react'
import "./index.sass";

const LineLoader = ({ isVisible }: any) => {
  const currentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (currentDiv.current) {
      currentDiv.current.style.visibility = isVisible ? "visible" : "hidden";
    }
  }, [isVisible]);
  
  return (
    <div className="line-loader-wrapper">
      <div ref={currentDiv} className="loader-line"></div>
    </div>
  );
};


export default LineLoader