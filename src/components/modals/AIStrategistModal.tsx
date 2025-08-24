import React, { useState } from 'react';
import apiClient from '../../api/apiClient'; // Adjusted path assuming modals are in components/modals

interface AIStrategistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refresh the dashboard
}

const AIStrategistModal: React.FC<AIStrategistModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [city, setCity] = useState('');
  // --- UPGRADE: Default to a valid blood type ---
  const [bloodType, setBloodType] = useState('A+'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- UPGRADE: List of valid blood types for the dropdown ---
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // The API path is now correct
      await apiClient.post('/ngos/campaigns/generate-ai-draft', { city, bloodType }, config);
      
      onSuccess(); // Tell the dashboard to refresh
      onClose();   // Close this modal
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate draft.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">AI Campaign Strategist</h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter a target city and blood type. The AI will analyze data and generate a complete campaign draft for you.
        </p>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required 
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="e.g., Hyderabad"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            {/* --- UPGRADE: Replaced text input with a select dropdown --- */}
            <select 
              value={bloodType} 
              onChange={(e) => setBloodType(e.target.value)} 
              required 
              className="mt-1 w-full p-2 border rounded-md bg-white"
            >
              {bloodTypes.map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-purple-600 text-white disabled:bg-purple-300">
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIStrategistModal;