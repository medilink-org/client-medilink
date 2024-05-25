import React, { useState, useEffect } from 'react';
import ScheduleSelector from 'react-schedule-selector';
import axios from 'axios';

const DoctorAvailability = ({ doctorId }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          `/api/practitioner/availability/${doctorId}`
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

              return new Date(date);
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
    axios
      .put(`/api/practitioner/availability/${doctorId}`, { availability })
      .then((response) => {
        console.log('Availability updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating availability:', error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/api/practitioner/availability/${doctorId}`)
      .then(() => {
        setSchedule([]);
        console.log('Availability deleted');
      })
      .catch((error) => {
        console.error('Error deleting availability:', error);
      });
  };

  return (
    <div>
      <h2>Select Your Availability</h2>
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
      <button onClick={handleSave}>Save Availability</button>
      <button onClick={handleDelete}>Delete All Availability</button>
    </div>
  );
};

export default DoctorAvailability;
