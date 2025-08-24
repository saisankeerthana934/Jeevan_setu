import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function PatientRegistration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodType: 'A+',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // --- KEY CHANGES ARE HERE ---
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'patient', // Changed from 'donor' to 'patient'
      bloodType: formData.bloodType,
      location: {
        city: formData.city,
        state: formData.state,
      },
    };

    try {
      await register(userData);
      alert('Registration successful! Welcome.');
      navigate('/patient-dashboard'); // Navigate to homepage or dashboard
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please check your details.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- TITLE CHANGED --- */}
      <h1 className="text-3xl font-bold text-center mb-6">Register as a Patient</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border a-rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Blood Type</label>
          <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        
        {/* --- AGE AND WEIGHT REMOVED --- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-gray-700">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default PatientRegistration;