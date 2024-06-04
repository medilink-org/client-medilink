import React from 'react';
import { Card } from 'antd';

export default function AdminHome() {
  return (
    <div>
      <Card style={{ maxWidth: 600, margin: '20px' }}>
        <h2>Welcome to the Admin Dashboard</h2>
        <p>
          From here, you can manage all user accounts and their respective
          permissions.
        </p>
      </Card>
    </div>
  );
}
