// DoctorAvailabilityPage.tsx
import React from 'react';
import DoctorAvailability from './DoctorAvailabilty';
import { useParams } from 'react-router-dom';

const DoctorAvailabilityPage = () => {
  const { doctorId } = useParams();

  return (
    <div>
      <DoctorAvailability doctorId={doctorId} />
    </div>
  );
};

export default DoctorAvailabilityPage;
