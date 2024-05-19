import { format } from 'date-fns';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  date: Date;
  appointments: Appointment[];
  style: any;
  practitioner: Practitioner;
}

export default function DayColumn({
  date,
  appointments,
  style,
  practitioner
}: Props) {
  // Check if there are appointments for the day
  const hasAppointments = appointments.length > 0;

  return (
    <StyledDayColumn style={style}>
      <DayColumnHeader>
        {format(date, 'EEE, MMM d')}{' '}
        {/* Formats the date as "Day, Month Date" */}
      </DayColumnHeader>
      {!hasAppointments ? (
        <NoAppointment>
          <strong>No Appointments</strong>
        </NoAppointment>
      ) : (
        // Otherwise, map over the appointments as before
        appointments.map((appointment, index) => (
          <React.Fragment key={index}>
            <StyledAppointmentCard
              to="/patient/"
              state={{
                patient: practitioner.patients.find((patient) => {
                  return (
                    patient._id === (appointment.patient as unknown as string)
                  );
                }),
                practitioner: practitioner,
                appointment: appointment
              }}>
              <AppointmentEntry key={index}>
                <AppointmentTime>
                  {format(new Date(appointment.date), 'h:mm a')}{' '}
                </AppointmentTime>
                <AppointmentDetails>
                  <>
                    {
                      practitioner.patients.find((patient) => {
                        return (
                          patient._id ===
                          (appointment.patient as unknown as string)
                        );
                      }).name
                    }
                  </>
                </AppointmentDetails>
              </AppointmentEntry>
            </StyledAppointmentCard>
          </React.Fragment>
        ))
      )}
    </StyledDayColumn>
  );
}

const StyledDayColumn = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin: 10px;
  width: max-content;
  font-family: 'Arial', sans-serif;
`;

const DayColumnHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  text-align: left;
`;

const NoAppointment = styled.div`
  text-align: left;
  padding: 10px;
`;

const AppointmentEntry = styled.div`
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const AppointmentTime = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 8px;
`;
const AppointmentDetails = styled.div`
  font-size: 16px;
  font-weight: normal;
  color: #333;
  width: 100%;
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: black;
`;

const StyledAppointmentCard = styled(Link)``;
