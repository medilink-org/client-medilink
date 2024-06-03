import React, { useState, useEffect } from 'react';
import ScheduleSelector from 'react-schedule-selector';
import axiosInstance from '../axiosInstance';
import { Button, Container, Typography, Box } from '@mui/material';

const DoctorAvailability = ({ doctorId }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Fetch existing availability
    const fetchAvailability = async () => {
      try {
        const response = await axiosInstance.get(
          `/practitioner/availability/${doctorId}`
        );
        console.log('Availability response:', response.data);
        if (Array.isArray(response.data)) {
          const availability = response.data.flatMap((slot) => {
            return slot.times.map((time) => {
              const [hour, minute] = time.split(':');
              const date = new Date();
              date.setHours(hour);
              date.setMinutes(minute);
              date.setSeconds(0);
              date.setMilliseconds(0);

              const dayIndex = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
              ].indexOf(slot.day);
              const currentDayIndex = date.getDay();
              const daysToAdd = (dayIndex - currentDayIndex + 7) % 7;
              date.setDate(date.getDate() + daysToAdd);

              return new Date(date); // Ensure it's a new Date object for ScheduleSelector
            });
          });
          setSchedule(availability);
          console.log('Set schedule:', availability);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const handleChange = (newSchedule) => {
    setSchedule(newSchedule);
    console.log('New schedule:', newSchedule);
  };

  const handleSave = () => {
    const availability = schedule.reduce((acc, date) => {
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const time = date.toLocaleTimeString('en-US', { hour12: false });
      const existingDay = acc.find((slot) => slot.day === day);
      if (existingDay) {
        existingDay.times.push(time);
      } else {
        acc.push({ day, times: [time] });
      }
      return acc;
    }, []);
    axiosInstance
      .put(`/practitioner/availability/${doctorId}`, { availability })
      .then((response) => {
        console.log('Availability updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating availability:', error);
      });
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/practitioner/availability/${doctorId}`)
      .then(() => {
        setSchedule([]); // Clear the schedule state
        console.log('Availability deleted');
      })
      .catch((error) => {
        console.error('Error deleting availability:', error);
      });
  };

  return (
    <Container>
      <Box textAlign="center" mt={4} mb={2}>
        <Typography variant="h4" component="h2">
          Select Your Availability
        </Typography>
      </Box>
      <ScheduleSelector
        selection={schedule}
        numDays={7}
        minTime={0}
        maxTime={24}
        hourlyChunks={1}
        dateFormat="dddd"
        timeFormat="HH:mm"
        onChange={handleChange}
        key={schedule.length}
      />
      <div style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{
            border: '1px solid grey',
            backgroundColor: '#4D6096',
            color: 'white',
            marginRight: '10px'
          }}>
          Save Availability
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleDelete}>
          Delete All Availability
        </Button>
      </div>
    </Container>
  );
};

export default DoctorAvailability;
