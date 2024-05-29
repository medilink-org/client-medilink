import React from 'react';
import QRCode from 'qrcode.react';
import { Typography, Button, Space } from 'antd';
import './style/GenerateQRCode.css';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const GenerateQRCode = () => {
  const devUrl = 'http://localhost:5173/checkin';
  const prodUrl = 'https://medilink-frontend.onrender.com/checkin';
  const url = import.meta.env.VITE_BUILD_ENV === 'dev' ? devUrl : prodUrl;

  return (
    <div className="qr-code-container">
      <Title level={2}>Patient Check-in</Title>
      <Paragraph>
        Scan the QR code below to access the patient check-in form.
      </Paragraph>
      <Space direction="vertical" size="large">
        <QRCode value={url} size={256} />
        <Link to={url}>
          <Button type="primary">Open Check-in Form</Button>
        </Link>
      </Space>
    </div>
  );
};

export default GenerateQRCode;
