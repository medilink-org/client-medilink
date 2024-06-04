import {
  createTheme,
  CssBaseline,
  CircularProgress,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { useGetPractitionerByUsernameQuery } from '../../services/api';
import HomePage from '../Layout/HomePage';
import { useStore } from '../../store';

const defaultTheme = createTheme();

export default function PractitionerHome() {
  const { username } = useStore();

  const { data, error, isLoading, isFetching } =
    useGetPractitionerByUsernameQuery(username);

  console.log('🚀 ~ PractitionerHome ~ data:', data);

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

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              padding: 2,
              paddingLeft: 3,
              marginBottom: 0,
              color: '#3f51b5',
              fontWeight: 'bold'
            }}>
            Welcome, {data.name}
          </Typography>
        </Box>
        <HomePage practitioner={data} />
      </ThemeProvider>
    </>
  );
}
