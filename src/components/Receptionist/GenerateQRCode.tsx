import React from 'react';
import QRCode from 'qrcode.react';
import { Typography, Button, Space } from 'antd';
import './GenerateQRCode.css';

const { Title, Paragraph } = Typography;

const GenerateQRCode = () => {
  const url = 'http://localhost:5173/checkin';

  return (
    <div className="qr-code-container">
      <Title level={2}>Patient Check-in</Title>
      <Paragraph>
        Scan the QR code below to access the patient check-in form.
      </Paragraph>
      <Space direction="vertical" size="large">
        <QRCode value={url} size={256} />
        <Button type="primary" href={url} target="_blank">
          Open Check-in Form
        </Button>
      </Space>
    </div>
  );
};

export default GenerateQRCode;
