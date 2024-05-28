import { useRef, useState } from 'react';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col
} from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation
} from '../../../services/api';
import UserForm from './UserForm';
import './Users.css';
import TopBar from '../../PatientView/TopBar';

const { Title } = Typography;

const UsersPage = () => {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
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

  const roleColors = {
    admin: 'volcano',
    practitioner: 'geekblue',
    receptionist: 'green'
  };

  const handleEdit = (record) => {
    // Might implement edit functionality in the future - leaving it for now
    console.log('Edit:', record);
  };

  const handleDelete = async (record) => {
    console.log('Delete:', record);
    const userToDeleteId = record._id;
    await deleteUser({ _id: userToDeleteId });
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username', 'Username')
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name', 'Name')
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={roleColors[role]}>{role.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Practitioner', value: 'practitioner' },
        { text: 'Receptionist', value: 'receptionist' }
      ],
      onFilter: (value, record) => record.role.includes(value)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              loading={isDeleting}
              disabled={isDeleting}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    path: '/admin-home'
  };

  return (
    <div>
      <TopBar {...topBarProps} />
      <div className="app-container">
        <div className="header">
          <Title
            level={2}
            style={{ margin: 0, color: '#1890ff', padding: '20px 0' }}>
            Users
          </Title>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="primary" icon={<UploadOutlined />}>
              Import
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Export
            </Button>
          </div>
        </div>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Table
              columns={columns}
              dataSource={isLoading ? [] : users}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50']
              }}
              loading={isLoading}
              rowKey="id"
              className="custom-table"
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <UserForm />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UsersPage;
