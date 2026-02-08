import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginPage from './pages/LoginPage';
import EditorPage from './pages/EditorPage';
import './index.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><EditorPage /></RequireAuth>} />
        </Routes>
      </Router>
    </Provider>
  );
}

// Simple wrapper to protect routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default App;
