import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#92288E',
    },
    secondary: {
      main: '#383795',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
);

window.electronAPI.onToggleWork((event, status) => {
  console.log('Toggling work status:', status);
});