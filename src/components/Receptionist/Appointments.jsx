import React, { useState, useRef } from 'react';
import {
  Badge,
  Calendar,
  Typography,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Alert
} from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import {
  useGetAllAppointmentsQuery,
  useDeleteAppointmentMutation
} from '../../services/api';
import './Appointments.css';

const { Title } = Typography;

const statusColors = {
  'in-progress': 'processing',
  complete: 'success',
  cancelled: 'error',
  scheduled: 'warning'
};

const getListData = (value, appointments) => {
  return appointments
    ? appointments.filter((appointment) =>
        dayjs(appointment.date).isSame(value, 'day')
      )
    : [];
};

const dateCellRender = (value, appointments) => {
  const listData = getListData(value, appointments);
  return (
    <ul className="events">
      {listData.map((item) => (
        <li key={item._id}>
          <Badge
            status={statusColors[item.status]}
            text={`${item.patient.name} - ${item.practitioner.name}`}
          />
        </li>
      ))}
    </ul>
  );
};

const AppointmentViews = () => {
  const { data: appointments, isLoading } = useGetAllAppointmentsQuery();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
          <Button type="link" size="small" onClick={() => confirm()}>
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

  const onSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this appointment?',
      onOk: async () => {
        console.log('Delete:', record._id);
        await deleteAppointment(record._id);
      }
    });
  };

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patient',
      key: 'patient',
      ...getColumnSearchProps('patient'),
      render: (patient) => patient.name
    },
    {
      title: 'Practitioner Name',
      dataIndex: 'practitioner',
      key: 'practitioner',
      ...getColumnSearchProps('practitioner'),
      render: (practitioner) => practitioner.name
    },
    {
      title: 'Date of Appointment',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMMM Do YYYY, h:mm a'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ...getColumnSearchProps('reason')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Complete', value: 'complete' },
        { text: 'Cancelled', value: 'cancelled' },
        { text: 'Scheduled', value: 'scheduled' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Badge status={statusColors[status]} text={status.toUpperCase()} />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={isDeleting}
            disabled={isDeleting}
          />
        </Space>
      )
    }
  ];

  const cellRender = (current, info) => {
    if (info.type === 'date')
      return dateCellRender(current, appointments || []);
    return info.originNode;
  };

  return (
    <div className="appointment-container">
      <Title
        level={2}
        style={{
          margin: 0,
          color: 'black',
          padding: '20px 0',
          textAlign: 'center'
        }}>
        Appointments
      </Title>
      <Alert
        message={`You selected date: ${selectedDate.format('MMMM Do YYYY')}`}
        type="info"
        style={{ marginBottom: 20 }}
      />
      <Calendar
        className="appointment-calendar"
        value={selectedDate}
        onSelect={onSelectDate}
        cellRender={cellRender}
      />
      <Title level={4} style={{ marginTop: '20px' }}>
        Appointments for {selectedDate.format('MMMM Do YYYY')}
      </Title>
      <div className="appointment-list-container">
        <Table
          columns={columns}
          dataSource={getListData(selectedDate, appointments || [])}
          loading={isLoading}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
        />
      </div>
    </div>
  );
};

export default AppointmentViews;
