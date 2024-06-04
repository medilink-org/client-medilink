import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Tooltip,
  message
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axiosInstance from '../../axiosInstance';
import './style/ViewPatients.css';

const { Title } = Typography;

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const navigate = useNavigate();
  const searchInput = useRef(null);

  useEffect(() => {
    axiosInstance
      .get('/patient/all')
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        message.error('Error fetching patients');
        console.error('Error fetching patients:', error);
      });
  }, []);

  const handleViewPatient = (id) => {
    navigate(`/receptionist-patient-details/${id}`);
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
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
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
      title: 'Initials',
      dataIndex: 'initials',
      key: 'initials',
      ...getColumnSearchProps('initials', 'Initials')
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate)
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewPatient(record._id)}>
              View
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="view-patients-container">
      <div style={{ padding: '24px' }}>
        <Title
          level={2}
          style={{
            margin: 0,
            textAlign: 'center',
            marginBottom: '20px'
          }}>
          Patient List
        </Title>
        <Table
          columns={columns}
          dataSource={patients}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          rowKey="_id"
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default ViewPatients;
