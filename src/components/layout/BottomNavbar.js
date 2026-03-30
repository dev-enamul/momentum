import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';

const BottomNavbar = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name || '';
  const userPhoto = user?.photo || user?.avatar || user?.profile_photo || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
      window.electronAPI?.focusWindow();
    }
    handleMenuClose();
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    handleMenuClose();
  };

  return (
    <Box sx={{ width: 60, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Tooltip title="Dashboard" placement="right">
          <IconButton onClick={() => navigate('/dashboard')}>
            <DashboardIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Projects" placement="right">
          <IconButton onClick={() => navigate('/projects')}>
            <AccountTreeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Tasks" placement="right">
          <IconButton onClick={() => navigate('/tasks')}>
            <ListAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Task" placement="right">
          <IconButton onClick={() => navigate('/add-task')}>
            <PlaylistAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Tooltip title={userName || 'Profile'} placement="right">
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar
              alt={userName}
              src={userPhoto || undefined}
              sx={{
                width: 36,
                height: 36,
                bgcolor: userPhoto ? 'transparent' : '#92288E',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '2px solid rgba(146,40,142,0.3)',
                boxShadow: '0 2px 8px rgba(146,40,142,0.25)',
              }}
            >
              {!userPhoto && (
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {initials || '?'}
                </Typography>
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
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
    </Box>
  );
};

export default BottomNavbar;