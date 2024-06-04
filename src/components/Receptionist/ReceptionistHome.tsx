import { useState } from 'react';
import { Layout, Modal } from 'antd';
import CheckInForm from './CheckInForm';
import './style/ReceptionistHome.css';
import Appointments from './Appointments';

import ReceptionistNav from './ReceptionistNavBar';

const { Content, Sider } = Layout;

const ReceptionistHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}>
        <CheckInForm />
      </Modal>
    </Layout>
  );
};

export default ReceptionistHome;
