import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import apiFetch from '../utils/api';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch('change-password', {
        method: 'POST',
        body: { old_password: oldPassword, password: newPassword, confirm_password: confirmPassword },
      });
      setSuccess(result.message || 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Box sx={{ maxWidth: 400, width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1a1a1a' }}>
        Change Password
      </Typography>
      <Typography variant="body2" sx={{ color: '#999', mb: 3, fontSize: '0.82rem' }}>
        Update your account password below.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleChangePassword} noValidate>
        <TextField
          fullWidth
          label="Old Password"
          type={showOld ? 'text' : 'password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOld(v => !v)} edge="end" size="small"
                  sx={{ color: '#bbb', '&:hover': { color: '#666' } }}>
                  {showOld ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={fieldStyle}
        />
        <TextField
          fullWidth
          label="New Password"
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNew(v => !v)} edge="end" size="small"
                  sx={{ color: '#bbb', '&:hover': { color: '#666' } }}>
                  {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={fieldStyle}
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(v => !v)} edge="end" size="small"
                  sx={{ color: '#bbb', '&:hover': { color: '#666' } }}>
                  {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={fieldStyle}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2.5, py: 1.1,
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
          {loading ? <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.8)' }} /> : 'Change Password'}
        </Button>
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

export default ChangePassword;
