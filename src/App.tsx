import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { MoodProvider } from './contexts/MoodContext';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <MoodProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </MoodProvider>
    </ThemeProvider>
  );
}

export default App;