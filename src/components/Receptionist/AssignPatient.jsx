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
  Card,
  message
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {
  useAssignPatientToPractitionerMutation,
  useDeletePatientMutation
} from '../../services/api';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import './style/AssignPatient.css';
import { DeleteOutlined } from '@mui/icons-material';

const { Option } = Select;
const { Title } = Typography;

const AssignPatients = () => {
  const [form] = Form.useForm();
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
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/patient/all');
        setPatients(response.data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        message.error('Failed to fetch patients');
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/practitioner/available');
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        message.error('Failed to fetch doctors');
      }
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
    try {
      const values = await form.validateFields();
      if (selectedPatient && selectedDoctor && selectedTime && date) {
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
      } else {
        message.warning('Please select patient, doctor, time, and date.');
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

  const handleDelete = (patientId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this appointment?',
      onOk: async () => {
        console.log('Delete patient:', patientId);
        await deletePatient({ _id: patientId });
        setPatients(patients.filter((patient) => patient._id !== patientId));
      }
    });
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
          <Tooltip title="Delete">
            <Button
              type="danger"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              onClick={() => handleDelete(record._id)}
              disabled={isDeleting}
              loading={isDeleting}
            />
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
              value={doctors.find((d) => d._id === selectedDoctor)?.name || ''}
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
  );
};

export default AssignPatients;
