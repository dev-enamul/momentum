import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import BottomNavbar from './components/layout/BottomNavbar';
import ProjectDetails from './components/ProjectDetails';
import ChangePassword from './components/ChangePassword';
import { Box } from '@mui/material';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const [isWorking, setIsWorking] = useState(false); // New state for work status

  useEffect(() => {
    window.electronAPI.onToggleWork((event, status) => {
      setIsWorking(status);
    });

    window.electronAPI.onEndWorkDueToIdle(() => {
      setIsWorking(false);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.setLoginState(loggedIn);
    const token = localStorage.getItem('token');
    if (token) {
      window.electronAPI.sendToken(token);
    }
  }, [loggedIn]);

  useEffect(() => {
    const handleNavigation = (event, path) => {
      navigate(path);
    };
    window.electronAPI.onNavigate(handleNavigation);

    return () => {
      // cleanup
    };
  }, [navigate]);

  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {loggedIn && <BottomNavbar setLoggedIn={setLoggedIn} />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" /> : <Login setLoggedIn={setLoggedIn} key={loggedIn} />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard isWorking={isWorking} setIsWorking={setIsWorking} /> : <Navigate to="/login" />} />
          <Route path="/projects" element={loggedIn ? <Projects key="projects" /> : <Navigate to="/login" />} />
          <Route path="/project/:id" element={loggedIn ? <ProjectDetails /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={loggedIn ? <Tasks /> : <Navigate to="/login" />} />
          <Route path="/add-task" element={loggedIn ? <AddTask /> : <Navigate to="/login" />} />
          <Route path="/change-password" element={loggedIn ? <ChangePassword /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={loggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </Box>
    </Box>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper;