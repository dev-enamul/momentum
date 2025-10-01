
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';
import './BottomNavbar.css';
import icon from '../../../icon.png';

const BottomNavbar = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoggedIn(false);
      navigate('/login');
      window.electronAPI.focusWindow();
    }
    handleMenuClose();
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" className="bottom-navbar" sx={{ top: 'auto', bottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Box className="menu-container">
          <Button className="menu-link" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button className="menu-link" startIcon={<AccountTreeIcon />} onClick={() => navigate('/projects')}>
            Projects
          </Button>
          <Button className="menu-link" startIcon={<ListAltIcon />} onClick={() => navigate('/tasks')}>
            Tasks
          </Button>
          <Button className="menu-link" startIcon={<PlaylistAddIcon />} onClick={() => navigate('/add-task')}>
            Add Task
          </Button>
        </Box>

        <Box className="user-profile">
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt="User"
              src={icon} 
              className="profile-avatar"
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="profile-menu"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <PasswordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
    </AppBar>
  );
};

export default BottomNavbar;
