import React from 'react';
import { Form, Input, Button, Space, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const MedicalHistoryField = () => {
  return (
    <Form.List name="medicalHistory">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space
              key={key}
              style={{ display: 'flex', marginBottom: 8 }}
              align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'operation']}
                fieldKey={[fieldKey, 'operation']}
                rules={[{ required: true, message: 'Missing operation' }]}>
                <Input placeholder="Operation" />
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
                name={[name, 'date']}
                fieldKey={[fieldKey, 'date']}
                rules={[{ required: true, message: 'Missing date' }]}>
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
              Add Medical History
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default MedicalHistoryField;
