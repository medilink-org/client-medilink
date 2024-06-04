import React from 'react';
import { Card } from 'antd';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material';
import TopBar from '../PatientView/TopBar';
import './style/reception_style.css';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const SelectDoctor: React.FC = () => {
  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    practitioner: null,
    path: null
  };

  const navigate = useNavigate();

  const handleSelectDoctor = (doctorId: string) => {
    navigate(`/doctor-page/${doctorId}`);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar {...topBarProps} />
      </Box>
      <div className="doctors-cards">
        <Card
          hoverable
          onClick={() => handleSelectDoctor('65e782efdfd64159ca0b52d2')}
          className="doctor-card"
          style={{ width: 240 }}
          cover={
            <img alt="Picture of Dr. Johnson" src="/img/dr_johnson.webp" />
          }>
          <Meta title="Dr. Johnson" description="General Practitioner" />
        </Card>
        <Card
          hoverable
          onClick={() => handleSelectDoctor('65e7830edfd64159ca0b52d4')}
          className="doctor-card"
          style={{ width: 240 }}
          cover={<img alt="Picture of Dr. Ford" src="/img/dr_ford.jpg" />}>
          <Meta title="Dr. Ford" description="Eye specialist" />
        </Card>
      </div>
    </>
  );
};

export default SelectDoctor;
