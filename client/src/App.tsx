import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotesPage from './components/NotesPage';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (user) {
    return <NotesPage user={user} onLogout={handleLogout} />;
  }

  return showRegister ? (
    <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
  );
}
