import styled from 'styled-components';
import ChartContent from './ChartContent';
import NotesContent from './NotesContent';
import PlanContent from './PlanContent';
import SynopsisContent from './SynopsisContent';
import HistoryContent from './HistoryContent';
import { useState } from 'react';

interface Props {
  patient: Patient;
  setPatient: any;
  activeTab: any;
  appointment: Appointment;
  practitioner: Practitioner;
}

const ContentArea = ({
  patient,
  setPatient,
  appointment,
  activeTab,
  practitioner
}: Props) => {
  // a bit hacky, but lets us persist text input on tab change
  const [synopsisText, setSynopsisText] = useState(appointment.synopsis ?? '');
  const [noteText, setNoteText] = useState('');
  const renderContent = () => {
    switch (activeTab) {
      case 'plan':
        return <PlanContent patient={patient} />;
      case 'notes':
        return (
          <NotesContent
            patient={patient}
            setPatient={setPatient}
            practitioner={practitioner}
            noteText={noteText ?? ''}
            setNoteText={setNoteText}
          />
        );
      case 'charts':
        return <ChartContent patient={patient} />;
      case 'appointment synopsis':
        return (
          <SynopsisContent
            appointment={appointment}
            patient={patient}
            setPatient={setPatient}
            synopsisText={synopsisText ?? ''}
            setSynopsisText={setSynopsisText}
          />
        );
      case 'history':
        return <HistoryContent patient={patient} />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return <StyledContentArea>{renderContent()}</StyledContentArea>;
};

const StyledContentArea = styled.main`
  width: calc(100% - 20px);
  max-height: 50%;
  padding: 10px;
`;
export default ContentArea;
