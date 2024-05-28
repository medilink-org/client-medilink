import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckInPatients from './CheckInPatients';

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

export default function ReceptionistHome() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewPatients = () => {
    window.location.href = '/view-patients';
  };

  const handleAssignPatient = () => {
    window.location.href = '/assign-patient';
  };

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
            Receptionist Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">Check In Patients</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleClickOpen}>
                  Check In
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">Assign to Doctor</Typography>
                <Button
                  onClick={handleAssignPatient}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}>
                  Assign
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="h6">View Patient List</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleViewPatients}>
                  View
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Check-In Patient
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <CheckInPatients />
          </DialogContent>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
