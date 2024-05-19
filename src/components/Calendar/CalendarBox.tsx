import Box from '@mui/material/Box';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { endOfWeek, startOfWeek } from 'date-fns'; // Ensure this is imported
import dayjs from 'dayjs';
import styled from 'styled-components';

export default function CalendarBox({
  selectedDate,
  setSelectedDate,
  setSelectedWeek, // Ensure this prop is accepted
  calendarView,
  setCalendarView
}) {
  const dayjsDate = dayjs(selectedDate);

  const handleDateChange = (newDate) => {
    if (newDate) {
      const date = newDate.toDate();
      setSelectedDate(date);

      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      setSelectedWeek({ start, end });

      // If currently in weekly view, maintain it; otherwise, no need to update the view
      if (calendarView === 2) {
        setCalendarView(2);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#dddddd',
        width: '22rem',
        marginLeft: 2,
        padding: 2
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={dayjsDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </Box>
  );
}

// not used, but stored here so we can get rid of the css file without losing it
const StyledCalendarBox = styled.div`
  background-color: #dddddd; /* Replace with your specific color */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 22rem;
  margin: 1rem;
  padding: 1.5rem;
`;
