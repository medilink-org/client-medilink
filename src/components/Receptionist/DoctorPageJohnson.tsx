import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Badge, Image, Descriptions, Calendar } from 'antd';
import { CssBaseline } from '@mui/material';
import type { DescriptionsProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import TopBar from '../PatientView/TopBar';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Name',
    children: 'Dr. Cameron Johnson'
  },
  {
    key: '3',
    label: 'Hometown',
    children: 'Austin, Texas'
  },
  {
    key: '4',
    label: 'Education',
    span: 2,
    children:
      'B.A. in Biology from Dartmouth College in 2008, J.D. from Temple University in 2012'
  },
  {
    key: '5',
    label: 'Fun Fact',
    children: 'I have 2 kids aged four and seven and 2 dogs!'
  }
];

// This availability is chatGPT generated. It is simply example code to show what it might look like with actual doctors
const availability = [
  { date: '2024-05-01', times: ['9:00 AM', '10:30 AM', '1:00 PM'] },
  { date: '2024-05-02', times: ['10:00 AM', '11:30 AM', '2:00 PM'] },
  { date: '2024-05-03', times: ['8:30 AM', '10:00 AM', '1:30 PM'] },
  { date: '2024-05-04', times: ['9:00 AM', '11:00 AM', '3:00 PM'] },
  { date: '2024-05-05', times: ['10:30 AM', '12:30 PM', '2:30 PM'] },
  { date: '2024-05-06', times: ['8:00 AM', '10:30 AM', '3:00 PM'] },
  { date: '2024-05-07', times: ['9:30 AM', '11:00 AM', '4:00 PM'] },
  { date: '2024-05-08', times: ['10:00 AM', '1:30 PM', '3:30 PM'] },
  { date: '2024-05-09', times: ['8:30 AM', '12:00 PM', '2:00 PM'] },
  { date: '2024-05-10', times: ['9:00 AM', '10:30 AM', '1:00 PM'] },
  { date: '2024-05-11', times: ['10:00 AM', '11:30 AM', '3:00 PM'] },
  { date: '2024-05-12', times: ['8:30 AM', '10:00 AM', '2:00 PM'] },
  { date: '2024-05-13', times: ['9:00 AM', '11:30 AM', '4:00 PM'] },
  { date: '2024-05-14', times: ['10:30 AM', '12:30 PM', '3:00 PM'] },
  { date: '2024-05-15', times: ['8:00 AM', '10:00 AM', '1:30 PM'] },
  { date: '2024-05-16', times: ['9:30 AM', '11:00 AM', '2:30 PM'] },
  { date: '2024-05-17', times: ['10:00 AM', '12:00 PM', '3:00 PM'] },
  { date: '2024-05-18', times: ['8:30 AM', '11:30 AM', '1:00 PM'] },
  { date: '2024-05-19', times: ['9:00 AM', '10:30 AM', '2:00 PM'] },
  { date: '2024-05-20', times: ['10:00 AM', '1:00 PM', '3:30 PM'] },
  { date: '2024-05-21', times: ['8:00 AM', '10:30 AM', '2:00 PM'] },
  { date: '2024-05-22', times: ['9:30 AM', '11:00 AM', '4:00 PM'] },
  { date: '2024-05-23', times: ['10:00 AM', '12:30 PM', '3:00 PM'] },
  { date: '2024-05-24', times: ['8:30 AM', '11:00 AM', '2:30 PM'] },
  { date: '2024-05-25', times: ['9:00 AM', '10:30 AM', '1:30 PM'] },
  { date: '2024-05-26', times: ['10:00 AM', '12:00 PM', '3:00 PM'] },
  { date: '2024-05-27', times: ['8:00 AM', '10:30 AM', '2:00 PM'] },
  { date: '2024-05-28', times: ['9:30 AM', '11:30 AM', '4:00 PM'] },
  { date: '2024-05-29', times: ['10:00 AM', '12:00 PM', '3:00 PM'] },
  { date: '2024-05-30', times: ['8:30 AM', '11:00 AM', '1:00 PM'] },
  { date: '2024-05-31', times: ['9:00 AM', '10:30 AM', '3:30 PM'] },
  { date: '2024-06-01', times: ['10:00 AM', '1:00 PM', '4:00 PM'] },
  { date: '2024-06-02', times: ['8:00 AM', '12:00 PM', '4:00 PM'] },
  { date: '2024-06-03', times: ['9:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2024-06-04', times: ['10:00 AM', '2:00 PM', '5:00 PM'] }
];

const DoctorPageJohnson: React.FC = () => {
  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    practitioner: null,
    path: null
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

  const [value, setValue] = useState(() => dayjs('2024-05-29'));
  //   const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    // setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  return (
    <div className="doctor-page-container">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar {...topBarProps} />
      </Box>
      <div className="doctor-description-and-image">
        <Image
          width={200}
          className="doctor-image"
          src="/img/dr_johnson.webp"
        />
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
        <h1>Availability for Dr. Johnson</h1>
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

export default DoctorPageJohnson;

// import React, { useState, useRef, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import {
//   Image,
//   Descriptions,
//   Calendar,
//   Typography,
//   Table,
//   Input,
//   Button,
//   Space,
//   Modal,
//   Alert,
//   Tag,
//   Badge
// } from 'antd';
// import { CssBaseline } from '@mui/material';
// import type { DescriptionsProps } from 'antd';
// import type { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';
// import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
// import Highlighter from 'react-highlight-words';
// import TopBar from '../PatientView/TopBar';
// import {
//   useGetAllAppointmentsQuery,
//   useDeleteAppointmentMutation
// } from '../../services/api';
// import './style/Appointments.css';

// const { Title } = Typography;

// const statusColors = {
//   'in-progress': 'processing',
//   complete: 'success',
//   cancelled: 'error',
//   scheduled: 'warning'
// };

// const items: DescriptionsProps['items'] = [
//   {
//     key: '1',
//     label: 'Name',
//     children: 'Dr. Cameron Johnson'
//   },
//   {
//     key: '3',
//     label: 'Hometown',
//     children: 'Austin, Texas'
//   },
//   {
//     key: '4',
//     label: 'Education',
//     span: 2,
//     children:
//       'B.A. in Biology from Dartmouth College in 2008, J.D. from Temple University in 2012'
//   },
//   {
//     key: '5',
//     label: 'Fun Fact',
//     children: 'I have 2 kids aged four and seven and 2 dogs!'
//   }
// ];

// const DoctorPageJohnson: React.FC = () => {
//   const topBarProps = {
//     logo: '/img/medilink_logo.webp',
//     left: null,
//     children: null,
//     right: null,
//     style: null,
//     practitioner: null,
//     path: null
//   };

//   const [value, setValue] = useState(() => dayjs('2024-05-29'));
//   const [appointments, setAppointments] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(dayjs());
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const searchInput = useRef(null);
//   const [deleteAppointment, { isLoading: isDeleting }] =
//     useDeleteAppointmentMutation();

//   const { data, isLoading } = useGetAllAppointmentsQuery(); // Fetch all appointments

//   useEffect(() => {
//     if (data) {
//       // Filter appointments for Dr. Cameron Johnson
//       const doctorAppointments = data.filter(
//         (appointment) => appointment.practitioner.name === 'Dr. Cameron Johnson'
//       );
//       setAppointments(doctorAppointments);
//     }
//   }, [data]);

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText('');
//   };

//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters
//     }) => (
//       <div className="dropdown-container" style={{ padding: 8 }}>
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}>
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{ width: 90 }}>
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({ closeDropdown: false });
//               setSearchText(selectedKeys[0]);
//               setSearchedColumn(dataIndex);
//             }}>
//             Filter
//           </Button>
//           <Button type="link" size="small" onClick={() => confirm()}>
//             Close
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
//     ),
//     onFilter: (value, record) => {
//       let recordValue = record[dataIndex];
//       if (typeof recordValue === 'object' && recordValue !== null) {
//         recordValue = recordValue.name;
//       }
//       return recordValue.toString().toLowerCase().includes(value.toLowerCase());
//     },
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ''}
//         />
//       ) : (
//         text
//       )
//   });

