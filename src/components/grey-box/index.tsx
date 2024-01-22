import React from 'react';

type Props = {
  width: number;
  height: number;
  radius: number;
};

const GreyContainer: React.FC<Props> = ({ width, height, radius }) => {
  const style = {
    width: `${width}rem`,
    height: `${height}rem`,
    borderRadius: `${radius}rem`,
    background: `var(--color--gray-100)`
  };

  return <div style={style}></div>;
};

export default GreyContainer;
