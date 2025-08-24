import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import { Droplets, Calendar, Building2, Check, X } from 'lucide-react';

// This interface defines the "shape" of a blood request object
interface BloodRequest {
  _id: string;
  bloodType: string;
  unitsRequired: number;
  urgency: string;
  hospital: { 
    name: string; 
    city: string; 
  };
  requiredBy: string;
}

function DonorDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // This function fetches relevant blood requests from the backend
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/blood-requests');
      setRequests(response.data.data.bloodRequests);
    } catch (error) {
      console.error("Failed to fetch donation requests", error);
      setError("Could not load available requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // This useEffect hook runs the fetch function once when the page loads
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // This function handles the donor's response (Accept/Decline)
  const handleResponse = async (requestId: string, response: 'accepted' | 'declined') => {
    try {
      if (response === 'accepted') {
        if (!window.confirm('Are you sure you want to accept this request? The patient will be notified.')) {
          return;
        }
      }
      
      await apiClient.post(`/blood-requests/${requestId}/respond`, { response });
      alert(`You have successfully ${response} the request.`);
      
      // Refresh the list to remove the request you just responded to
      fetchRequests();
    } catch (error: any) {
      alert("Failed to respond: " + error.response?.data?.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your life-saving contributions. Below are urgent requests that match your profile.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Urgent Requests Near You</h2>
        {loading && <p className="text-center text-gray-500">Loading available requests...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length > 0 ? (
              requests.map(req => (
                <div key={req._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-red-600 font-bold text-xl mb-3">
                      <Droplets className="mr-2" />
                      <span>{req.unitsRequired} Unit(s) of {req.bloodType}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex items-center"><Building2 size={16} className="mr-2 flex-shrink-0" />{req.hospital.name}, {req.hospital.city}</p>
                      <p className="flex items-center"><Calendar size={16} className="mr-2 flex-shrink-0" />Required by: {new Date(req.requiredBy).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end space-x-3">
                    <button onClick={() => handleResponse(req._id, 'declined')} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center">
                      <X size={16} className="mr-1" /> Decline
                    </button>
                    <button onClick={() => handleResponse(req._id, 'accepted')} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center">
                      <Check size={16} className="mr-1" /> Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                There are currently no urgent requests matching your profile. We'll notify you when a match is found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorDashboard;