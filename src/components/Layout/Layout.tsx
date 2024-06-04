import React from 'react';
import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const { Content } = AntLayout;

const Layout = () => {
  const location = useLocation();
  let role;

  if (location.pathname.startsWith('/admin')) {
    role = 'admin';
  } else if (location.pathname.startsWith('/receptionist')) {
    role = 'receptionist';
  } else if (location.pathname.startsWith('/practitioner')) {
    role = 'practitioner';
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Navbar role={role} />
      <AntLayout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: '16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
