import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import {
  Badge,
  Image,
  Descriptions,
  Calendar,
  Select,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tooltip,
  Row,
  Col,
  message
} from 'antd';
import { CssBaseline } from '@mui/material';
import type { DescriptionsProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import TopBar from '../PatientView/TopBar';
import {
  useGetAllAppointmentsQuery,
  useGetAvailablePractitionersQuery,
  useGetAllPatientsQuery,
  useAssignPatientToPractitionerMutation
} from '../../services/api';
import './style/DoctorPage_style.css';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Name',
    children: 'Dr. Demo'
  },
  {
    key: '2',
    label: 'Hometown',
    children: 'Austin, Texas'
  },
  {
    key: '3',
    label: 'Education',
    span: 2,
    children:
      'B.A. in Biology from Dartmouth College in 2008, M.D. from Temple University in 2012'
  },
  {
    key: '4',
    label: 'Fun Fact',
    children: 'I have 2 kids aged four and seven and 2 dogs!'
  }
];

const dateCellRender = (value, appointments, availability) => {
  const currentDate = value.format('YYYY-MM-DD');
  const availableTimes = availability[currentDate] || [];

  return (
    <ul className="events">
      {availableTimes.map((time) => (
        <li key={time}>
          <Badge status="success" text={time} />
        </li>
      ))}
    </ul>
  );
};

const DoctorPageJohnson: React.FC<{ doctorId: string }> = ({ doctorId }) => {
  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    practitioner: null,
    path: null
  };

  const [form] = Form.useForm();
  const [value, setValue] = useState(() => dayjs('2024-05-29'));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const { data: appointments, isLoading: isLoadingAppointments } =
    useGetAllAppointmentsQuery();
  const { data: doctors = [], isLoading: isLoadingDoctors } =
    useGetAvailablePractitionersQuery();
  const { data: patients = [], isLoading: isLoadingPatients } =
    useGetAllPatientsQuery();
  const [assignPatientToPractitioner] =
    useAssignPatientToPractitionerMutation();

  const getDoctorAvailability = (doctor) => {
    const availabilityByDate = {};
    if (!doctor || !doctor.availability) return availabilityByDate;

    doctor.availability.forEach((avail) => {
      const dayOfWeek = avail.day.toLowerCase();
      const startOfWeek = dayjs().startOf('week');

      for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek.add(i, 'day');
        if (currentDay.format('dddd').toLowerCase() === dayOfWeek) {
          const formattedDate = currentDay.format('YYYY-MM-DD');
          if (!availabilityByDate[formattedDate]) {
            availabilityByDate[formattedDate] = [];
          }
          availabilityByDate[formattedDate] = avail.times;
        }
      }
    });

    return availabilityByDate;
  };

  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (!isLoadingDoctors) {
      const doctor = doctors.find((doc) => doc._id === doctorId);
      if (doctor) {
        const doctorAvailability = getDoctorAvailability(doctor);
        setAvailability(doctorAvailability);
      }
    }
  }, [doctors, isLoadingDoctors, doctorId]);

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const cellRender = (current, info) => {
    if (info.type === 'date')
      return dateCellRender(current, appointments || [], availability);
    return info.originNode;
  };

  const handleAssign = async () => {
    try {
      const values = await form.validateFields();
      if (selectedPatient && selectedTime && value) {
        const timeParts = selectedTime.split(':');
        const combinedDateTime = dayjs(value)
          .hour(parseInt(timeParts[0]))
          .minute(parseInt(timeParts[1]))
          .second(parseInt(timeParts[2]))
          .format('YYYY-MM-DDTHH:mm:ss');
        const appointment = {
          date: combinedDateTime,
          status: 'scheduled',
          reason: values.reason
        };

        await assignPatientToPractitioner({
          patientId: selectedPatient,
          practitionerId: doctorId,
          ...appointment
        }).unwrap();

        setIsModalOpen(false);
        message.success('Appointment assigned successfully!');
      } else {
        message.warning('Please select patient, time, and date.');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: (props) => {
      const { setSelectedKeys, selectedKeys, confirm, clearFilters, close } =
        props;
      return (
        <div
          className="dropdown-container"
          style={{ padding: 8 }}
          onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${title}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}>
              Filter
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              Close
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Name')
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => dayjs(date).format('MMMM Do YYYY, h:mm:ss a'),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Assign">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setSelectedPatient(record._id);
                setIsModalOpen(true);
              }}>
              Assign
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

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
      <div className="calendar-and-scheduling">
        <div className="calendar">
          <h1>Availability for Dr. Demo</h1>
          <Calendar
            value={value}
            fullscreen={false}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            cellRender={cellRender}
          />
          <div style={{ marginTop: 10 }}>
            <h1 style={{ fontSize: '30px' }}>Select a Time</h1>
            <Select
              value={selectedTime}
              onChange={(value) => setSelectedTime(value)}
              placeholder="Select a time"
              style={{
                width: '200px',
                marginBottom: '40px',
                marginTop: '10px'
              }}>
              {(availability[value.format('YYYY-MM-DD')] || []).map((time) => (
                <Select.Option key={time} value={time}>
                  {time}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="patient-list">
          <h1>Assign Patient</h1>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={16}>
              <Table
                columns={columns}
                dataSource={patients}
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  pageSize: 5
                }}
                rowKey="_id"
                className="custom-table"
              />
            </Col>
          </Row>
        </div>
        <Modal
          title="Assign Patient"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleAssign}>
          <Form layout="vertical" form={form}>
            <Form.Item label="Patient">
              <Input
                value={
                  patients.find((p) => p._id === selectedPatient)?.name || ''
                }
                readOnly
              />
            </Form.Item>
            <Form.Item label="Doctor">
              <Input
                value={doctors.find((d) => d._id === doctorId)?.name || ''}
                readOnly
              />
            </Form.Item>
            <Form.Item label="Time">
              <Input value={selectedTime} readOnly />
            </Form.Item>
            <Form.Item
              label="Reason for Visit"
              name="reason"
              rules={[
                {
                  required: true,
                  message: 'Please enter the reason for the visit'
                }
              ]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorPageJohnson;
