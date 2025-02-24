// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#0d47a1' },
    background: { default: '#e3f2fd', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    // Additional typography settings if needed
  },
  shape: {
    borderRadius: 8, // consistent rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 300,
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);