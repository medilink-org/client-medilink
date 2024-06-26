import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

interface Props {
  patient: Patient | null;
  practitioner: Practitioner | null;
  appointment: Appointment;
}

const AppointmentCard = ({ patient, practitioner, appointment }: Props) => {
  console.log('AppointmentCard props:', { patient, practitioner, appointment });

  if (!patient) {
    console.warn('Patient data is missing for appointment:', appointment);
    return (
      <AppointmentCardWrapper
        barColor="gray"
        dataTooltip="No patient data available">
        <StyledAppointmentCard to="#">
          <ApppointmentName>Unknown Patient</ApppointmentName>
          <AppointmentDetails>
            <div style={{ color: '#AE2A40' }}>
              <Label>Reason: </Label>{' '}
              {appointment.reason || 'No reason provided'}
            </div>
            <div style={{ color: '#AE2A40' }}>
              <Label>Appointment Time: </Label>
              {new Date(appointment.date).toLocaleTimeString()}
            </div>
          </AppointmentDetails>
        </StyledAppointmentCard>
      </AppointmentCardWrapper>
    );
  }

  if (!practitioner) {
    console.warn('Practitioner data is missing for appointment:', appointment);
    return null;
  }

  const reason = appointment.reason;
  const appointmentDate = new Date(appointment.date);
  let hours = appointmentDate.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
  const now = new Date().getTime();

  let color = '';
  let tooltip = '';
  if (
    (appointmentDate.getTime() <= now &&
      appointmentDate.getTime() + 45 * 60000 >= now) ||
    appointment.status === 'in-progress'
  ) {
    color = '#9328B3'; // purple
    tooltip = 'Purple bar- Appointment is happening now';
  } else if (appointment?.status === 'cancelled') {
    color = 'gray';
    tooltip = 'Gray bar- Appointment was cancelled';
  } else if (
    appointmentDate.getTime() < now - 2 * 86400000 &&
    (!appointment.synopsis || appointment.synopsis === '')
  ) {
    color = '#D94425';
    tooltip = 'Red bar- No synopsis and happened more than 2 days ago';
  } else if (
    appointmentDate.getTime() < now &&
    (!appointment.synopsis || appointment.synopsis === '')
  ) {
    color = '#CDC62E';
    tooltip = 'Yellow bar- No synopsis but happened today or yesterday';
  } else if (appointmentDate.getTime() < now && appointment.synopsis !== '') {
    color = '#48B328';
    tooltip = 'Green bar- Already happened and has a synopsis';
  } else {
    color = '#288EB3';
    tooltip = 'Blue bar- Future appointment';
  }

  return (
    <AppointmentCardWrapper barColor={color} dataTooltip={tooltip}>
      <StyledAppointmentCard
        to="/practitioner-patient/"
        state={{
          patient: patient,
          practitioner: practitioner,
          appointment: appointment
        }}>
        <ApppointmentName>{patient.name}</ApppointmentName>
        <AppointmentDetails>
          <div style={{ color: '#AE2A40' }}>
            <Label>Reason: </Label> {reason}{' '}
          </div>
          <div style={{ color: '#AE2A40' }}>
            <Label>Appointment Time: </Label>
            {hours}:{minutes}
            {amPm}
          </div>
        </AppointmentDetails>
      </StyledAppointmentCard>
    </AppointmentCardWrapper>
  );
};

interface AppointmentCardWrapperProps {
  barColor?: string;
  dataTooltip?: string;
}

const AppointmentCardWrapper = styled.div<AppointmentCardWrapperProps>`
  background-color: white;
  border-radius: 10px;
  position: relative;
  display: block;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  min-width: 100%;
  a,
  a:visited {
    color: #000000;
    text-decoration: none;
  }
  &:hover {
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
  }
  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    border-radius: 10px 0 0 10px;
    top: 0;
    bottom: 0;
    width: 10px;
    background-color: ${(props) => props.barColor || '#000000'};
  }
  &::after {
    content: attr(dataTooltip);
    position: absolute;
    left: 35%;
    visibility: hidden;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 10px;
    border-radius: 6px;
    top: 30%;
    transform: translateY(-50%);
    margin-left: 10px;
    opacity: 0;
    transition:
      opacity 0.3s linear,
      visibility 0s;
  }
  &:hover::after {
    visibility: visible;
    opacity: 1;
  }
`;

const StyledAppointmentCard = styled(Link)``;

const ApppointmentName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const AppointmentDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Label = styled.span`
  font-weight: bold;
  color: #000000;
`;

export default AppointmentCard;
