import * as React from 'react';
//import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import login from './Login'
import logo_3 from './components/Logo_3.png'







function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
       Live Marketing
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const defaultTheme = createTheme();

//export default function SignUp() {
  //const handleSubmit = (event) => {
    //event.preventDefault();
    //const data = new FormData(event.currentTarget);
    //console.log({
      //firstName: data.get('firstName'),
      //lastName: data.get('lastName'),
      //email: data.get('email'),
      //password: data.get('password'),

    //});
  //};

  export default function Signup() {
    const handleSubmit = (event) => {
      event.preventDefault();
      fetch('https://mli-data-api-dev.azurewebsites.net/api/Login',
           {
              method: "POST",
              headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
  
           }
        )
        .then(response =>
           response.json()
  
        )
        .then(responseJson => {
            const returnObj = responseJson;
            console.log(returnObj);
            sessionStorage.setItem('resData', JSON.stringify(returnObj));
            this.props.history.push('./')
  
        });
    }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <div>
    <img src={logo_3} width={800} height={200} alt="Logo_3" />
    </div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" Validate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
             
              </Grid>
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to='./Login' href="/"  variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}