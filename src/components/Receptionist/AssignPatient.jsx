import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  Typography,
  Space,
  Tooltip,
  Row,
  Col,
  Tag,
  Card,
  message
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useAssignPatientToPractitionerMutation } from '../../services/api';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import './style/AssignPatient.css';

const { Option } = Select;
const { Title } = Typography;

const AssignPatients = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignPatientToPractitioner] =
    useAssignPatientToPractitionerMutation();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('/api/patient/all');
      setPatients(response.data);
    };

    const fetchDoctors = async () => {
      const response = await axios.get('/api/practitioner/available');
      setDoctors(response.data);
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const getDoctorAvailability = (doctor, selectedDate) => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.format('dddd').toLowerCase();

    const availability = doctor.availability.find(
      (avail) => avail.day.toLowerCase() === dayOfWeek
    );
    return availability ? availability.times : [];
  };

  const handleAssign = async () => {
    if (selectedPatient && selectedDoctor && selectedTime && date) {
      const timeParts = selectedTime.split(':');
      const combinedDateTime = dayjs(date)
        .hour(parseInt(timeParts[0]))
        .minute(parseInt(timeParts[1]))
        .second(parseInt(timeParts[2]))
        .format('YYYY-MM-DDTHH:mm:ss');

      const appointment = {
        date: combinedDateTime,
        status: 'scheduled'
      };

      try {
        await axios.post(
          `/api/appointment/toPatient/${selectedPatient}/toPractitioner/${selectedDoctor}`,
          appointment
        );

        await assignPatientToPractitioner({
          patientId: selectedPatient,
          practitionerId: selectedDoctor
        }).unwrap();

        setIsModalOpen(false);
        message.success('Appointment assigned successfully!');
      } catch (error) {
        console.error('Error assigning appointment:', error);
        message.error('Failed to assign appointment. Please try again.');
      }
    } else {
      message.warning('Please select patient, doctor, time, and date.');
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
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
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
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
    <div className="app-container">
      <div className="header">
        <Title level={2} style={{ margin: 0, color: '', padding: '20px 0' }}>
          Assign Patients to Doctors
        </Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" icon={<CalendarOutlined />}>
            View Appointments
          </Button>
        </div>
      </div>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Table
            columns={columns}
            dataSource={patients}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50']
            }}
            rowKey="_id"
            className="custom-table"
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card title="Doctors Availability" bordered>
            <Typography.Paragraph>
              Select a date to see available doctors
            </Typography.Paragraph>
            <DatePicker
              value={date}
              onChange={(newDate) => setDate(newDate)}
              style={{ width: '100%', marginBottom: 16 }}
            />
            <div className="available-doctors">
              {doctors.map((doctor) => {
                const availableTimes = getDoctorAvailability(doctor, date);
                return (
                  availableTimes.length > 0 && (
                    <div key={doctor._id} className="doctor-availability">
                      <Typography.Title level={5}>
                        {doctor.name}
                      </Typography.Title>
                      <Select
                        value={
                          selectedDoctor === doctor._id ? selectedTime : ''
                        }
                        onChange={(value) => {
                          setSelectedDoctor(doctor._id);
                          setSelectedTime(value);
                        }}
                        placeholder="Select a time"
                        style={{ width: '100%' }}>
                        {availableTimes.map((time) => (
                          <Option key={time} value={time}>
                            {time}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  )
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Assign Patient"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAssign}>
        <Form layout="vertical">
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
              value={doctors.find((d) => d._id === selectedDoctor)?.name || ''}
              readOnly
            />
          </Form.Item>
          <Form.Item label="Time">
            <Input value={selectedTime} readOnly />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssignPatients;
