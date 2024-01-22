import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "./index.sass";

const TemplateSkeletonComponent = () => {
  const skeletonData = Array.from({ length: 10 }); // Creating an array with length 10

  return (
    <div>
      <div className='skeleton-template'>
        {skeletonData.map((_, index) => (
          <div className='skeleton-wrapper' key={index}>
            <Skeleton width={"14.3125rem"} height={"10.25rem"} />
            <div>
              <Skeleton width={"7rem"} height={"1.5rem"} />
              <Skeleton width={"4rem"} height={"1.125rem"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSkeletonComponent;
