import React from 'react';
import { Link } from 'react-router-dom';
import UserPage from '../Admin/UsersPage';
import { Button } from '@mui/material';

export default function AdminHome() {
  return (
    <div>
      <h1>Admin Home...</h1>
      <Button>
        <Link to="/admin-users">Go to User Page</Link>
      </Button>
    </div>
  );
}
