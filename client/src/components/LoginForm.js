import React, { useState } from "react";

function LoginForm({ onLogin, loading, error }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onLogin(form.email, form.password);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Welcome Back!</h2>
      <p className="form-subtitle">Log in to access your tasks and notes.</p>
      <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="********" value={form.password} onChange={handleChange} required />
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>
      <p className="form-footer">
        Don’t have an account? <a href="/register">Sign up here</a>
      </p>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default LoginForm;
