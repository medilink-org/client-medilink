import React, { useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import {
  UserAddOutlined,
  UserSwitchOutlined,
  UserOutlined,
  QrcodeOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CheckInForm from './CheckInForm';
import './style/ReceptionistHome.css';

const { Sider } = Layout;

const ReceptionistNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    {
      key: '1',
      icon: <UserAddOutlined />,
      label: (
        <Button type="link" onClick={showModal} style={{ color: 'white' }}>
          Check In Patients
        </Button>
      )
    },
    {
      key: '2',
      icon: <UserSwitchOutlined />,
      label: (
        <Link to="/assign-patient" style={{ color: 'white' }}>
          Assign to Doctor
        </Link>
      )
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: (
        <Link to="/view-patients" style={{ color: 'white' }}>
          View Patient List
        </Link>
      )
    },
    {
      key: '4',
      icon: <UsergroupAddOutlined />,
      label: (
        <Link to="/doctor-page" style={{ color: 'white' }}>
          Doctor page
        </Link>
      )
    },
    {
      key: '5',
      icon: <QrcodeOutlined />,
      label: (
        <Link to="/generate-qrcode" style={{ color: 'white' }}>
          QR Code
        </Link>
      )
    }
  ];

  return (
    <Sider collapsible>
      <div className="logo">
        <img
          src="/img/MediLink_Logo.png"
          alt="Logo"
          style={{ width: '100%' }}
        />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={menuItems}
      />
      <Modal
        title="Check-In Patient"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}>
        <CheckInForm />
      </Modal>
    </Sider>
  );
};

export default ReceptionistNav;
