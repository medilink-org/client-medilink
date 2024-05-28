import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axiosInstance from '../../axiosInstance';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4D5F96'
    },
    secondary: {
      main: '#8098A0'
    },
    background: {
      default: '#D9D9D9'
    }
  }
});

const initialPatientState = {
  name: '',
  initials: '',
  age: '',
  birthDate: '',
  gender: '',
  notes: [],
  prescriptions: [],
  allergies: [],
  activeTreatments: [],
  medicalHistory: [],
  familyHistory: []
};

export default function CheckInPatients() {
  const [patient, setPatient] = useState(initialPatientState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/patient', patient);
      if (response.status === 200) {
        alert('Patient checked in successfully!');
        setPatient(initialPatientState);
      } else {
        alert('Failed to check in patient.');
      }
    } catch (error) {
      console.error('Error checking in patient:', error);
      alert('Failed to check in patient.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Check-In Patient
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Patient Name"
                  name="name"
                  value={patient.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="initials"
                  label="Initials"
                  name="initials"
                  value={patient.initials}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  value={patient.age}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="birthDate"
                  label="Birth Date"
                  name="birthDate"
                  value={patient.birthDate}
                  onChange={handleChange}
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="gender"
                  label="Gender"
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  variant="outlined"
                  select>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}>
              Check In
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
