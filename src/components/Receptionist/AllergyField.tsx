import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const AllergyField = () => {
  return (
    <Form.List name="allergies">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space
              key={key}
              style={{ display: 'flex', marginBottom: 8 }}
              align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'allergen']}
                fieldKey={[fieldKey, 'allergen']}
                rules={[{ required: true, message: 'Missing allergen' }]}>
                <Input placeholder="Allergen" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'severity']}
                fieldKey={[fieldKey, 'severity']}
                rules={[{ required: true, message: 'Missing severity' }]}>
                <Input placeholder="Severity" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'reaction']}
                fieldKey={[fieldKey, 'reaction']}
                rules={[{ required: true, message: 'Missing reaction' }]}>
                <Input placeholder="Reaction" />
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
              Add Allergy
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default AllergyField;
