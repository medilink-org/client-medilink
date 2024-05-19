import Box from '@mui/material/Box';
import { eachDayOfInterval, format, isSaturday, isSunday } from 'date-fns';
import DayColumn from './DayColumn';

interface Props {
  selectedWeek: any;
  appointments: Appointment[];
  practitioner: Practitioner;
}

export default function CalendarWeekly({
  selectedWeek,
  appointments,
  practitioner
}: Props) {
  if (!selectedWeek || !selectedWeek.start || !selectedWeek.end) {
    return <div>Loading...</div>;
  }

  const days = eachDayOfInterval({
    start: selectedWeek.start,
    end: selectedWeek.end
  });

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        flexWrap: 'wrap'
      }}>
      {days.map((day, index) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const appointmentsForDay = appointments.filter((appointment) => {
          return (
            new Date(appointment.date).getDate() === day.getDate() &&
            new Date(appointment.date).getMonth() === day.getMonth() &&
            new Date(appointment.date).getFullYear() === day.getFullYear()
          );
        });
        const isWeekendDay = isSaturday(day) || isSunday(day);

        return (
          <DayColumn
            style={{
              display: isWeekendDay ? 'none' : 'block',
              minWidth: '250px'
            }}
            key={dayKey}
            date={day}
            appointments={appointmentsForDay}
            practitioner={practitioner}
          />
        );
      })}
    </Box>
  );
}
