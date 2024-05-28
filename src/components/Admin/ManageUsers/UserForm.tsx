import React, { useState, useEffect } from 'react';
import generator from 'generate-password-browser';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Tooltip,
  Row,
  Col,
  message
} from 'antd';
import {
  CheckCircleOutlined,
  CopyOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import { useCreateUserMutation } from '../../../services/api';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const UserForm = () => {
  const [form] = Form.useForm();
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loginInfo, setLoginInfo] = useState('');
  const [copyTooltip, setCopyTooltip] = useState('Copy to clipboard');
  const [createUser] = useCreateUserMutation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const username = form.getFieldValue('username') || '';
    const password = form.getFieldValue('password') || generatedPassword;
    setLoginInfo(`Username: ${username}\nPassword: ${password}`);
  }, [form, generatedPassword]);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const userId = '6653b2772c6d035c9cf265ab';
      values.userId = userId;
      console.log('Received values of form: ', values);
      const response = await createUser(values);
      console.log(response);
      if (response.data) {
        message.success({
          content: 'User created successfully!',
          icon: <CheckCircleOutlined />,
          duration: 5
        });
      } else {
        console.log(
          `Error creating user. ${response.error.data.error.errorResponse.errmsg}`
        );
        message.error({
          content: `Error creating user. ${response.error.data.error.errorResponse.errmsg}`,
          icon: <CloseCircleOutlined />,
          duration: 5
        });
      }
    } catch (error) {
      message.error({
        content: `Error creating user. ${error.message}`,
        icon: <CloseCircleOutlined />,
        duration: 5
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePasswordHandler = () => {
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true
    });
    setGeneratedPassword(password);
    form.setFieldsValue({ password, confirm: password });
  };

  const copyToClipboard = () => {
    const username = form.getFieldValue('username') || '';
    const password = form.getFieldValue('password');
    const loginInfo = `Username: ${username}\nPassword: ${password}`;
    copy(loginInfo);
    setCopyTooltip('Copied to clipboard');
    setTimeout(() => setCopyTooltip('Copy to clipboard'), 2000);
  };

  const handleValuesChange = () => {
    const username = form.getFieldValue('username') || '';
    const password = form.getFieldValue('password') || generatedPassword;
    setLoginInfo(`Username: ${username}\nPassword: ${password}`);
  };

  useEffect(() => {
    form.setFieldsValue({
      password: generatedPassword,
      confirm: generatedPassword
    });
  }, [generatedPassword, form]);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
      style={{
        maxWidth: 600,
        paddingTop: 20
      }}
      scrollToFirstError>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your username!'
          }
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input the user's Name!"
          }
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="initials"
        label="Initials"
        rules={[
          {
            required: true,
            message: 'Initials are required!'
          }
        ]}>
        <Input />
      </Form.Item>

      <Form.Item name="password" label="Password" hasFeedback>
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item
              name="password"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}>
              <Input.Password style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col flex="120px">
            <Button onClick={generatePasswordHandler} style={{ width: '100%' }}>
              Generate
            </Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The passwords do not match!'));
            }
          })
        ]}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        rules={[
          {
            required: true,
            message: 'Please select your role!'
          }
        ]}>
        <Select placeholder="Select your role">
          <Option value="admin">Admin</Option>
          <Option value="practitioner">Practitioner</Option>
          <Option value="receptionist">Receptionist</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error('Should accept agreement'))
          }
        ]}
        {...tailFormItemLayout}>
        <Checkbox>
          I understand that the username and password will be saved now, but the
          password cannot be retrieved later. I confirm I will copy it now.
        </Checkbox>
      </Form.Item>

      <Form.Item {...formItemLayout} label="Login Info">
        <Row gutter={8}>
          <Col flex="auto">
            <Input.TextArea readOnly value={loginInfo} />
          </Col>
          <Col>
            <Tooltip title={copyTooltip}>
              <Button icon={<CopyOutlined />} onClick={copyToClipboard} />
            </Tooltip>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}>
          Add User
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
