import { CCard, CCardBody } from '@coreui/react';
import React from 'react';
import styled from 'styled-components';

const Medications = ({
  prescriptions,
  allergies
}: {
  prescriptions: Prescription[];
  allergies: Allergy[];
}) => (
  <CCard>
    <CCardBody
      style={{
        justifyItems: 'start',
        maxWidth: 'inherit',
        textWrap: 'wrap',
        padding: '0px 0px 20px 20px'
      }}>
      <List>
        {prescriptions.map((prescription, index) => (
          <React.Fragment key={index}>
            {allergies.find((allergy) => {
              return allergy.allergen === prescription.medication;
            }) ? (
              <ListItem key={index} style={{ backgroundColor: 'crimson' }}>
                <strong>{prescription.medication}:</strong>{' '}
                {prescription.dosage}, {prescription.frequency} for{' '}
                {prescription.reason}{' '}
                <strong>This patient is allergic to this medication!</strong>
              </ListItem>
            ) : (
              <ListItem key={index} style={{}}>
                <strong>{prescription.medication}:</strong>{' '}
                {prescription.dosage}, {prescription.frequency} for{' '}
                {prescription.reason}
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </CCardBody>
  </CCard>
);

const MedicalHistory = ({ history }: { history: Operation[] }) => (
  <>
    <h3 style={{ marginLeft: '20px' }}>Surgeries</h3>
    <CCard>
      <CCardBody
        style={{
          justifyItems: 'start',
          maxWidth: 'inherit',
          textWrap: 'wrap',
          padding: '0px 0px 20px 20px'
        }}>
        <List>
          {history.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem key={index} style={{ padding: '0px 0px 0px 10px' }}>
                <h4>
                  Operation:{' '}
                  <span style={{ fontWeight: 'normal' }}>{item.operation}</span>{' '}
                </h4>
                <h4>
                  Reason:{' '}
                  <span style={{ fontWeight: 'normal' }}>{item.reason}</span>
                </h4>
                <h4>
                  Date:{' '}
                  <span style={{ fontWeight: 'normal' }}>
                    {new Date(item.date).toLocaleDateString('en-US')}
                  </span>
                </h4>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CCardBody>
    </CCard>
  </>
);

const Allergies = ({ allergies }: { allergies: Allergy[] }) => (
  <CCard>
    <CCardBody
      style={{
        justifyItems: 'start',
        maxWidth: 'inherit',
        textWrap: 'wrap',
        padding: '0px 0px 20px 20px'
      }}>
      <List>
        {allergies.map((item, index) => (
          <ListItem key={index} style={{}}>
            <strong>{item.allergen}: </strong> {item.severity} severity.{' '}
            Reaction: {item.reaction}
          </ListItem>
        ))}
      </List>
    </CCardBody>
  </CCard>
);

const FamilyHistory = ({ familyHistory }: { familyHistory: Condition[] }) => (
  <CCard>
    <CCardBody
      style={{
        justifyItems: 'start',
        maxWidth: 'inherit',
        textWrap: 'wrap',
        padding: '0px 0px 20px 20px'
      }}>
      <List>
        {familyHistory.map((item, index) => (
          <ListItem key={index}>
            <strong>{item.condition}:</strong> {item.relative}
          </ListItem>
        ))}
      </List>
    </CCardBody>
  </CCard>
);

const List = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  padding: 0px 10px 0px 0px;
`;

const ListItem = styled.li`
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px 0px 10px 10px;
  margin-bottom: 5px;
  border-radius: 4px;
`;

export { FamilyHistory, MedicalHistory, Allergies, Medications };
