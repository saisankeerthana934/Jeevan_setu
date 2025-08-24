import React, { useState } from 'react';
import apiClient from '../api/apiClient'; // Your configured axios instance

interface Donor {
  _id: string;
  donorId: string;
  donorBloodGroup: string;
  donorLocation: string;
  donorPhoneNumber: string;
}

const BloodBankSearch: React.FC = () => {
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [results, setResults] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !bloodGroup.trim()) {
      setError('Please enter both location and blood group.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      const response = await apiClient.get(`/public/find-donors?location=${location}&bloodGroup=${bloodGroup}`);
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Compatible Donors</h2>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or state..."
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="mt-6">
        {loading && <p className="text-center text-gray-500">Loading results...</p>}
        {!loading && searched && results.length > 0 && (
          <ul className="space-y-4">
            {results.map((donor) => (
              <li key={donor._id} className="p-4 border rounded-lg bg-gray-50">
                <p className="font-bold text-gray-900">Donor ID: {donor.donorId} <span className="font-normal text-red-600">({donor.donorBloodGroup})</span></p>
                <p className="text-sm text-gray-600">Location: {donor.donorLocation}</p>
                <p className="text-sm text-gray-600">Phone: {donor.donorPhoneNumber}</p>
              </li>
            ))}
          </ul>
        )}
        {!loading && searched && results.length === 0 && (
          <p className="text-center text-gray-500">No compatible donors found for this search.</p>
        )}
      </div>
    </div>
  );
};

export default BloodBankSearch;