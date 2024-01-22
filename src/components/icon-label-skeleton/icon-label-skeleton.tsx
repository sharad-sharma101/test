import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonTableColoumnProps {
  isHeader: boolean;
  isDescription: boolean;
  isIcon: boolean;
}

const IconLabelSkeleton: React.FC<SkeletonTableColoumnProps> = ({
  isHeader,
  isDescription,
  isIcon,
}) => {
  return (
    <div>
      <div className="table-cell--component">
        {isIcon && (
          <div className="table-cell--icon">
            <Skeleton width={"2.5rem"} height={"2.5rem"} borderRadius={"50%"} />
          </div>
        )}
        <div className="table-cell--text">
          {isHeader && (
            <div className="table-cell--text_header text-sm--md">
              <Skeleton width={"6.5rem"} height={"1.25rem"} />
            </div>
          )}
          {isDescription && (
            <div className="table-cell--text_description text-xs">
              <Skeleton width={"15.5rem"} height={"1.125rem"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconLabelSkeleton;
