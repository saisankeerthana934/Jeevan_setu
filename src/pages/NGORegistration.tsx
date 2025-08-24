import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

function NGORegistration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    name: '', // Contact Person's Name
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const ngoData = {
      organizationName: formData.organizationName,
      registrationNumber: formData.registrationNumber,
      name: formData.name, // Contact Person Name
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'ngo',
      location: { city: formData.city, state: formData.state },
    };

    try {
      await register(ngoData);
      alert('NGO registration successful!');
      navigate('/ngo-dashboard');
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
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Register your NGO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our network to connect with donors and manage campaigns.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Organization Name *</label>
                        <input type="text" name="organizationName" required onChange={handleChange} value={formData.organizationName} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Official Registration No. *</label>
                        <input type="text" name="registrationNumber" required onChange={handleChange} value={formData.registrationNumber} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800">Contact Person & Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Contact Person Name *</label>
                        <input type="text" name="name" required onChange={handleChange} value={formData.name} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Contact Email *</label>
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
                        <label className="text-sm font-medium text-gray-700">City *</label>
                        <input type="text" name="city" required onChange={handleChange} value={formData.city} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">State *</label>
                        <input type="text" name="state" required onChange={handleChange} value={formData.state} className="mt-1 w-full rounded-lg border-gray-300 p-3" />
                    </div>
                </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center py-2">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Registering...' : 'Register NGO'}
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

export default NGORegistration;