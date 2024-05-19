import { useState } from 'react';
import {
  Allergies,
  FamilyHistory,
  MedicalHistory,
  Medications
} from './MedicalHistory';
import { CCard, CCardBody } from '@coreui/react';
import IconButton from '@mui/material/IconButton/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from 'styled-components';

interface Props {
  patient: Patient;
}

export default function PlanContent({ patient }: Props) {
  const [isMedicationsVisible, setIsMedicationsVisible] = useState(true);
  const [isMedicalVisible, setIsMedicalVisible] = useState(false);
  const [isFamilyVisible, setIsFamilyVisible] = useState(false);
  const [isAllergiesVisible, setIsAllergiesVisible] = useState(true);

  const toggleMedicationsVisibility = () => {
    setIsMedicationsVisible(!isMedicationsVisible);
  };

  const toggleMedicalVisibility = () => {
    setIsMedicalVisible(!isMedicalVisible);
  };

  const toggleFamilyVisibility = () => {
    setIsFamilyVisible(!isFamilyVisible);
  };

  const toggleAllergiesVisibility = () => {
    setIsAllergiesVisible(!isAllergiesVisible);
  };

  return (
    <>
      <ContentWrapper>
        <HeaderButton onClick={toggleAllergiesVisibility}>
          <ContentHeader>
            <Title>Allergies</Title>
            <IconButton onClick={toggleAllergiesVisibility}>
              {isMedicalVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ContentHeader>
        </HeaderButton>
        {isAllergiesVisible && (
          <CCard className="mt-3">
            <CCardBody
              style={{
                justifyItems: 'start',
                maxWidth: 'inherit',
                textWrap: 'wrap',
                padding: '0px 0px 0px 0px'
              }}>
              <Allergies allergies={patient.allergies} />
            </CCardBody>
          </CCard>
        )}
      </ContentWrapper>
      <ContentWrapper>
        <HeaderButton onClick={toggleMedicationsVisibility}>
          <ContentHeader>
            <Title>Medications</Title>
            <IconButton onClick={toggleMedicationsVisibility}>
              {isMedicationsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ContentHeader>
        </HeaderButton>
        {isMedicationsVisible && (
          <CCard className="mt-3">
            <CCardBody
              style={{
                justifyItems: 'start',
                maxWidth: 'inherit',
                textWrap: 'wrap',
                padding: '0px 0px 0px 0px'
              }}>
              <Medications
                prescriptions={patient.prescriptions}
                allergies={patient.allergies}
              />
            </CCardBody>
          </CCard>
        )}
      </ContentWrapper>

      <ContentWrapper>
        <HeaderButton onClick={toggleMedicalVisibility}>
          <ContentHeader>
            <Title>Medical History</Title>
            <IconButton onClick={toggleMedicalVisibility}>
              {isMedicalVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ContentHeader>
        </HeaderButton>
        {isMedicalVisible && (
          <CCard className="mt-3">
            <CCardBody
              style={{
                justifyItems: 'start',
                maxWidth: 'inherit',
                textWrap: 'wrap',
                padding: '0px 0px 0px 0px'
              }}>
              <MedicalHistory history={patient.medicalHistory} />
            </CCardBody>
          </CCard>
        )}
      </ContentWrapper>

      <ContentWrapper>
        <HeaderButton onClick={toggleFamilyVisibility}>
          <ContentHeader>
            <Title>Family History</Title>
            <IconButton onClick={toggleFamilyVisibility}>
              {isFamilyVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ContentHeader>
        </HeaderButton>
        {isFamilyVisible && (
          <CCard className="mt-3">
            <CCardBody
              style={{
                justifyItems: 'start',
                maxWidth: 'inherit',
                textWrap: 'wrap',
                padding: '0px 0px 0px 0px'
              }}>
              <FamilyHistory familyHistory={patient.familyHistory} />
            </CCardBody>
          </CCard>
        )}
      </ContentWrapper>
    </>
  );
}

const ContentHeader = styled.div`
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 20px 0px;
  border-radius: 10px 10px 10px 10px;
  width: calc(100%);
  background-color: #f5f5f5;
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: #000000;
  margin-top: 10px;
  margin-bottom: 10px;
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
