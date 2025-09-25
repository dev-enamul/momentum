import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';

const Menu = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoggedIn(false);
      navigate('/login');
      window.electronAPI.focusWindow();
    }
  };

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between', background: 'transparent' }}>
        <Box>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/projects')}>Projects</Button>
          <Button color="inherit" onClick={() => navigate('/tasks')}>Tasks</Button>
          <Button color="inherit" onClick={() => navigate('/add-task')}>Add Task</Button>
          <Button color="inherit" onClick={() => navigate('/change-password')}>Change Password</Button>
        </Box>
        <Button variant="contained" color="error" size="small" startIcon={<Logout />} onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
