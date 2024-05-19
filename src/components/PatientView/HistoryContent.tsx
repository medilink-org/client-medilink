import { useState } from 'react';
import { CCard, CCardBody } from '@coreui/react';
import { styled } from 'styled-components';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// This file originally from https://coreui.io/react/docs/components/collapse/
// It has been modified for use in this project

declare interface Props {
  patient: Patient;
}

const CollapsibleHistoryBox = ({
  date,
  type,
  reason,
  synopsis,
  measurements,
  socialHistory
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <HistoryContentWrapper>
      <HeaderButton onClick={toggleVisibility}>
        <HistoryContentHeader>
          <h3>
            {date} - {type}
          </h3>
          <IconButton onClick={toggleVisibility}>
            {isVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </HistoryContentHeader>
      </HeaderButton>
      {isVisible && (
        <CCard className="mt-3">
          <CCardBody
            style={{
              justifyItems: 'start',
              maxWidth: 'inherit',
              textWrap: 'wrap',
              padding: '0px 0px 20px 20px'
            }}
          >
            <h4>
              Reason for visit:{' '}
              <span style={{ fontWeight: 'normal' }}>{reason}</span>
            </h4>
            {measurements != null && (
              <h4>
                Vitals:
                <span style={{ fontWeight: 'normal' }}>
                  <ul>
                    {measurements.map((measurement, index) => (
                      <li key={index}>
                        {measurement.type}: {measurement.value}
                        {measurement.type === 'Temperature' ? ' °F' : ''}
                        {measurement.type === 'Heart Rate' ? 'bpm' : ''}
                        {measurement.type === 'Height' ? 'cm' : ''}
                        {measurement.type === 'Weight' ? 'kg' : ''}
                        {measurement.type === 'Blood O2' ? '%' : ''}
                      </li>
                    ))}
                  </ul>
                </span>
              </h4>
            )}

            {socialHistory != null && (
              <h4>
                Reported Social History:
                <span style={{ fontWeight: 'normal' }}>
                  <ul>
                    {socialHistory.map((item, index) => (
                      <li key={index}>
                        {item.type}: {item.value}
                      </li>
                    ))}
                  </ul>
                </span>
              </h4>
            )}

            <h4>
              Appointment Synopsis:{' '}
              <span style={{ fontWeight: 'normal' }}>{synopsis}</span>
            </h4>
          </CCardBody>
        </CCard>
      )}
    </HistoryContentWrapper>
  );
};

export default function HistoryContent({ patient }: Props) {
  // Sort appointments by time and whether they have happened
  const sortedAppointments = patient.appointments
    .filter((appointment) => {
      return new Date(appointment.date).getTime() < new Date().getTime();
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <>
      {sortedAppointments.map((item, index) => (
        <CollapsibleHistoryBox
          key={index}
          date={new Date(item.date).toLocaleDateString('en-US')}
          type={item.type}
          reason={item.reason}
          synopsis={item.synopsis}
          measurements={item.measurements}
          socialHistory={item.socialHistory}
        />
      ))}
    </>
  );
}

const HistoryContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 20px 0px;
  border-radius: 10px 10px 10px 10px;
  width: calc(100%);
  height: 100%;
  background-color: #f5f5f5;
`;

const HistoryContentHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px 10px 10px 10px;
  border-bottom: 1px solid #ddddddee;
  width: calc(100% - 20px);
  height: 45px;
  padding: 0px 0px 0px 20px;
  margin-bottom: -10px;
  margin-top: -10px;
  background-color: #f5f5f5;
`;

const HeaderButton = styled.button`
  cursor: pointer;
  border-radius: 10px 10px 10px 10px;
  width: 100%;
  height: 45px;
  padding: 0px 0px 0px 0px;
  background-color: #f5f5f5;
  border: none;
`;
