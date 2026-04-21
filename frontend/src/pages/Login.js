import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Kullanıcı adı gerekli'),
    password: Yup.string().required('Şifre gerekli')
  });

  const onSubmit = async (values) => {
    try {
      setError(null);
      const res = await axios.post('/login', values);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate('/dashboard'); // başarılı girişte dashboard'a yönlendir
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={3} align="center">Giriş Yap</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Formik {...{ initialValues, validationSchema, onSubmit }}>
        {({ handleChange, values }) => (
          <Form>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              value={values.username}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              margin="normal"
            />
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
              Giriş Yap
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Hesabın yok mu?{' '}
        <Link href="/register" underline="hover" sx={{ cursor: 'pointer' }}>
          Kayıt Ol
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
