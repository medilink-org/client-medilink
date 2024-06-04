import { Layout } from 'antd';
import './style/ReceptionistHome.css';
import Appointments from './Appointments';

const { Content } = Layout;

const ReceptionistHome = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
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
    </Layout>
  );
};

export default ReceptionistHome;
