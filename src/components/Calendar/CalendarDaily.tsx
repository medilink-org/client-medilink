import { styled } from 'styled-components';
import AppointmentCard from './AppointmentCard';
import React from 'react';

interface Props {
  patients: Patient[];
  practitioner: Practitioner;
  appointments: Appointment[];
}

export default function CalendarDaily({
  patients,
  practitioner,
  appointments
}: Props) {
  const hasAppointments = appointments.length > 0;
  const sortedAppointments = appointments.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const renderAppointments = sortedAppointments.map((appointment, index) => (
    <React.Fragment key={index}>
      <CalendarDailyContainer id="appointmentBox">
        <AppointmentCard
          key={index}
          patient={patients.find(
            (patient) => patient._id === appointment.patient.toString()
          )}
          practitioner={practitioner}
          appointment={appointment}
        />
      </CalendarDailyContainer>
    </React.Fragment>
  ));

  return (
    <>
      {hasAppointments ? (
        <>{renderAppointments}</>
      ) : (
        <NoAppointment>No Appointments</NoAppointment>
      )}
    </>
  );
}

const CalendarDailyContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  min-width: 100%;
`;

const NoAppointment = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 1.5rem;
  color: #ae2a40;
`;
