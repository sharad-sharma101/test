import React, { ReactNode } from 'react';

const LayoutWithoutSidebar: React.FC<{children:ReactNode}> = ({ children }) => {
  return (
      <>{children}</>
  );
};

export default LayoutWithoutSidebar;
