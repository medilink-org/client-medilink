import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Calendar from '../Calendar/Calendar';
import CalendarBox from '../Calendar/CalendarBox';
import SummaryBox from './SummaryBox';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface props {
  practitioner: Practitioner;
}

export default function HomePage({ practitioner }: props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 })
  });
  const [calendarView, setCalendarView] = useState(1);
  const now = new Date();

  const patients = practitioner.patients.map((patient) => ({
    ...patient,
    _id: patient._id.toString()
  }));

  console.log('Patients in HomePage:', patients);

  const selectedDateAppointments = practitioner.appointments.filter(
    (appointment) => {
      return (
        new Date(appointment.date).getDate() === selectedDate.getDate() &&
        new Date(appointment.date).getMonth() === selectedDate.getMonth() &&
        new Date(appointment.date).getFullYear() === selectedDate.getFullYear()
      );
    }
  );

  const selectedWeekAppointments = practitioner.appointments.filter(
    (appointment) => {
      return (
        new Date(appointment.date).getTime() >= selectedWeek.start.getTime() &&
        new Date(appointment.date).getTime() <= selectedWeek.end.getTime()
      );
    }
  );

  const todaysAppointments = practitioner.appointments
    .filter((appointment) => {
      return (
        new Date(appointment.date).getDate() === now.getDate() &&
        new Date(appointment.date).getMonth() === now.getMonth() &&
        new Date(appointment.date).getFullYear() === now.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const remainingAppointments = todaysAppointments.filter((appointment) => {
    return new Date(appointment.date).getTime() >= now.getTime();
  });
  const nextAppointment = remainingAppointments[0];
  const missingSynopsis = todaysAppointments.filter((appointment) => {
    return appointment.synopsis === '' || appointment.synopsis === undefined;
  }).length;

  const nextPatient =
    remainingAppointments.length > 0
      ? patients.find((patient) => {
          return patient._id === (nextAppointment.patient as unknown as string);
        })
      : null;

  useEffect(() => {
    setSelectedWeek({
      start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      end: endOfWeek(selectedDate, { weekStartsOn: 1 })
    });
  }, [selectedDate]);

  return (
    <MainContainer>
      <BoxNavParent>
        <LeftSide>
          <CalendarBox
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setSelectedWeek={setSelectedWeek}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
          />
          <SummaryBox
            patient={nextPatient}
            missingSynopsis={missingSynopsis}
            totalAppointments={todaysAppointments.length}
            remainingAppointments={remainingAppointments.length}
            practitioner={practitioner}
            appointment={nextAppointment}
          />
          <Link to={`/practitioner-availability/${practitioner._id}`}>
            <Button
              style={{
                border: '1px solid grey',
                backgroundColor: '#4D6096',
                color: 'white',
                marginTop: '10px',
                marginLeft: '20px'
              }}
              variant="contained"
              color="primary">
              Set Availability
            </Button>
          </Link>
        </LeftSide>
        <RightSide>
          <Calendar
            selectedDate={selectedDate}
            selectedWeek={selectedWeek}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            selectedDateAppointments={selectedDateAppointments}
            selectedWeekAppointments={selectedWeekAppointments}
            patients={patients}
            practitioner={practitioner}
          />
        </RightSide>
      </BoxNavParent>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100vh;
  margin: 0;
  padding: 0;
  gap: 1rem;
`;

const BoxNavParent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
  margin-top: 40px;
`;

const LeftSide = styled.div`
  flex: 0 0 22rem;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 0px;
`;
