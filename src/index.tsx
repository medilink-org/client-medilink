import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import PatientPage from './components/PatientView/PatientPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home/" element={<Layout />} />
          <Route path="/patient" element={<PatientPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
