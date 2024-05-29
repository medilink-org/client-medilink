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
    <Sider collapsible>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<UserAddOutlined />}>
          <Button type="link" onClick={showModal} style={{ color: 'white' }}>
            Check In Patients
          </Button>
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
        <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
          <Link to="/doctor-page" style={{ color: 'white' }}>
            Doctor page
          </Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<QrcodeOutlined />}>
          <Link to="/generate-qrcode" style={{ color: 'white' }}>
            QR Code
          </Link>
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

export default ReceptionistNav;
