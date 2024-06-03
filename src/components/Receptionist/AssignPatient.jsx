import React, { useState, useRef } from 'react';
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
  message,
  Layout
} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import {
  useGetAllPatientsQuery,
  useGetAvailablePractitionersQuery,
  useCreatePatientAppointmentMutation,
  useAssignPatientToPractitionerMutation,
  useDeletePatientMutation
} from '../../services/api';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import './style/AssignPatient.css';
import { DeleteOutlined } from '@mui/icons-material';

const { Option } = Select;
const { Title } = Typography;
const { Header, Content } = Layout;

const AssignPatients = () => {
  const [form] = Form.useForm();
  const [date, setDate] = useState(dayjs());
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const { data: patients = [], isLoading: isLoadingPatients } =
    useGetAllPatientsQuery();
  const { data: doctors = [] } = useGetAvailablePractitionersQuery();
  const [assignPatientToPractitioner] =
    useAssignPatientToPractitionerMutation();
  const [createPatientAppointment] = useCreatePatientAppointmentMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

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

        // Assign patient to doctor
        await assignPatientToPractitioner({
          patientId: selectedPatient,
          practitionerId: selectedDoctor
        }).unwrap();

        // Create appointment for patient
        await createPatientAppointment({
          selectedPatient,
          selectedDoctor,
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
      title: 'Are you sure you want to delete this appointment?',
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout
        style={{
          boxShadow:
            '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
        <Header
          style={{
            padding: '20px',
            backgroundColor: '#f0f2f5',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <Title
            level={2}
            style={{
              color: '#001529'
            }}>
            Assign Patients to Doctors
          </Title>
        </Header>
        <Content style={{ marginTop: '30px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}>
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
                  loading={isLoadingPatients}
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
                      const availableTimes = getDoctorAvailability(
                        doctor,
                        date
                      );
                      return (
                        availableTimes.length > 0 && (
                          <div key={doctor._id} className="doctor-availability">
                            <Typography.Title level={5}>
                              {doctor.name}
                            </Typography.Title>
                            <Select
                              value={
                                selectedDoctor === doctor._id
                                  ? selectedTime
                                  : ''
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
          </div>
        </Content>
      </Layout>

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
    </Layout>
  );
};

export default AssignPatients;
