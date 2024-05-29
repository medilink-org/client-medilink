import { useState } from 'react';
import { Layout, Modal } from 'antd';
import CheckInForm from './CheckInForm';
import './style/ReceptionistHome.css';
import Appointments from './Appointments';

import ReceptionistNav from './ReceptionistNavBar';

const { Header, Content } = Layout;

const ReceptionistHome = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ReceptionistNav />
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
