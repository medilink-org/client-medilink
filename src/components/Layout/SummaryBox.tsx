import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

interface Props {
  patient: Patient;
  totalAppointments: number;
  remainingAppointments: number;
  missingSynopsis: number;
  practitioner: Practitioner;
  appointment: Appointment;
}

export default function SummaryBox({
  patient,
  totalAppointments,
  remainingAppointments,
  missingSynopsis,
  practitioner,
  appointment
}: Props) {
  const appointmentDate = appointment ? new Date(appointment.date) : null;
  const type = appointment ? appointment.type : null;
  const startTime = appointment
    ? appointmentDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    : null;
  // startTime + 45 mins
  const endTime = appointment
    ? new Date(appointmentDate.getTime() + 45 * 60000).toLocaleString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    : null;

  return (
    <>
      {/*encompasses entire summary box*/}
      <Box
        sx={{
          backgroundColor: '#dddddd',
          width: '22rem',
          marginLeft: 2,
          borderRadius: '10px 10px 10px 10px'
        }}>
        {' '}
        {/*header box*/}
        <Box
          sx={{
            backgroundColor: '#8198A0',
            borderRadius: '10px 10px 0px 0px',
            textAlign: 'center'
          }}>
          {' '}
          {appointment ? (
            <h2 style={{ margin: '10px' }}>Next Appointment</h2>
          ) : (
            <h2 style={{ margin: '10px' }}>Today&apos;s Summary</h2>
          )}
        </Box>
        {/*body of summary box*/}
        <Box
          sx={{
            paddingLeft: 2,
            paddingBottom: 0.5
          }}>
          {appointment ? (
            <>
              {' '}
              {/* render this info if there is an appointment giving info on the next one*/}
              <p>
                <b>Client:</b>{' '}
                <Link
                  to="/patient/"
                  state={{
                    patient: patient,
                    practitioner: practitioner
                  }}
                  style={{ textDecoration: 'none', color: '#000000' }}>
                  {patient.name}
                </Link>
              </p>
              <p>
                <b>Time: </b>
                {startTime} - {endTime}
              </p>
              <p>
                <b>Type:</b> {type}
              </p>
              <h3>
                Remaining today: <b>{remainingAppointments}</b>
              </h3>
            </>
          ) : (
            <>
              {/* render this box showing a daily summary if all appointments completed*/}
              <p style={{ textAlign: 'justify' }}>
                {' '}
                <strong>No appointments remaining today</strong>
              </p>
              <p>
                <strong>Appointments elapsed: </strong>
                {totalAppointments}
              </p>
              <p style={{ color: '#BE123C' }}>
                <strong>Appointments missing synopsis: </strong>
                {missingSynopsis}
              </p>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
