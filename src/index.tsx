import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import PatientPage from './components/PatientView/PatientPage';
import DoctorAvailabilityPage from './components/DoctorAvailabilityPage';
import './index.css';
import ReceptionistHome from './components/Receptionist/ReceptionistHome';
import ViewPatients from './components/Receptionist/ViewPatients';
import PatientDetails from './components/Receptionist/PatientDetails';
import AssignPatient from './components/Receptionist/AssignPatient';
import AdminHome from './components/Layout/AdminHome';
import UserPage from './components/Admin/ManageUsers/UsersPage';
import CheckInForm from './components/Receptionist/CheckInForm';
import GenerateQRCode from './components/Receptionist/GenerateQRCode';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/practitioner-home" element={<Layout />} />
          <Route path="/patient" element={<PatientPage />} />
          <Route
            path="/availability/:doctorId"
            element={<DoctorAvailabilityPage />}
          />
          <Route path="/receptionist-home" element={<ReceptionistHome />} />
          <Route path="/view-patients" element={<ViewPatients />} />
          <Route path="/patient-details/:id" element={<PatientDetails />} />
          <Route path="/assign-patient" element={<AssignPatient />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/checkin" element={<CheckInForm />} />
          <Route path="/generate-qrcode" element={<GenerateQRCode />} />
          <Route
            path="*"
            element={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  fontSize: '2em',
                  color: '#333',
                  backgroundColor: '#f5f5f5'
                }}>
                404 Page not found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
