import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashbord";
import NoteForm from "./components/NoteForm";
import NoteView from "./pages/NoteView";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = (email, password) => {
    // Stub auth — replace with backend
    setToken("demo-token");
    localStorage.setItem("token", "demo-token");
  };

  const register = (name, email, password) => {
    setToken("demo-token");
    localStorage.setItem("token", "demo-token");
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const saveNote = (title, content) => {
    console.log("Save note: ", title, content);
    // Call backend save API here
  };

  return (
    <BrowserRouter>
      {token && <Header onLogout={logout} />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={login} loading={loading} error={error} />} />
        <Route path="/register" element={<RegisterForm onRegister={register} loading={loading} error={error} />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add" element={token ? <NoteForm onSave={saveNote} /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={token ? <NoteForm initial={{ title: "Sample", content: "Edit me" }} onSave={saveNote} /> : <Navigate to="/login" />} />
        <Route path="/note/:id" element={token ? <NoteView /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


