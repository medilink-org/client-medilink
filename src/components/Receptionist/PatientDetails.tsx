import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader
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

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/patient/id/${id}`)
      .then((response) => {
        setPatient(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patient details:', error);
      });
  }, [id]);

  if (!patient) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="lg">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Loading...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Patient Details
          </Typography>
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Name" secondary={patient.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Initials"
                      secondary={patient.initials}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Age" secondary={patient.age} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Birth Date"
                      secondary={new Date(
                        patient.birthDate
                      ).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Gender" secondary={patient.gender} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Medical Information
                </Typography>
                <List subheader={<ListSubheader>Details</ListSubheader>}>
                  <ListItem>
                    <ListItemText
                      primary="Allergies"
                      secondary={
                        patient.allergies.length > 0
                          ? patient.allergies
                              .map((allergy) => allergy.allergen)
                              .join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Prescriptions"
                      secondary={
                        patient.prescriptions.length > 0
                          ? patient.prescriptions
                              .map(
                                (prescription) =>
                                  `${prescription.medication} (${prescription.dosage})`
                              )
                              .join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Treatments"
                      secondary={
                        patient.activeTreatments.length > 0
                          ? patient.activeTreatments
                              .map((treatment) => treatment.treatment)
                              .join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Medical History"
                      secondary={
                        patient.medicalHistory.length > 0
                          ? patient.medicalHistory
                              .map(
                                (operation) =>
                                  `${operation.operation} (${operation.date})`
                              )
                              .join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Family History"
                      secondary={
                        patient.familyHistory.length > 0
                          ? patient.familyHistory
                              .map(
                                (condition) =>
                                  `${condition.condition} (${condition.relative})`
                              )
                              .join(', ')
                          : 'None'
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <List subheader={<ListSubheader>Patient Notes</ListSubheader>}>
              {patient.notes.map((note, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${note.author} - ${new Date(note.date).toLocaleDateString()}`}
                    secondary={note.content}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
