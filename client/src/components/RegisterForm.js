import React, { useState } from "react";

function RegisterForm({ onRegister, loading, error }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onRegister(form.name, form.email, form.password);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create Your Account</h2>
      <p className="form-subtitle">Join now to organize your study tasks and notes effortlessly.</p>
      <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Create a secure password" value={form.password} onChange={handleChange} required />
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="form-footer">
        Already have an account? <a href="/login">Log in here</a>
      </p>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default RegisterForm;
