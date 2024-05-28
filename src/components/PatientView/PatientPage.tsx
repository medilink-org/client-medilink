import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { deepPurple } from '@mui/material/colors';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ButtonBar from './ButtonBar';
import ContentArea from './ContentArea';
import TopBar from './TopBar';
import CommandBar from './CommandBar';

export default function PatientPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('plan');
  const [activePatient, setActivePatient] = useState<Patient>(
    location.state.patient
  );
  const [thisAppointment, setThisAppointment] = useState<Appointment>(
    location.state.appointment
  );
  const practitioner = location.state.practitioner;

  const commandBarProps = {
    patient: activePatient,
    setPatient: setActivePatient,
    appointment: thisAppointment,
    setAppointment: setThisAppointment,
    practitioner: practitioner
  };

  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: <CommandBar {...commandBarProps} />,
    right: null,
    style: null,
    practitioner: practitioner,
    path: '/practitioner-home'
  };

  const sortedAppointments = activePatient.appointments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const mostRecentAppointment =
    sortedAppointments && sortedAppointments.length > 0
      ? sortedAppointments[sortedAppointments.length - 1]
      : null;

  const recentMeasurements = mostRecentAppointment
    ? mostRecentAppointment.measurements
    : [];

  const recentSocialHistory = mostRecentAppointment
    ? mostRecentAppointment.socialHistory
    : [];

  return (
    <div>
      <TopBar {...topBarProps} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          padding: 20
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '40px'
          }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <h2
              style={{
                width: 300,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px'
                // marginLeft: '70px'
              }}>
              <Avatar sx={{ bgcolor: deepPurple[500] }}>
                {activePatient.initials}
              </Avatar>
              {activePatient.name}
            </h2>
          </div>
          <div style={{ flex: 1 }}></div>
          <ButtonBar
            style={{
              marginLeft: 'auto',
              width: 'max-content',
              maxWidth: 'max-content'
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Box>
        <Box
          sx={{
            display: 'flex'
          }}>
          <Box
            id="atAGlance"
            sx={{
              backgroundColor: '#dddddd',
              width: 300,
              height: 'max-content',
              borderRadius: '10px 10px 10px 10px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
            }}>
            <PanelHeader>At a Glance</PanelHeader>
            <AtAGlanceContent>
              <strong>Overview</strong>
              <AAGSubModule>
                <p>
                  Age: {activePatient.age}
                  <br></br> DOB:{' '}
                  {new Date(activePatient.birthDate).toLocaleDateString()}
                  <br></br> Gender: {activePatient.gender}
                </p>
              </AAGSubModule>
              <strong>Metrics and Vitals</strong>
              <AAGSubModule>
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                  {recentMeasurements.map((measurement, index) => (
                    <li key={index}>
                      {measurement.type}: {measurement.value}
                      {measurement.type === 'Temperature' ? ' °F' : ''}
                      {measurement.type === 'Heart Rate' ? 'bpm' : ''}
                      {measurement.type === 'Height' ? 'in' : ''}
                      {measurement.type === 'Weight' ? 'lbs' : ''}
                      {measurement.type === 'Blood O2' ? '%' : ''}
                    </li>
                  ))}
                </ul>
              </AAGSubModule>
              <strong>Social History</strong>
              <AAGSubModule>
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                  {recentSocialHistory.map((item, index) => (
                    <li key={index}>
                      {item.type}: {item.value}
                    </li>
                  ))}
                </ul>
              </AAGSubModule>
              <p>
                <strong>Allergies: </strong>
                {activePatient.allergies
                  .map((allergy) => allergy.allergen)
                  .join(', ')}
              </p>
              <>
                <strong>Key Medical History</strong>
                <AAGSubModule>
                  <p>
                    Treatments:{' '}
                    {activePatient.activeTreatments
                      .map((treatment) => treatment.treatment)
                      .join(', ')}
                  </p>
                </AAGSubModule>
              </>
            </AtAGlanceContent>
          </Box>
          <Box
            sx={{
              backgroundColor: '#dddddd',
              marginLeft: 2,
              width: 400,
              flex: 1,
              borderRadius: '10px 10px 10px 10px'
            }}>
            <PanelHeader>
              {activeTab[0].toUpperCase() + activeTab.substring(1)}
            </PanelHeader>

            <ContentArea
              patient={activePatient}
              appointment={thisAppointment}
              setPatient={setActivePatient}
              activeTab={activeTab}
              practitioner={practitioner}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
}

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8198a1;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  text-align: left;
  padding-left: 20px;
  font-size: 20px;
  font-weight: 500;
`;
const AtAGlanceContent = styled.div`
  border-radius: 10px;
  width: calc(100% - 40px);
  flex: auto;
  margin: 10px;
  padding: 10px;
`;

const AAGSubModule = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 10px;
  margin-top: -10px;
  width: calc(100% - 60px);
  flex: auto;
`;
