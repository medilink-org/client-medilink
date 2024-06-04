// src/components/DoctorDisplayPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
  //   Typography,
  Space,
  Tooltip,
  Row,
  Col,
  message
  //   Layout
} from 'antd';
import { CssBaseline } from '@mui/material';
import type { DescriptionsProps, TableColumnsType } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import TopBar from '../PatientView/TopBar';
import {
  useGetAllAppointmentsQuery,
  useGetAvailablePractitionersQuery,
  useGetAllPatientsQuery,
  useAssignPatientToPractitionerMutation,
  useCreatePatientAppointmentMutation,
  useDeletePatientMutation
} from '../../services/api';
import './style/DoctorPage_style.css';

const { Option } = Select;

const DoctorDisplayPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
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
  const [date, setDate] = useState(dayjs());
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
  const [createPatientAppointment] = useCreatePatientAppointmentMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  const getDoctorAvailability = (doctor, selectedDate) => {
    const availabilityByDate = {};
    const startOfWeek = selectedDate.startOf('week');

    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek.add(i, 'day');
      const dayOfWeek = currentDay.format('dddd').toLowerCase();
      const availability = doctor.availability.find(
        (avail) => avail.day.toLowerCase() === dayOfWeek
      );

      if (availability) {
        const dateKey = currentDay.format('YYYY-MM-DD');
        availabilityByDate[dateKey] = availability.times;
      }
    }
    return availabilityByDate;
  };

  const [availability, setAvailability] = useState({});
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    if (!isLoadingDoctors) {
      const doctor = doctors.find((doc) => doc._id === doctorId);
      if (doctor) {
        const doctorAvailability = getDoctorAvailability(doctor, date);
        setAvailability(doctorAvailability);
      }
    }
  }, [doctors, isLoadingDoctors, doctorId, date]);

  useEffect(() => {
    // Fetch the doctor details from the JSON file
    fetch('/DoctorInformation.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const doctor = data.find((doc) => doc.id === doctorId);
        if (doctor) {
          setDoctorDetails(doctor);
        }
      })
      .catch((error) => console.error('Error fetching doctor details:', error));
  }, [doctorId]);

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
    const doctor = doctors.find((doc) => doc._id === doctorId);
    if (doctor) {
      const doctorAvailability = getDoctorAvailability(doctor, newValue);
      setAvailability(doctorAvailability);
    }
  };

  const onPanelChange = (newValue: Dayjs) => {
    setDate(newValue);
    const doctor = doctors.find((doc) => doc._id === doctorId);
    if (doctor) {
      const doctorAvailability = getDoctorAvailability(doctor, newValue);
      setAvailability(doctorAvailability);
    }
  };

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

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      return dateCellRender(current, appointments || [], availability);
    }
    return info.originNode;
  };

  const handleAssign = async () => {
    try {
      const values = await form.validateFields();
      if (selectedPatient && selectedTime && date) {
        const timeParts = selectedTime.split(':');
        const combinedDateTime = dayjs(date)
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
          practitionerId: doctorId
        }).unwrap();

        await createPatientAppointment({
          selectedPatient,
          selectedDoctor: doctorId,
          appointment
        }).unwrap();

        setIsModalOpen(false);
        message.success('Appointment assigned successfully!');
      } else {
        message.warning('Please select patient, doctor, time, and date.');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      message.error('Failed to assign appointment');
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

  const handleDelete = (patientId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this patient?',
      onOk: async () => {
        try {
          await deletePatient({ _id: patientId }).unwrap();
          message.success('Patient deleted successfully');
        } catch (error) {
          console.error('Failed to delete patient:', error);
          message.error('Failed to delete patient');
        }
      }
    });
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

  const columns: TableColumnsType<any> = [
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
          <Tooltip title="Delete">
            <Button
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              disabled={isDeleting}
              loading={isDeleting}
              style={{ marginTop: '12px' }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  if (!doctorDetails) {
    return <div>Loading...</div>;
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Name',
      children: doctorDetails.name
    },
    {
      key: '2',
      label: 'Hometown',
      children: doctorDetails.hometown
    },
    {
      key: '3',
      label: 'Education',
      span: 2,
      children: doctorDetails.education
    },
    {
      key: '4',
      label: 'Fun Fact',
      children: doctorDetails.funFact
    }
  ];

  return (
    <div className="doctor-page-container">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar {...topBarProps} />
      </Box>
      <div className="doctor-description-and-image">
        <Image width={200} className="doctor-image" src={doctorDetails.image} />
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
          <h1>Availability for {doctorDetails.name}</h1>
          <Calendar
            value={date}
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
              {(availability[date.format('YYYY-MM-DD')] || []).map((time) => (
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
                loading={isLoadingPatients}
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
              <Input value={doctorDetails.name} readOnly />
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

export default DoctorDisplayPage;
