import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import apiClient from '../api/apiClient';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiClient.post('/public/contact', formData);
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-900">Contact Support</h2></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message *</label>
            <textarea name="message" required value={formData.message} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            {/* --- 🔽 THIS IS THE FIX 🔽 --- */}
            {/* We use !!success to convert the success string to a boolean */}
            <button type="submit" disabled={loading || !!success} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center disabled:bg-blue-400">
              <Send size={16} className="mr-2" />
              {loading ? 'Sending...' : success ? 'Sent!' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsModal;