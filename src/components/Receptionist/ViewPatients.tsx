import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Toolbar,
  Tooltip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
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
      default: '#F7F7F7'
    }
  },
  typography: {
    h4: {
      fontWeight: 'bold',
      marginBottom: 2 // Assuming theme.spacing(2) was intended, simplified here
    },
    body1: {
      color: '#333'
    }
  }
});

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3)
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    fontWeight: 'bold'
  }
}));

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get('/patient/all')
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  const handleViewPatient = (id) => {
    navigate(`/patient-details/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Title variant="h4">Patient List</Title>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              overflow: 'hidden',
              padding: theme.spacing(3)
            }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="patient table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: 'black' }}>Name</TableCell>
                    <TableCell style={{ color: 'black' }}>Initials</TableCell>
                    <TableCell style={{ color: 'black' }}>Age</TableCell>
                    <TableCell style={{ color: 'black' }}>Birth Date</TableCell>
                    <TableCell style={{ color: 'black' }}>Gender</TableCell>
                    <TableCell style={{ color: 'black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((patient) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={patient._id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.initials}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
                          {new Date(patient.birthDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleViewPatient(patient._id)}>
                              View
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={patients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ViewPatients;
