import { useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import {
  UserAddOutlined,
  UserSwitchOutlined,
  UserOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import CheckInForm from './CheckInForm';
import './style/ReceptionistHome.css';
import Appointments from './Appointments';
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

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
      <Sider collapsible>
        <div className="logo">
          <img
            src="/img/MediLink_Logo.png"
            alt="Logo"
            style={{ width: '100%' }}
          />
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
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0 }}></Header>
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
