import { useEffect, useRef, useState } from 'react';
import { usePutPatientMutation } from '../../services/api';
import { CCard, CCardBody, CCardHeader, CCardText } from '@coreui/react';
import IconButton from '@mui/material/IconButton/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// the notes for one day
const CollapsibleOuterBox = ({ date, notes }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <CCard key={date}>
      <CCardBody
        style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '10px 10px 10px 10px',
          justifyItems: 'start',
          maxWidth: 'inherit',
          textWrap: 'wrap'
        }}>
        <CCardHeader
          component="h2"
          style={{
            padding: '10px 10px 10px 10px',
            marginBottom: '10px',
            marginTop: '0px',
            borderRadius: '10px 10px 10px 10px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddddddee'
          }}
          onClick={toggleVisibility}>
          <IconButton sx={{ justifyContent: 'flex-end' }}>
            {isVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          {new Date(date).toLocaleDateString('en-US')}: {notes.length} Note
          {notes.length === 1 ? '' : 's'}
        </CCardHeader>
        {isVisible && (
          <CCardText
            style={{
              padding: '10px 10px 10px 10px',
              margin: '5px 0px 5px 0px'
            }}>
            {notes.map((note, index) => (
              <CollapsibleInnerBox
                key={index}
                content={note.content}
                author={note.author}
                summary={note.summary}
              />
            ))}
          </CCardText>
        )}
      </CCardBody>
    </CCard>
  );
};

// one note
const CollapsibleInnerBox = ({ content, author, summary }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      key={content}
      style={{
        whiteSpace: 'pre-line'
      }}>
      <CCard key={content}>
        <CCardBody
          style={{
            maxWidth: 'inherit',
            justifyItems: 'start',
            textWrap: 'wrap'
          }}>
          <CCardHeader
            component="h3"
            style={{
              marginBottom: '10px',
              marginTop: '0px',
              borderRadius: '10px',
              backgroundColor: '#e5e5e5e5',
              borderBottom: '1px solid #ddddddee'
            }}
            onClick={toggleVisibility}>
            <IconButton sx={{ justifyContent: 'flex-end' }}>
              {isVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <strong>{author + ': ' + (summary ?? '') + '\n'}</strong>
          </CCardHeader>
          {isVisible && (
            <CCardText
              style={{
                marginTop: '0px',
                marginBottom: '18px',
                marginLeft: '38px'
              }}>
              {'\n' + content}
            </CCardText>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

const InnerContent = (props) => {
  const groupedNotes = groupNotesByDate(props.notes);

  return (
    <div
      style={{
        height: 'auto',
        overflow: 'auto',
        borderRadius: '10px'
      }}>
      {groupedNotes.map(({ date, notes }) => (
        <CollapsibleOuterBox key={date} date={date} notes={notes} />
      ))}
    </div>
  );
};

const groupNotesByDate = (notes) => {
  const groupedNotes = {};
  notes.forEach((note) => {
    const date =
      new Date(note.date).getFullYear() +
      '-' +
      (new Date(note.date).getMonth() + 1) +
      '-' +
      new Date(note.date).getDate();
    if (groupedNotes[date]) {
      groupedNotes[date].push(note);
    } else {
      groupedNotes[date] = [note];
    }
  });

  const result = Object.keys(groupedNotes).map((date) => ({
    date,
    notes: groupedNotes[date]
  }));

  return result;
};

declare interface Props {
  patient: Patient;
  setPatient: any;
  practitioner: Practitioner;
  noteText: string;
  setNoteText: any;
}

export default function NotesContent({
  patient,
  setPatient,
  practitioner,
  noteText,
  setNoteText
}: Props) {
  const [updatePatient, error] = usePutPatientMutation();
  const [modalVisible, setModalVisible] = useState(false);

  const modalTextAreaRef = useRef(null);

  useEffect(() => {
    // focus on the textarea when modal is shown
    if (modalVisible && modalTextAreaRef.current) {
      modalTextAreaRef.current.focus();
    }
  }, [modalVisible]);

  const modalElementStyle = {
    paddingTop: '10px',
    paddingBottom: '10px'
  };

  const handleKeyDown = (event) => {
    if (event.metaKey && event.key === 'Enter') {
      if (modalVisible) {
        handleSubmit();
      } else {
        setModalVisible(true);
      }
    }
  };

  const handleSubmit = () => {
    // grab content from textbox
    const text = document
      .querySelector<HTMLInputElement>('#noteinput')
      .value.trim();
    const summary = document
      .querySelector<HTMLInputElement>('#summaryinput')
      .value.trim();
    if (text !== '' && summary !== '') {
      // empty summaries are NOT allowed
      const newNotes = patient.notes;
      newNotes.push({
        author: practitioner.name,
        date: new Date().toLocaleDateString(),
        content: text.toString(),
        summary: summary
      });

      // update stateful and db patient
      updatePatient({
        _id: patient._id,
        delta: { notes: newNotes }
      });
      if (error.isError) {
        alert('There was an error saving your note. Please try again.');
        return;
      }
      setPatient({ ...patient, notes: newNotes });
      document.querySelector<HTMLInputElement>('#noteinput').value = '';
      document.querySelector<HTMLInputElement>('#summaryinput').value = '';
      setNoteText('');
      closeModal();
    } else {
      alert('To create a note you need both a note and a summary.');
    }
  };

  const reversedNotes = [...patient.notes].reverse();

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'modal-background') {
      closeModal();
    }
  };

  return (
    <div>
      <label>
        {' '}
        <strong>
          Add a short note for this patient. Remember - other practitioners will
          see this!
        </strong>
        <textarea
          id={'noteinput'}
          placeholder={'Enter a new note'}
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: 'Arial, sans-serif',
            width: 'calc(100% - 20px)',
            paddingTop: '10px',
            paddingLeft: '10px',
            paddingBottom: '10px',
            marginTop: '20px',
            borderRadius: '10px 10px 10px 10px',
            resize: 'none'
          }}
          rows={10}
          autoFocus={true}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </label>
      <br />
      <button
        style={{
          borderRadius: '5px',
          marginBottom: '10px',
          fontSize: '1em'
        }}
        onClick={() => setModalVisible(true)}>
        Add a note summary
      </button>
      <InnerContent notes={reversedNotes} />

      {modalVisible && (
        <div
          id="modal-background"
          onClick={handleBackgroundClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
          <div
            style={{
              backgroundColor: '#FFF',
              padding: 20,
              borderRadius: 10,
              position: 'relative'
            }}>
            <button
              onClick={closeModal}
              style={{ position: 'absolute', top: 5, right: 5 }}>
              X
            </button>
            <div style={modalElementStyle}>
              <strong>Add a short summary to your note</strong>
            </div>
            <textarea
              ref={modalTextAreaRef}
              id={'summaryinput'}
              placeholder="Short (5-10 word) description of your note"
              onKeyDown={handleKeyDown}
              style={{
                fontFamily: 'Arial, sans-serif',
                padding: '10px'
              }}
              cols={50}
              rows={2}
            />
            <div style={modalElementStyle}>
              <button onClick={handleSubmit}>Create Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
