import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotesPage from './components/NotesPage';

type AppState = 'login' | 'register' | 'notes';

interface User {
  name: string;
  email: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (credentials: { email: string; password: string }) => {
    // In a real app, you'd validate against your backend
    // For demo purposes, we'll simulate a successful login
    setUser({
      name: credentials.email.split('@')[0],
      email: credentials.email
    });
    setCurrentPage('notes');
  };

  const handleRegister = (userData: { name: string; email: string; password: string }) => {
    // In a real app, you'd send this to your backend
    // For demo purposes, we'll simulate a successful registration
    setUser({
      name: userData.name,
      email: userData.email
    });
    setCurrentPage('notes');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const switchToRegister = () => setCurrentPage('register');
  const switchToLogin = () => setCurrentPage('login');

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    );
  }

  if (currentPage === 'notes' && user) {
    return (
      <NotesPage
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

export default App;