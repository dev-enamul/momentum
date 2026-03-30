import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import apiFetch from '../utils/api';
import icon from '../../icon.png';

const Login = ({ setLoggedIn }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch('login', {
        method: 'POST',
        body: { phone, password },
      });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setLoggedIn(true);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Left Panel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '48%',
          background: 'linear-gradient(160deg, #a834a4 0%, #6b1fa8 50%, #4a148c 100%)',
          position: 'relative',
          overflow: 'hidden',
          pb: 6,
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <Box sx={{ position: 'absolute', top: 80, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', bottom: 120, left: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Floating cards illustration */}
        <Box sx={{ position: 'absolute', top: '10%', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '62%' }}>
          {/* Main card */}
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 4,
            p: 2.5,
            width: 210,
            zIndex: 2,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box component="img" src={icon} sx={{ width: 32, height: 32 }} />
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Momentum</Typography>
            </Box>
            {[
              { label: 'Active Tasks', value: '12' },
              { label: 'Hours Today', value: '6.5h' },
              { label: 'Projects', value: '4' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{item.label}</Typography>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Small floating card top-right */}
          <Box sx={{
            position: 'absolute', top: '5%', right: '12%',
            bgcolor: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 3, p: 1.5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>✓ Task Complete</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>2 mins ago</Typography>
          </Box>

          {/* Small floating card bottom-left */}
          <Box sx={{
            position: 'absolute', bottom: '8%', left: '10%',
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 3, p: 1.5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>📊 Daily Report</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>Ready to view</Typography>
          </Box>
        </Box>

        {/* Bottom text */}
        <Box sx={{ position: 'relative', textAlign: 'center', zIndex: 1, px: 4 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            Track Work. Stay Focused.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Manage your team's productivity with real-time tracking and insights.
          </Typography>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#fff',
          px: { xs: 3, sm: 6, md: 7 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 360 }}>

          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box component="img" src={icon} alt="Momentum" sx={{ width: 48, height: 48 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 0.5 }}>
            Hello Again!
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#999', mb: 3.5, fontSize: '0.82rem', lineHeight: 1.6 }}>
            Welcome back, please enter your details to sign in.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
              autoFocus
              autoComplete="phone"
              sx={fieldStyle}
            />

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: '#bbb', '&:hover': { color: '#666' } }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyle}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2.5, mb: 1.5,
                py: 1.1,
                borderRadius: 2,
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: '#92288E',
                boxShadow: '0 4px 18px rgba(146,40,142,0.35)',
                '&:hover': {
                  bgcolor: '#7a2078',
                  boxShadow: '0 6px 22px rgba(146,40,142,0.5)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
                '&.Mui-disabled': { bgcolor: '#ddd', color: '#aaa', boxShadow: 'none' },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.8)' }} /> : 'Login'}
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: '#ccc', display: 'block', textAlign: 'center', mt: 3 }}>
            © {new Date().getFullYear()} Zoom IT · Momentum
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#fafafa',
    fontSize: '0.88rem',
    '& input': { py: '10px' },
    '& fieldset': { borderColor: '#e8e8e8' },
    '&:hover fieldset': { borderColor: '#92288E' },
    '&.Mui-focused fieldset': { borderColor: '#92288E', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.88rem', top: '-4px' },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': { top: '0px' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#92288E' },
};

export default Login;
