import React, { useState } from 'react';
import { Layout, Menu, Card, Button, Modal } from 'antd';
import {
  UserAddOutlined,
  UserSwitchOutlined,
  UserOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import CheckInForm from './CheckInForm';
import './ReceptionistHome.css';

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

  const handleViewPatients = () => {
    window.location.href = '/view-patients';
  };

  const handleAssignPatient = () => {
    window.location.href = '/assign-patient';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<UserAddOutlined />}>
            <Button type="link" onClick={showModal} style={{ color: 'white' }}>
              Check In Patients
            </Button>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserSwitchOutlined />}>
            <Button
              type="link"
              onClick={handleAssignPatient}
              style={{ color: 'white' }}>
              Assign to Doctor
            </Button>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Button
              type="link"
              onClick={handleViewPatients}
              style={{ color: 'white' }}>
              View Patient List
            </Button>
          </Menu.Item>
          <Menu.Item key="4" icon={<QrcodeOutlined />}>
            <Button
              type="link"
              href="/generate-qrcode"
              style={{ color: 'white' }}>
              QR Code
            </Button>
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
            style={{ padding: 24, minHeight: 360 }}>
            <Card title="Dashboard" bordered={false}>
              <p>
                Welcome to the Receptionist Dashboard. Use the menu on the left
                to navigate through different actions.
              </p>
            </Card>
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