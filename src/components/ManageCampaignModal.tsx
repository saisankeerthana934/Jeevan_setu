import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/apiClient';

interface Campaign {
  _id: string;
  title: string;
  description?: string;
  status: string;
  actualParticipants: number;
  bloodCollected: number;
  outcomes?: { livesImpacted?: number }; // Add this for patients helped
}

interface ManageCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign: Campaign | null;
}

const ManageCampaignModal: React.FC<ManageCampaignModalProps> = ({ isOpen, onClose, onSuccess, campaign }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'planned',
    actualParticipants: 0,
    bloodCollected: 0,
    livesImpacted: 0, // Add new state for patients helped
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        status: campaign.status,
        actualParticipants: campaign.actualParticipants || 0,
        bloodCollected: campaign.bloodCollected || 0,
        livesImpacted: campaign.outcomes?.livesImpacted || 0, // Populate from campaign data
      });
    }
  }, [campaign]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    setLoading(true);
    setError('');
    try {
      // Prepare data for the backend
      const updatedData = {
        title: formData.title,
        status: formData.status,
        actualParticipants: Number(formData.actualParticipants),
        bloodCollected: Number(formData.bloodCollected),
        outcomes: {
            livesImpacted: Number(formData.livesImpacted)
        }
      };
      
      await apiClient.put(`/ngos/campaigns/${campaign._id}`, updatedData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-900">Manage Campaign</h2></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Actual Participants</label>
              <input type="number" name="actualParticipants" value={formData.actualParticipants} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Units Collected</label>
              <input type="number" name="bloodCollected" value={formData.bloodCollected} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>
          
           {/* --- 🔽 NEW FIELD FOR PATIENTS HELPED 🔽 --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Patients Helped (Lives Impacted)</label>
            <input type="number" name="livesImpacted" value={formData.livesImpacted} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCampaignModal;