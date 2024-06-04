import { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import {
  UserAddOutlined,
  UserSwitchOutlined,
  UserOutlined,
  QrcodeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import CheckInForm from './CheckInForm';
import './style/ReceptionistHome.css';
import Appointments from './Appointments';
import { Link, NavLink } from 'react-router-dom';

const { Content, Sider } = Layout;

const ReceptionistHome = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{ overflow: 'auto', height: '100vh', position: 'fixed' }}
        collapsible>
        <div className="logo">
          <Link to="/receptionist-home">
            <img
              src="/img/MediLink_Logo.png"
              alt="Logo"
              style={{ width: '100%' }}
            />
          </Link>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<UserAddOutlined />} onClick={showModal}>
            Check In Patients
          </Menu.Item>
          <Menu.Item key="2" icon={<UserSwitchOutlined />}>
            <Link to="/assign-patient" style={{ color: 'white' }}>
              Assign to Doctor
            </Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/view-patients" style={{ color: 'white' }}>
              View Patient List
            </Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<QrcodeOutlined />}>
            <Link to="/generate-qrcode" style={{ color: 'white' }}>
              QR Code
            </Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} className="sign-out">
            <NavLink to="/" style={{ color: 'white' }}>
              Sign Out
            </NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Appointments />
          </div>
        </Content>
      </Layout>
      <Modal
        title="Check-In Patient"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        <CheckInForm />
      </Modal>
    </Layout>
  );
};

export default ReceptionistHome;
