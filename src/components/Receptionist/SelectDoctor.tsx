import React from 'react';
import { Card } from 'antd';
import './style/reception_style.css';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const SelectDoctor: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectDoctor = (doctorId: string) => {
    navigate(`/receptionist-doctor-page/${doctorId}`);
  };

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '20px' }}>
        <h2>Select a Doctor</h2>
        <p>Choose the doctor you want to see and schedule an appointment.</p>
      </Card>
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