//   const onSelectDate = (date) => {
//     setSelectedDate(date);
//   };

//   const handleDelete = (record) => {
//     Modal.confirm({
//       title: 'Are you sure you want to delete this appointment?',
//       onOk: async () => {
//         console.log('Delete:', record._id);
//         await deleteAppointment(record._id);
//       }
//     });
//   };

//   const columns = [
//     {
//       title: 'Patient Name',
//       dataIndex: 'patient',
//       key: 'patient',
//       ...getColumnSearchProps('patient'),
//       render: (patient) => patient.name
//     },
//     {
//       title: 'Practitioner Name',
//       dataIndex: 'practitioner',
//       key: 'practitioner',
//       ...getColumnSearchProps('practitioner'),
//       render: (practitioner) => practitioner.name
//     },
//     {
//       title: 'Date of Appointment',
//       dataIndex: 'date',
//       key: 'date',
//       render: (date) => dayjs(date).format('MMMM Do YYYY, h:mm a'),
//       sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
//     },
//     {
//       title: 'Reason',
//       dataIndex: 'reason',
//       key: 'reason',
//       ...getColumnSearchProps('reason')
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       filters: [
//         { text: 'In Progress', value: 'in-progress' },
//         { text: 'Complete', value: 'complete' },
//         { text: 'Cancelled', value: 'cancelled' },
//         { text: 'Scheduled', value: 'scheduled' }
//       ],
//       onFilter: (value, record) => record.status === value,
//       render: (status) => (
//         <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
//       )
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (text, record) => (
//         <Space size="middle">
//           <Button
//             shape="circle"
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(record)}
//             loading={isDeleting}
//             disabled={isDeleting}
//           />
//         </Space>
//       )
//     }
//   ];

//   const getListData = (value, appointments) => {
//     return appointments
//       ? appointments.filter((appointment) =>
//           dayjs(appointment.date).isSame(value, 'day')
//         )
//       : [];
//   };

//   const dateCellRender = (value, appointments) => {
//     const listData = getListData(value, appointments);
//     return (
//       <ul className="events">
//         {listData.map((item) => (
//           <li key={item._id}>
//             <Badge
//               status={statusColors[item.status]}
//               text={`${item.patient.name} - ${item.practitioner.name}`}
//             />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const cellRender = (current, info) => {
//     if (info.type === 'date')
//       return dateCellRender(current, appointments || []);
//     return info.originNode;
//   };

//   return (
//     <div className="doctor-page-container">
//       <Box sx={{ display: 'flex' }}>
//         <CssBaseline />
//         <TopBar {...topBarProps} />
//       </Box>
//       <div className="doctor-description-and-image">
//         <Image
//           width={200}
//           className="doctor-image"
//           src="/img/dr_johnson.webp"
//         />
//         <Descriptions
//           layout="vertical"
//           items={items}
//           bordered={true}
//           column={4}
//           colon={false}
//           className="doctor-description"
//         />
//       </div>
//       <div className="calendar">
//         <Title
//           level={2}
//           style={{
//             margin: 0,
//             color: 'black',
//             padding: '20px 0',
//             textAlign: 'center',
//             fontSize: 'calc(2em + 1vw)'
//           }}>
//           Availability for Dr. Johnson
//         </Title>
//         <Alert
//           message={`You selected date: ${selectedDate.format('MMMM Do YYYY')}`}
//           type="info"
//           style={{ marginBottom: 20, width: '50%', textAlign: 'center' }}
//         />
//         <Calendar
//           value={selectedDate}
//           onSelect={onSelectDate}
//           cellRender={cellRender}
//           fullscreen={false}
//         />
//         <Title level={4} style={{ marginTop: '20px', textAlign: 'center' }}>
//           Appointments for {selectedDate.format('MMMM Do YYYY')}
//         </Title>
//         <div className="appointment-list-container">
//           <Table
//             columns={columns}
//             dataSource={getListData(selectedDate, appointments || [])}
//             loading={isLoading}
//             pagination={{ pageSize: 5 }}
//             rowKey="_id"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorPageJohnson;
