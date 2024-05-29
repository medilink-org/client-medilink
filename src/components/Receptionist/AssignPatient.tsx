import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useAssignPatientToPractitionerMutation } from '../../services/api';

const AssignPatients: React.FC = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignPatientToPractitioner] =
    useAssignPatientToPractitionerMutation();

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('/api/patient/all');
      setPatients(response.data);
    };

    const fetchDoctors = async () => {
      const response = await axios.get('/api/practitioner/available');
      setDoctors(response.data);
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const getDoctorAvailability = (doctor, selectedDate) => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    const availability = doctor.availability.find(
      (avail) => avail.day.toLowerCase() === dayOfWeek
    );
    return availability ? availability.times : [];
  };

  const handleAssign = async () => {
    if (selectedPatient && selectedDoctor && selectedTime && date) {
      const timeParts = selectedTime.split(':');
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
      ).toLocaleString('en-US', { hour12: false });

      const appointment = {
        date: combinedDateTime,
        status: 'scheduled'
      };

      try {
        const response = await axios.post(
          `/api/appointment/toPatient/${selectedPatient}/toPractitioner/${selectedDoctor}`,
          appointment
        );
        console.log('Appointment response:', response.data);

        // Add patient to practitioner
        const p2pResponse = await assignPatientToPractitioner({
          patientId: selectedPatient,
          practitionerId: selectedDoctor
        }).unwrap();

        console.log('Assign patient response:', p2pResponse);

        setIsModalOpen(false);
        alert('Appointment assigned successfully!');
      } catch (error) {
        console.error(
          'Error assigning appointment:',
          error.response ? error.response.data : error
        );
        alert('Failed to assign appointment. Please try again.');
      }
    } else {
      alert('Please select patient, doctor, time, and date.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" component="h2" gutterBottom>
        Assign Patients to Doctors
      </Typography>

      <div className="flex space-x-4">
        <Paper className="w-1/2 p-4">
          <Typography variant="h6" component="h3">
            Patients
          </Typography>
          <Typography variant="body2" gutterBottom>
            List of patients sorted by latest updated
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {new Date(patient.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setSelectedPatient(patient._id);
                            setIsModalOpen(true);
                          }}>
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper className="w-1/2 p-4">
          <Typography variant="h6" component="h3">
            Doctors Availability
          </Typography>
          <Typography variant="body2" gutterBottom>
            Select a date to see available doctors
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </LocalizationProvider>
          <div className="mt-4">
            {doctors.map((doctor) => {
              const availableTimes = getDoctorAvailability(doctor, date);
              return (
                availableTimes.length > 0 && (
                  <div key={doctor._id} className="mb-4">
                    <Typography variant="subtitle1">{doctor.name}</Typography>
                    <Select
                      value={selectedDoctor === doctor._id ? selectedTime : ''}
                      onChange={(e) => {
                        setSelectedDoctor(doctor._id);
                        setSelectedTime(e.target.value);
                      }}
                      displayEmpty>
                      <MenuItem value="" disabled>
                        Select a time
                      </MenuItem>
                      {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )
              );
            })}
          </div>
        </Paper>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Assign Patient</DialogTitle>
        <DialogContent>
          <TextField
            label="Patient"
            value={patients.find((p) => p._id === selectedPatient)?.name || ''}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Doctor"
            value={doctors.find((d) => d._id === selectedDoctor)?.name || ''}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label="Time"
            value={selectedTime}
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssign} color="primary" variant="contained">
            Assign
          </Button>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignPatients;
