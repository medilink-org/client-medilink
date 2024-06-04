import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import PatientPage from './components/PatientView/PatientPage';
import DoctorAvailabilityPage from './components/DoctorAvailabilityPage';
import ReceptionistHome from './components/Receptionist/ReceptionistHome';
import ViewPatients from './components/Receptionist/ViewPatients';
import PatientDetails from './components/Receptionist/PatientDetails';
import AssignPatient from './components/Receptionist/AssignPatient';
import AdminHome from './components/Layout/AdminHome';
import UserPage from './components/Admin/UsersPage';
import CheckInForm from './components/Receptionist/CheckInForm';
import GenerateQRCode from './components/Receptionist/GenerateQRCode';
import PractitionerHome from './components/Practitioner/PractitionerHome';
import SelectDoctor from './components/Receptionist/SelectDoctor';
import DoctorDisplayPage from './components/Receptionist/DoctorDisplayPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const NotFound = () => (
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
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/practitioner-home" element={<PractitionerHome />} />
            <Route path="/practitioner-patient" element={<PatientPage />} />
            <Route
              path="/practitioner-availability/:doctorId"
              element={<DoctorAvailabilityPage />}
            />

            <Route path="/receptionist-home" element={<ReceptionistHome />} />
            <Route
              path="/receptionist-view-patients"
              element={<ViewPatients />}
            />
            <Route
              path="/receptionist-assign-patient"
              element={<AssignPatient />}
            />
            <Route path="/receptionist-checkin" element={<CheckInForm />} />
            <Route
              path="/receptionist-generate-qrcode"
              element={<GenerateQRCode />}
            />
            <Route
              path="/receptionist-patient-details/:id"
              element={<PatientDetails />}
            />

            <Route
              path="/receptionist-doctor-page"
              element={<SelectDoctor />}
            />
            <Route
              path="/receptionist-doctor-page/:doctorId"
              element={<DoctorDisplayPage />}
            />

            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin-users" element={<UserPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
