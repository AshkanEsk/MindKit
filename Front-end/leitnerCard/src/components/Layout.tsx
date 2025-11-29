import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarFunction from './navbar';

const Layout: React.FC = () => {
  return (
    <>
      <NavbarFunction />
      <Outlet />
    </>
  );
};

export default Layout;
