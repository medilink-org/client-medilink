import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const FamilyHistoryField = () => {
  return (
    <Form.List name="familyHistory">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space
              key={key}
              style={{ display: 'flex', marginBottom: 8 }}
              align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'condition']}
                fieldKey={[fieldKey, 'condition']}
                rules={[{ required: true, message: 'Missing condition' }]}>
                <Input placeholder="Condition" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'relative']}
                fieldKey={[fieldKey, 'relative']}
                rules={[{ required: true, message: 'Missing relative' }]}>
                <Input placeholder="Relative" />
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
              Add Family History
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default FamilyHistoryField;
