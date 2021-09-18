import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.module.css';
import Home from './features/home/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
