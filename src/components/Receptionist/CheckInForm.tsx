import React from 'react';
import { Form, Input, DatePicker, Radio, Button, message } from 'antd';
import { usePostPatientMutation } from '../../services/api';
import AllergyField from './AllergyField';
import PrescriptionField from './PrescriptionField';
import MedicalHistoryField from './MedicalHistoryField';
import FamilyHistoryField from './FamilyHistoryField';
import './style/CheckInPatients.css';

const CheckInPatients = () => {
  const [form] = Form.useForm();
  const [postPatient, { isLoading }] = usePostPatientMutation();

  const handleSubmit = async (values: any) => {
    const patientData = {
      ...values,
      birthDate: values.birthDate.toISOString()
    };

    try {
      await postPatient(patientData).unwrap();
      message.success('Check-in successful');
      form.resetFields();
    } catch (error) {
      message.error('Check-in failed');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="check-in-form">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter your name' }]}>
        <Input placeholder="Full Name" />
      </Form.Item>

      <Form.Item
        name="initials"
        label="Initials"
        rules={[{ required: true, message: 'Please enter your initials' }]}>
        <Input placeholder="Initials" />
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: 'Please enter your age' }]}>
        <Input type="number" placeholder="Age" />
      </Form.Item>

      <Form.Item
        name="birthDate"
        label="Birth Date"
        rules={[{ required: true, message: 'Please select your birth date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: 'Please select your gender' }]}>
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">Other</Radio>
        </Radio.Group>
      </Form.Item>

      <AllergyField />

      <PrescriptionField />

      <MedicalHistoryField />

      <FamilyHistoryField />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Check In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CheckInPatients;
