// components/GenericLayout.tsx
//@ts-nocheck
import React, { ReactNode, ReactPortal } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import LayoutWithoutSidebar from './LayoutWithoutSidebar';

interface LayoutProps extends RouteProps {
  withSidebar?: boolean;
  Component: React.ComponentType<any>;
}

const Layout: React.FC<LayoutProps> = ({
  withSidebar = true,
  Component,
  ...rest
}) => {
  const LayoutWrapper = withSidebar ? LayoutWithSidebar : LayoutWithoutSidebar;

  return (
    <LayoutWrapper>
        <Component {...rest} />
    </LayoutWrapper>
  );
};

export default Layout;
