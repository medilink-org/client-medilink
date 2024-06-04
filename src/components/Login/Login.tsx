import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../services/api';
import { useStore } from '../../store/index';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { updateUsername, updatePractitionerId } = useStore();

  // called when login button clicked
  const handleLoginAttempt = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    if (username === '' || password === '') {
      alert('Please enter a username and password');
      return;
    }

    try {
      const user = await login({ username, password }).unwrap();

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin-home');
      } else if (user.role === 'receptionist') {
        navigate('/receptionist-home', { state: { receptionist: user } });
      } else if (user.role === 'practitioner') {
        // Update the global state with the logged in practitioner's username
        updateUsername(user.username);
        updatePractitionerId(user._id);
        navigate('/practitioner-home', { state: { practitioner: user } });
      }
    } catch (error) {
      console.error(error);
      alert('Invalid login or login server error');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLoginAttempt}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              defaultValue="demo1"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              defaultValue="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              id="signInButton"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
