import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

function DoctorRegistration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    specialization: 'General Practice', // Default value
    licenseNumber: '',
    hospitalName: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This array matches the enum in your backend Doctor model
  const specializations = [
    'Hematology',
    'Transfusion Medicine',
    'Pediatric Hematology',
    'Internal Medicine',
    'General Practice',
    'Emergency Medicine',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // CORRECTED: This data structure now perfectly matches what the backend API expects
    const doctorData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'doctor',
      location: { city: formData.city, state: formData.state },
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      hospitalName: formData.hospitalName, // Correctly sending as a flat property
      experience: parseInt(formData.experience)
    };

    try {
      await register(doctorData);
      alert('Doctor registration successful!');
      navigate('/doctor-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Stethoscope className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Register as a Doctor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our network of medical professionals to support patients.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Professional & Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <input type="text" name="name" required onChange={handleChange} value={formData.name} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <input type="email" name="email" required onChange={handleChange} value={formData.email} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password *</label>
                <input type="password" name="password" required onChange={handleChange} value={formData.password} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                <input type="tel" name="phone" required onChange={handleChange} value={formData.phone} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">License Number *</label>
                <input type="text" name="licenseNumber" required onChange={handleChange} value={formData.licenseNumber} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Experience (Years) *</label>
                <input type="number" name="experience" required onChange={handleChange} value={formData.experience} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              {/* CORRECTED: Added a dropdown for specialization */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Specialization *</label>
                <select name="specialization" required onChange={handleChange} value={formData.specialization} className="mt-1 w-full rounded-lg border-gray-300 p-3">
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Hospital/Clinic Name *</label>
                <input type="text" name="hospitalName" required onChange={handleChange} value={formData.hospitalName} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">City *</label>
                <input type="text" name="city" required onChange={handleChange} value={formData.city} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">State *</label>
                <input type="text" name="state" required onChange={handleChange} value={formData.state} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center py-2">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center rounded-lg bg-green-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
              >
                {loading ? 'Registering...' : 'Register as Doctor'}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default DoctorRegistration;
