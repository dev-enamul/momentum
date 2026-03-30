import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UpdateModal from './components/UpdateModal';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import ProjectDetails from './components/ProjectDetails';
import ChangePassword from './components/ChangePassword';
import PageLayout from './components/layout/PageLayout';
import { Box } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  console.log('[App] loggedIn:', loggedIn, '| token in storage:', !!localStorage.getItem('token'));
  const [isWorking, setIsWorking] = useState(false); // New state for work status

  useEffect(() => {
    window.electronAPI?.onToggleWork((event, status) => {
      setIsWorking(status);
    });

    window.electronAPI?.onEndWorkDueToIdle(() => {
      setIsWorking(false);
    });
  }, []);

  useEffect(() => {
    console.log('[App] loggedIn changed:', loggedIn);
    window.electronAPI?.setLoginState(loggedIn);
    const token = localStorage.getItem('token');
    if (token) {
      window.electronAPI?.sendToken(token);
    }
  }, [loggedIn]);

  useEffect(() => {
    const handleNavigation = (event, path) => {
      navigate(path);
    };
    window.electronAPI?.onNavigate(handleNavigation);

    return () => {
      // cleanup
    };
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <UpdateModal />
      <PageLayout setLoggedIn={setLoggedIn} loggedIn={loggedIn}>
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
      </PageLayout>
    </ThemeProvider>
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