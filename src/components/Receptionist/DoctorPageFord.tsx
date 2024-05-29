import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Image, Descriptions, Calendar, Badge } from 'antd';
import { CssBaseline } from '@mui/material';
import type { DescriptionsProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import TopBar from '../PatientView/TopBar';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Name',
    children: 'Dr. Alexa Ford'
  },
  {
    key: '3',
    label: 'Hometown',
    children: 'Baltimore, Maryland'
  },
  {
    key: '4',
    label: 'Education',
    span: 2,
    children:
      'B.A. in Biology from Johns Hopkins in 2008, J.D. from Baylor University in 2012'
  },
  {
    key: '5',
    label: 'Fun Fact',
    children: 'I have been to 53 countries and 38 states!'
  }
];

// Much of the availability is chatGPT generated. It is simply example code to show what it might look like with actual doctors
const availability = [
  { date: '2024-05-29', times: ['10:00 AM', '2:00 PM', '4:00 PM'] },
  { date: '2024-05-30', times: ['9:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-05-31', times: ['11:00 AM', '2:00 PM'] },
  { date: '2024-06-01', times: ['10:00 AM', '1:00 PM', '5:00 PM'] },
  { date: '2024-06-02', times: ['8:00 AM', '12:00 PM', '4:00 PM'] },
  { date: '2024-06-03', times: ['9:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-06-04', times: ['10:00 AM', '2:00 PM'] },
  { date: '2024-05-01', times: ['9:00 AM', '11:00 AM', '3:00 PM'] },
  { date: '2024-05-02', times: ['10:00 AM', '1:00 PM', '4:00 PM'] },
  { date: '2024-05-03', times: ['8:00 AM', '12:00 PM', '2:00 PM'] },
  { date: '2024-05-04', times: ['9:00 AM', '11:00 AM', '3:00 PM'] },
  { date: '2024-05-05', times: ['10:00 AM', '2:00 PM', '5:00 PM'] },
  { date: '2024-05-06', times: ['8:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-05-07', times: ['9:00 AM', '11:00 AM', '4:00 PM'] },
  { date: '2024-05-08', times: ['10:00 AM', '1:00 PM', '2:00 PM'] },
  { date: '2024-05-09', times: ['8:00 AM', '12:00 PM', '3:00 PM'] },
  { date: '2024-05-10', times: ['9:00 AM', '2:00 PM', '4:00 PM'] },
  { date: '2024-05-11', times: ['10:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-05-12', times: ['8:00 AM', '11:00 AM', '2:00 PM'] },
  { date: '2024-05-13', times: ['9:00 AM', '12:00 PM', '4:00 PM'] },
  { date: '2024-05-14', times: ['10:00 AM', '2:00 PM', '5:00 PM'] },
  { date: '2024-05-15', times: ['8:00 AM', '11:00 AM', '3:00 PM'] },
  { date: '2024-05-16', times: ['9:00 AM', '1:00 PM', '4:00 PM'] },
  { date: '2024-05-17', times: ['10:00 AM', '12:00 PM', '2:00 PM'] },
  { date: '2024-05-18', times: ['8:00 AM', '3:00 PM', '5:00 PM'] },
  { date: '2024-05-19', times: ['9:00 AM', '11:00 AM', '2:00 PM'] },
  { date: '2024-05-20', times: ['10:00 AM', '1:00 PM', '4:00 PM'] },
  { date: '2024-05-21', times: ['8:00 AM', '12:00 PM', '3:00 PM'] },
  { date: '2024-05-22', times: ['9:00 AM', '2:00 PM', '5:00 PM'] },
  { date: '2024-05-23', times: ['10:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-05-24', times: ['8:00 AM', '11:00 AM', '2:00 PM'] },
  { date: '2024-05-25', times: ['9:00 AM', '3:00 PM', '4:00 PM'] },
  { date: '2024-05-26', times: ['10:00 AM', '12:00 PM', '5:00 PM'] },
  { date: '2024-05-27', times: ['8:00 AM', '11:00 AM', '2:00 PM'] },
  { date: '2024-05-28', times: ['9:00 AM', '1:00 PM', '4:00 PM'] }
];

const DoctorPageFord: React.FC = () => {
  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    practitioner: null,
    path: null
  };

  const [value, setValue] = useState(() => dayjs('2024-05-29'));

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const dateCellRender = (value: Dayjs) => {
    const currentDate = value.format('YYYY-MM-DD');
    const availableTimes = availability.find(
      (item) => item.date === currentDate
    );

    return (
      <ul className="events">
        {availableTimes &&
          availableTimes.times.map((time) => (
            <li key={time}>
              <Badge status="success" text={time} />
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className="doctor-page-container">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar {...topBarProps} />
      </Box>
      <div className="doctor-description-and-image">
        <Image width={200} className="doctor-image" src="/img/dr_ford.jpg" />
        <Descriptions
          layout="vertical"
          items={items}
          bordered={true}
          column={4}
          colon={false}
          className="doctor-description"
        />
      </div>
      <div className="calendar">
        <h1>Availability for Dr. Ford</h1>
        <Calendar
          value={value}
          fullscreen={false}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
        />
      </div>
    </div>
  );
};

export default DoctorPageFord;
