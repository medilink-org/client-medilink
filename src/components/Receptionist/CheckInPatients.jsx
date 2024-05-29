import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import CheckInForm from './CheckInForm';
import axiosInstance from '../../axiosInstance';
import './CheckInPatients.css';

const CheckInPatients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (patientData) => {
    try {
      const response = await axiosInstance.post('/patient', patientData);
      if (response.status === 200) {
        setIsModalOpen(false);
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } catch (error) {
      console.error('Error checking in patient:', error);
      return Promise.reject();
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpenModal}>
        Check In Patients
      </Button>
      <Modal
        title="Check-In Patient"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}>
        <CheckInForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default CheckInPatients;
