import React, { useState } from 'react';
import { X, Mail, UserCheck } from 'lucide-react';
import apiClient from '../api/apiClient';

interface RecruitVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecruitVolunteerModal: React.FC<RecruitVolunteerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiClient.post('/ngos/volunteers', { email, role });
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setEmail('');
        setRole('general');
        onSuccess();
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 2000);
      }
    } catch (err: any) {
      // --- 🔽 THIS IS THE FIX 🔽 ---
      // This will check for a specific list of validation errors from the backend
      // and display them clearly to the user.
      if (err.response?.data?.errors) {
        const specificError = err.response.data.errors.map((e: any) => e.msg).join(', ');
        setError(specificError);
      } else {
        setError(err.response?.data?.message || 'Failed to add volunteer.');
      }
      // --- 🔼 END OF FIX 🔼 ---
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <UserCheck className="mr-2" /> Recruit New Volunteer
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer's Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter user's email"
              />
            </div>
             <p className="text-xs text-gray-500 mt-1">The user must be registered on JeevanSetu.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role</label>
             <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-md">
                <option value="general">General</option>
                <option value="coordinator">Coordinator</option>
                <option value="medical">Medical Staff</option>
                <option value="logistics">Logistics</option>
                <option value="communication">Communication</option>
             </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              {loading ? 'Adding...' : 'Add Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruitVolunteerModal;