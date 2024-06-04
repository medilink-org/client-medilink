import React, { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import {
  UserAddOutlined,
  UserSwitchOutlined,
  UserOutlined,
  QrcodeOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import CheckInForm from '../Receptionist/CheckInForm';
import { useStore } from '../../store';

const { Sider } = Layout;

const Navbar = ({ role }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { practitionerId } = useStore();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/admin-home'
          },
          {
            key: '2',
            icon: <UserOutlined />,
            label: 'Manage Users',
            path: '/admin-users'
          },
          {
            key: '3',
            icon: <SettingOutlined />,
            label: 'Settings'
            // path: '/admin-settings' // add in the future
          }
        ];
      case 'receptionist':
        return [
          {
            key: '1',
            icon: <UserAddOutlined />,
            label: 'Check In Patients',
            action: showModal
          },
          {
            key: '2',
            icon: <UserSwitchOutlined />,
            label: 'Assign to Doctor',
            path: '/receptionist-assign-patient'
          },
          {
            key: '3',
            icon: <UsergroupAddOutlined />,
            label: 'Doctor Page',
            path: '/receptionist-doctor-page'
          },
          {
            key: '4',
            icon: <UserOutlined />,
            label: 'View Patient List',
            path: '/receptionist-view-patients'
          },
          {
            key: '5',
            icon: <QrcodeOutlined />,
            label: 'QR Code',
            path: '/receptionist-generate-qrcode'
          }
        ];
      case 'practitioner':
        return [
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/practitioner-home'
          },
          {
            key: '2',
            icon: <UserOutlined />,
            label: 'My Patients'
            // path: '/practitioner-patients' // add in the future
          },
          {
            key: '3',
            icon: <ScheduleOutlined />,
            label: 'Availability',
            path: `/practitioner-availability/${practitionerId}`
          }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Determine home path based on role
  const homePath = () => {
    switch (role) {
      case 'admin':
        return '/admin-home';
      case 'receptionist':
        return '/receptionist-home';
      case 'practitioner':
        return '/practitioner-home';
      default:
        return '/';
    }
  };

  return (
    <Sider
      collapsible
      style={{ overflow: 'auto', height: '100vh', position: 'fixed' }}>
      <div className="logo">
        <Link to={homePath()}>
          <img
            src="/img/MediLink_Logo.png"
            alt="Logo"
            style={{ width: '100%' }}
          />
        </Link>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        {menuItems.map((item) =>
          item.path ? (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path} style={{ color: 'white' }}>
                {item.label}
              </Link>
            </Menu.Item>
          ) : (
            <Menu.Item key={item.key} icon={item.icon} onClick={item.action}>
              {item.label}
            </Menu.Item>
          )
        )}
        <Menu.Item key="signout" icon={<LogoutOutlined />}>
          <NavLink to="/" style={{ color: 'white' }}>
            Sign Out
          </NavLink>
        </Menu.Item>
      </Menu>
      <Modal
        title="Check-In Patient"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        <CheckInForm />
      </Modal>
    </Sider>
  );
};

export default Navbar;
