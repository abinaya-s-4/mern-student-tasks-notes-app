import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { apiRequest } from '../api';

export default function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min length 6';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const data = await apiRequest<{ user: any; token: string }>("/auth/register", "POST", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded" />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border p-3 rounded" />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full border p-3 rounded" />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded">Create Account</button>
        </form>
        <p className="mt-6 text-center">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-green-600">Sign in</button>
        </p>
      </div>
    </div>
  );
}
