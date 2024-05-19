import Button from '@mui/material/Button';
import { format } from 'date-fns';
import styled from 'styled-components';
import './Calendar.css';
import CalendarDaily from './CalendarDaily';
import CalendarWeekly from './CalendarWeekly';

interface Props {
  selectedDate: Date;
  selectedWeek: any;
  calendarView: number;
  setCalendarView: any;
  selectedDateAppointments: Appointment[];
  selectedWeekAppointments: any;
  patients: Patient[];
  practitioner: Practitioner;
}

export default function Calendar({
  selectedDate,
  selectedWeek,
  calendarView,
  setCalendarView,
  selectedDateAppointments,
  selectedWeekAppointments,
  patients,
  practitioner
}: Props) {
  const formatDateDisplay = () => {
    if (calendarView === 1) {
      return format(selectedDate, 'MMMM d, yyyy');
    } else if (calendarView === 2) {
      const startFormat = format(selectedWeek.start, 'MMMM d');
      const endFormat = format(selectedWeek.end, 'MMMM d, yyyy');
      return `${startFormat} - ${endFormat}`;
    }
    return '';
  };

  return (
    <CalendarContainer>
      <HeaderContainer
        style={{
          backgroundColor: '#8198A0',
          borderRadius: '10px 10px 0px 0px',
          maxHeight: '60px'
        }}
      >
        <DateHeader id="selectedDate">
          <h3 style={{ color: 'black', paddingLeft: '20px' }}>
            {formatDateDisplay()}
          </h3>
        </DateHeader>
        <ButtonsContainer
          id="dailyWeekly"
          style={{ backgroundColor: '#8198A0' }}
        >
          <Button
            style={{
              border: '1px solid grey',
              backgroundColor: '#4D6096',
              color: 'white'
            }}
            className={calendarView === 1 ? 'active' : ''}
            onClick={() => {
              setCalendarView(1);
            }}
          >
            Daily
          </Button>
          <div style={{ padding: '4px' }}></div>
          <Button
            style={{
              border: '1px solid grey',
              backgroundColor: '#4D6096',
              color: 'white'
            }}
            className={calendarView === 2 ? 'active' : ''}
            onClick={() => {
              setCalendarView(2);
            }}
          >
            Weekly
          </Button>
        </ButtonsContainer>
      </HeaderContainer>
      <AppointmentsContainer>
        {calendarView === 1 && (
          <CalendarDaily
            patients={patients}
            practitioner={practitioner}
            appointments={selectedDateAppointments}
          />
        )}
        {calendarView === 2 && (
          <CalendarWeekly
            selectedWeek={selectedWeek}
            appointments={selectedWeekAppointments}
            practitioner={practitioner}
          />
        )}
      </AppointmentsContainer>
    </CalendarContainer>
  );
}

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d9d9d9;
  border-radius: 10px 10px 10px 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const DateHeader = styled.h2`
  margin: 0;
  color: #6c63ff;
  overflow: hidden;
`;

const AppointmentsContainer = styled.div``;

const ButtonsContainer = styled.button`
  display: flex;
  flex-direction: row;
  margin-right: 0.5rem;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  position: relative;
  background-color: '#4D6096';
`;
