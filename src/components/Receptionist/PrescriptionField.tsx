import React from 'react';
import { Form, Input, Button, Space, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const PrescriptionField = () => {
  return (
    <Form.List name="prescriptions">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space
              key={key}
              style={{ display: 'flex', marginBottom: 8 }}
              align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'medication']}
                fieldKey={[fieldKey, 'medication']}
                rules={[{ required: true, message: 'Missing medication' }]}>
                <Input placeholder="Medication" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'dosage']}
                fieldKey={[fieldKey, 'dosage']}
                rules={[{ required: true, message: 'Missing dosage' }]}>
                <Input placeholder="Dosage" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'frequency']}
                fieldKey={[fieldKey, 'frequency']}
                rules={[{ required: true, message: 'Missing frequency' }]}>
                <Input placeholder="Frequency" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'reason']}
                fieldKey={[fieldKey, 'reason']}
                rules={[{ required: true, message: 'Missing reason' }]}>
                <Input placeholder="Reason" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'start']}
                fieldKey={[fieldKey, 'start']}
                rules={[{ required: true, message: 'Missing start date' }]}>
                <DatePicker placeholder="Start Date" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'end']}
                fieldKey={[fieldKey, 'end']}
                rules={[{ required: true, message: 'Missing end date' }]}>
                <DatePicker placeholder="End Date" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}>
              Add Prescription
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default PrescriptionField;
