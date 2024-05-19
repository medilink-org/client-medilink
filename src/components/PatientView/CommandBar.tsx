import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Box,
  Autocomplete,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  usePutAppointmentMutation,
  usePutPatientMutation
} from '../../services/api';
import styled from 'styled-components';

// added these options in case we want to utilize autocomplete/autosuggest
const barOptions = [
  { command: '/startVisit', description: 'visit this patient' },
  { command: '/n', description: 'write a note' },
  { command: '/r', description: 'record vitals' },
  { command: '/p', description: 'prescribe/update medications' },
  { command: '/h', description: 'update medical history' },
  { command: '/endVisit', description: 'end visit with this patient' },
  { command: '/fn', description: 'find note by summary' },
  { command: '/fv', description: 'find vital (unimplemented)' }
];

declare interface Props {
  patient: Patient;
  setPatient: any;
  appointment: Appointment;
  setAppointment: any;
  practitioner: Practitioner;
}

export default function CommandBar({
  patient,
  setPatient,
  appointment,
  setAppointment,
  practitioner
}: Props) {
  // added these options for dialog boxes
  const [dialogOpen, dialogSetOpen] = useState(false);
  const [mostRecentCommand, setMostRecentCommand] = useState('');
  const [enterable, setEnterable] = useState(false);
  const [commandExtra, setCommandExtra] = useState('');

  const [updatePatient, patientErr] = usePutPatientMutation();
  const [prescribe, setPrescribe] = useState(false);
  const [history, setHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('allergies');
  const [updateAppointment, appointmentErr] = usePutAppointmentMutation();

  const toggleDialogOpen = () => {
    dialogSetOpen(!dialogOpen);
  };

  const handlePrescriptionSubmit = (med, dose, freq, reason) => {
    if (med == '' || dose == '' || freq == '' || reason == '') {
      setCommandExtra('Error: empty field');
      return;
    }

    const newPrescriptions = patient.prescriptions;
    newPrescriptions.push({
      medication: med,
      dosage: dose,
      frequency: freq,
      reason: reason,
      start: '2024-03-05',
      end: '2024-12-12'
    });

    // update stateful and db patient
    updatePatient({
      _id: patient._id,
      delta: { prescriptions: newPrescriptions }
    });
    if (patientErr.isError) {
      setCommandExtra(
        'Error updating patient prescriptions:' + JSON.stringify(patientErr)
      );
      return;
    }
    // update state if DB update success
    setPatient({ ...patient, prescriptions: newPrescriptions });
    setCommandExtra('Prescription saved');
  };

  // handles command input
  const getCommandExtra = (command) => {
    setEnterable(false);
    // startVisit
    const reStartVisit = /\/startVisit\s*/i;
    if (reStartVisit.test(command)) {
      switch (appointment.status) {
        case 'in-progress':
          return 'Error: visit already started';
        case 'cancelled':
          return 'Error: this appointment was cancelled';
      }

      // start visit in db and state
      setAppointment({ ...appointment, status: 'in-progress' });
      updateAppointment({
        _id: appointment._id,
        delta: { status: 'in-progress' }
      });

      return `Started visit with ${patient.name}`;
    }
    // endVisit
    const reEndVisit = /\/endVisit\s*/i;
    if (reEndVisit.test(command)) {
      if (appointment.status !== 'in-progress') {
        return 'Error: ending visit that was never started';
      }
      setAppointment({ ...appointment, status: 'complete' });
      updateAppointment({
        _id: appointment._id,
        delta: { status: 'complete' }
      });

      return `Ended visit with ${patient.name}`;
    }
    // measurement (m)
    const reMeasurement = /\/m/i;
    if (reMeasurement.test(command)) {
      // non-enterable
      const reNon = /\/m [^\s]+/i;
      if (reNon.test(command)) {
        const reMeasurement2 =
          /\/m\s+(Height|Weight|Blood Pressure|Heart Rate|Temperature|Blood O2)\s+\|\s+(\S.*\S)/i;
        if (reMeasurement2.test(command)) {
          const matches = reMeasurement2.exec(command);
          const key = matches[1].trim().toLowerCase();
          const value = Number(matches[2].trim());
          const newMeasurements = appointment.measurements;
          newMeasurements.find((measurement) => {
            if (measurement.type === key) {
              measurement.value = value;
              return true;
            }
            return false;
          });

          setAppointment({ ...appointment, measurements: newMeasurements });
          updateAppointment({
            _id: appointment._id,
            delta: { measurements: appointment.measurements }
          });
          return `Measurement saved: ${key}: ${value}. Note that At a Glance pulls from the previous appointment so will not update (developmental oopsies)`;
        } else {
          return 'Error: command bar measurements must be EXACTLY of format: "/m [type] | value" where type is one of the metrics shown in At a Glance (regex is hard ok). Note that we do not enforce values based on types';
        }
      }
      // enterable
      setEnterable(true);
      return '';
    }
    const reNote = /\/n/i;
    if (reNote.test(command)) {
      // go here if /n entered without following characters
      // non-enterable
      const reNon = /\/n [^\s]+/i;
      if (reNon.test(command)) {
        // handle note entered in command bar here
        // note (n)
        const reNote2 = /\/n (\S.*\S) \| (\S.*\S)/i; //enforces below pattern
        if (reNote2.test(command)) {
          // update state and DB
          const barNote = reNote2.exec(command)[0].split('|');
          const content = barNote[0].trim().substring(3); //removes the "/n ". hacky, but good enough;
          const summary = barNote[1].trim();
          const newNotes = patient.notes;
          newNotes.push({
            author: practitioner.name,
            date: new Date().toLocaleDateString(),
            content: content,
            summary: summary
          });
          updatePatient({ _id: patient._id, delta: { notes: newNotes } });
          if (patientErr.isError) {
            return (
              'Error updating patient notes: ' + JSON.stringify(patientErr)
            );
          }
          setPatient({ ...patient, notes: newNotes });
          return 'Note saved';
        } else {
          return 'Error: command bar notes must be EXACTLY of format: "/n [note] | [summary]" (regex is hard ok)';
        }
      }
      // note enterable
      setEnterable(true);
      return '';
    }

    // prescribe
    const rePrescribe = /\/p/i;
    if (rePrescribe.test(command)) {
      setPrescribe(true);
      return '';
    }
    // medical history
    const reHistory = /\/h/i;
    if (reHistory.test(command)) {
      setHistory(true);
      return '';
    }

    // find note (fn)
    const reFindNote = /\/fn(.*)/i;
    if (reFindNote.test(command)) {
      const reValidQuery = /\/fn\s+(\S.*)/i;
      if (reValidQuery.test(command)) {
        const matches = reFindNote.exec(command)[1].trim();
        const res = patient.notes.find((note) => {
          return note.summary.includes(matches);
        });
        if (res) {
          return `Note taken on ${res.date} by ${res.author} has summary: ${res.summary} and content: ${res.content}`;
        } else {
          return 'Note not found';
        }
      }
      return 'Error: "/fn" command must include a string to search for in note summaries, such as "/fn mental health"';
    }
    // find vital (fv)
    const reFindVital = /\/fv(.*)/i;
    if (reFindVital.test(command)) {
      return 'Unimplemented, but the idea is that you can search a vital and it will return the most recent measurement of that vital';
    }
    // default case
    return 'Error: Invalid command';
  };

  const onBarEnter = () => {
    setEnterable(false);
    setPrescribe(false);
    setHistory(false);
    // gets command
    const command = (
      document.getElementById('layoutTextField') as HTMLInputElement
    ).value;
    setMostRecentCommand(command);

    const extra = getCommandExtra(command);
    setCommandExtra(extra);

    // clears command bar
    (document.getElementById('layoutTextField') as HTMLInputElement).value = '';
    // open dialog box
    toggleDialogOpen();
  };

  const handleEnterableDialogEnter = (command, textInput) => {
    let str = '';
    if (command === '/n') {
      const reNote = /(\S.*\S) \| (\S.*\S)/i; //enforces below pattern
      if (reNote.test(textInput)) {
        // update state and DB
        const note = reNote.exec(textInput)[0].split('|');
        const content = note[0].trim();
        const summary = note[1].trim();
        const newNotes = patient.notes;
        newNotes.push({
          author: practitioner.name,
          date: new Date().toLocaleDateString(),
          content: content,
          summary: summary
        });
        updatePatient({ _id: patient._id, delta: { notes: newNotes } });
        if (patientErr.isError) {
          setCommandExtra(
            'Error updating patient notes: ' + JSON.stringify(patientErr)
          );
          return;
        }
        setPatient({ ...patient, notes: newNotes });

        str = 'Note saved';
      } else {
        str =
          'Error: notes must be EXACTLY of format: "[note] | [summary]" (regex is hard ok)';
      }
    } else if (command === '/m') {
      const reMeasurement2 =
        /(Height|Weight|Blood Pressure|Heart Rate|Temperature|Blood O2)\s+\|\s+(\S.*\S)/i;
      if (reMeasurement2.test(textInput)) {
        const matches = reMeasurement2.exec(textInput);
        const key = matches[1].trim().toLowerCase();
        const value = Number(matches[2].trim());
        const newMeasurements = appointment.measurements;
        newMeasurements.find((measurement) => {
          if (measurement.type === key) {
            measurement.value = value;
            return true;
          }
          return false;
        });

        setAppointment({ ...appointment, measurements: newMeasurements });
        updateAppointment({
          _id: appointment._id,
          delta: { measurements: appointment.measurements }
        });
        str = `Measurement saved: ${key}: ${value}. Note that At a Glance pulls from the previous appointment so will not update (developmental oopsies)`;
      } else {
        str =
          'Error: measurements must be EXACTLY of format: "[type] | value" where type is one of the metrics shown in At a Glance (regex is hard ok). Note that we do not enforce values based on types';
      }
    }
    setCommandExtra(str);
  };

  const handleHistorySubmit = (type, f1, f2, f3) => {
    if (type === '' || f1 === '' || f2 === '' || f3 === '') {
      setCommandExtra('Error: empty field');
      return;
    }

    if (type === 'allergies') {
      const newAllergies = patient.allergies;
      newAllergies.push({
        allergen: f1,
        severity: f2,
        reaction: f3
      });

      updatePatient({
        _id: patient._id,
        delta: { allergies: newAllergies }
      });
      if (patientErr.isError) {
        setCommandExtra(
          'Error updating patient allergies: ' + JSON.stringify(patientErr)
        );
        return;
      }
      setPatient({ ...patient, allergies: newAllergies });
      setCommandExtra('Allergy saved');
    } else if (type === 'surgeries') {
      // validate date- if constructed date is NaN, then it is invalid
      const realDate = new Date(f3);
      if (realDate.getTime() !== realDate.getTime()) {
        setCommandExtra('Error: invalid date');
        return;
      }

      const formattedDate = realDate.toLocaleDateString('en-US');
      const newSurgeries = patient.medicalHistory;
      newSurgeries.push({
        operation: f1,
        reason: f2,
        date: formattedDate
      });

      updatePatient({
        _id: patient._id,
        delta: { medicalHistory: newSurgeries }
      });
      if (patientErr.isError) {
        setCommandExtra(
          'Error updating patient surgeries: ' + JSON.stringify(patientErr)
        );
        return;
      }
      setPatient({ ...patient, medicalHistory: newSurgeries });
      setCommandExtra('Surgery saved');
    } else if (type === 'family') {
      const newFamily = patient.familyHistory;
      newFamily.push({
        condition: f1,
        relative: f2
      });

      updatePatient({
        _id: patient._id,
        delta: { familyHistory: patient.familyHistory }
      });
      if (patientErr.isError) {
        setCommandExtra(
          'Error updating family history: ' + JSON.stringify(patientErr)
        );
        return;
      }
      setPatient({ ...patient, familyHistory: newFamily });
      setCommandExtra('Family history saved');
    } else {
      setCommandExtra('Something went wrong');
    }
  };

  const renderHistoryBoxes = () => {
    if (historyTab === 'allergies') {
      return (
        <Box
          sx={{
            display: 'flex',
            marginTop: '10px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TextField id={'tfAllergen'} label={'Allergen'} />
          <TextField id={'tfSeverity'} label={'Severity'} />
          <TextField id={'tfReaction'} label={'Reaction'} />
          <Button
            onClick={() => {
              handleHistorySubmit(
                historyTab,
                (document.getElementById('tfAllergen') as HTMLInputElement)
                  .value,
                (document.getElementById('tfSeverity') as HTMLInputElement)
                  .value,
                (document.getElementById('tfReaction') as HTMLInputElement)
                  .value
              );
            }}>
            Enter
          </Button>
        </Box>
      );
    } else if (historyTab === 'surgeries') {
      return (
        <Box
          sx={{
            display: 'flex',
            marginTop: '10px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TextField id={'tfOperation'} label={'Operation'} />
          <TextField id={'tfReason'} label={'Reason'} />
          <TextField id={'tfDate'} label={'Date YYYY/MM/DD'} />
          <Button
            onClick={() => {
              handleHistorySubmit(
                historyTab,
                (document.getElementById('tfOperation') as HTMLInputElement)
                  .value,
                (document.getElementById('tfReason') as HTMLInputElement).value,
                (document.getElementById('tfDate') as HTMLInputElement).value
              );
            }}>
            Enter
          </Button>
        </Box>
      );
    } else if (historyTab === 'family') {
      return (
        <Box
          sx={{
            display: 'flex',
            marginTop: '10px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TextField id={'tfCondition'} label={'Condition'} />
          <TextField id={'tfRelative'} label={'Relative'} />
          <Button
            onClick={() => {
              handleHistorySubmit(
                historyTab,
                (document.getElementById('tfCondition') as HTMLInputElement)
                  .value,
                (document.getElementById('tfRelative') as HTMLInputElement)
                  .value,
                1
              );
            }}>
            Enter
          </Button>
        </Box>
      );
    } else {
      return <h2>Something went wrong</h2>;
    }
  };

  const handleTabChange = (event) => {
    setHistoryTab(event.target.value);
  };

  const renderDialog = () => {
    if (history) {
      return (
        <Dialog onClose={toggleDialogOpen} open={dialogOpen}>
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4>Enter history</h4>
            <IconButton size={'small'} onClick={toggleDialogOpen}>
              <Close />
            </IconButton>
          </DialogTitle>
          <select value={historyTab} onChange={handleTabChange}>
            <option value={'allergies'}>Allergies</option>
            <option value={'surgeries'}>Surgeries</option>
            <option value={'family'}>Family</option>
          </select>
          {renderHistoryBoxes()}
          <h3>{commandExtra}</h3>
        </Dialog>
      );
    }
    if (prescribe) {
      return (
        <Dialog onClose={toggleDialogOpen} open={dialogOpen}>
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4>Enter a prescription</h4>
            <IconButton size={'small'} onClick={toggleDialogOpen}>
              <Close />
            </IconButton>
          </DialogTitle>
          <TextField id={'tfMedication'} label={'Medication'} />
          <TextField id={'tfDosage'} label={'Dosage'} />
          <TextField id={'tfFrequency'} label={'Frequency'} />
          <TextField id={'tfReason'} label={'Reason'} />
          <TextField id={'tfPhone'} label={'Pharmacy phone'} />
          <Button
            onClick={() => {
              handlePrescriptionSubmit(
                (document.getElementById('tfMedication') as HTMLInputElement)
                  .value,
                (document.getElementById('tfDosage') as HTMLInputElement).value,
                (document.getElementById('tfFrequency') as HTMLInputElement)
                  .value,
                (document.getElementById('tfReason') as HTMLInputElement).value
              );
            }}>
            Enter
          </Button>
          <h3>{commandExtra}</h3>
        </Dialog>
      );
    }
    if (enterable) {
      if (mostRecentCommand === '/n') {
        return (
          <Dialog
            PaperProps={{ style: { marginTop: '-40vh' } }}
            onClose={toggleDialogOpen}
            open={dialogOpen}>
            <DialogTitle
              sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <StyledDialogueText>
                Enter note. Format must be: [note] | [summary]
              </StyledDialogueText>
              <IconButton size={'small'} onClick={toggleDialogOpen}>
                <Close />
              </IconButton>
            </DialogTitle>
            <TextField
              id={'enterableTextFieldNote'}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleEnterableDialogEnter(
                    mostRecentCommand,
                    (
                      document.getElementById(
                        'enterableTextFieldNote'
                      ) as HTMLInputElement
                    ).value
                  );
                }
              }}
            />
            <Button
              onClick={() => {
                handleEnterableDialogEnter(
                  mostRecentCommand,
                  (
                    document.getElementById(
                      'enterableTextFieldNote'
                    ) as HTMLInputElement
                  ).value
                );
              }}>
              Enter
            </Button>
            <StyledDialogueText>{commandExtra}</StyledDialogueText>
          </Dialog>
        );
      } else if (mostRecentCommand === '/m') {
        return (
          <Dialog
            onClose={toggleDialogOpen}
            open={dialogOpen}
            PaperProps={{ style: { marginTop: '-40vh' } }}>
            <DialogTitle
              sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <StyledDialogueText>Enter Measurement</StyledDialogueText>
              <IconButton size={'small'} onClick={toggleDialogOpen}>
                <Close />
              </IconButton>
            </DialogTitle>
            <TextField
              id={'enterableTextFieldMeasurement'}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleEnterableDialogEnter(
                    mostRecentCommand,
                    (
                      document.getElementById(
                        'enterableTextFieldMeasurement'
                      ) as HTMLInputElement
                    ).value
                  );
                }
              }}
            />
            <Button
              onClick={() => {
                handleEnterableDialogEnter(
                  mostRecentCommand,
                  (
                    document.getElementById(
                      'enterableTextFieldMeasurement'
                    ) as HTMLInputElement
                  ).value
                );
              }}>
              Enter
            </Button>
            <StyledDialogueText>{commandExtra}</StyledDialogueText>
          </Dialog>
        );
      }
    } else {
      return (
        <Dialog
          PaperProps={{ style: { marginTop: '-40vh' } }}
          onClose={toggleDialogOpen}
          open={dialogOpen}>
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <StyledDialogueText>{mostRecentCommand}</StyledDialogueText>
            <IconButton size={'small'} onClick={toggleDialogOpen}>
              <Close />
            </IconButton>
          </DialogTitle>
          <StyledDialogueText>{commandExtra}</StyledDialogueText>
        </Dialog>
      );
    }
  };

  // Autocomplete component below adapted from https://mui.com/material-ui/react-autocomplete/
  return (
    <Box sx={{ display: 'flex' }}>
      <Autocomplete
        id={'layoutTextField'}
        options={barOptions}
        getOptionLabel={(option) => option['command']}
        renderOption={(props, option) => (
          <Box component={'li'} {...props}>
            {option['command']} - {option['description']}
          </Box>
        )}
        renderInput={(params) => (
          <TextField placeholder="Search within patient" {...params} />
        )}
        sx={{ width: 500 }}
        size={'small'}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onBarEnter();
          }
        }}
      />
      <Button
        onClick={() => {
          onBarEnter();
        }}
        style={{ color: '#47619A' }}>
        Enter
      </Button>
      {renderDialog()}
    </Box>
  );
}

const StyledDialogueText = styled.h4`
  padding: 10px;
  margin: 10px;
  text-align: center;
`;
