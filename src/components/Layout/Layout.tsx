import { createTheme, CssBaseline, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import TopBar from '../PatientView/TopBar';
import { useLocation } from 'react-router-dom';
import { useGetPractitionerByUsernameQuery } from '../../services/api';
import HomePage from './HomePage';

const defaultTheme = createTheme();

export default function Layout() {
  const location = useLocation();
  const { data, error, isLoading, isFetching } =
    useGetPractitionerByUsernameQuery(location.state.practitioner.username);

  console.log(data);
  const topBarProps = {
    logo: '/img/medilink_logo.webp',
    left: null,
    children: null,
    right: null,
    style: null,
    practitioner: data
  };

  if (error) {
    return (
      <div>
        <h1>Error Loading Page: </h1>
        <>{error}</>
      </div>
    );
  }
  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
        <CircularProgress />
      </Box>
    );
  }
  // attribution: https://github.com/mui/material-ui/blob/v5.14.16/docs/data/material/getting-started/templates/dashboard/Dashboard.js
  // the Material UI "Dashboard" example was used below for the header
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <TopBar {...topBarProps} />
        </Box>
        <HomePage practitioner={data} />
      </ThemeProvider>
    </>
  );
}
