import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Kullanıcı adı gerekli'),
    email: Yup.string().email('Geçersiz email').required('Email gerekli'),
    password: Yup.string().min(6, 'En az 6 karakter olmalı').required('Şifre gerekli'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmeli')
      .required('Şifre tekrarı gerekli'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      await axios.post('/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında hata oluştu');
      setSubmitting(false);
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
      <Typography variant="h5" mb={3} align="center">
        Kayıt Ol
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Formik {...{ initialValues, validationSchema, onSubmit }}>
        {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
          <Form>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Şifre Tekrarı"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              margin="normal"
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </Button>
          </Form>
        )}
      </Formik>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Zaten hesabın var mı?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
            Giriş Yap
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
