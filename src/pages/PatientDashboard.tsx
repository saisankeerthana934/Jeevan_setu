
// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../api/apiClient';
// import RequestBloodModal from '../components/RequestBloodModal';
// import { PlusCircle } from 'lucide-react';

// // This interface defines the "shape" of a blood request object
// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: {
//     name: string;
//   }
// }

// function PatientDashboard() {
//   const { user } = useAuth();
//   // This initialization ensures 'requests' is always an array
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/blood-requests');
//       // This check ensures the data from the API is an array before setting state
//       if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
//         setRequests(response.data.data.bloodRequests);
//       } else {
//         setRequests([]); // Default to an empty array if API response is not as expected
//       }
//     } catch (err) {
//       console.error('Failed to fetch blood requests:', err);
//       setError('Failed to fetch blood requests.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const handleRequestSuccess = () => {
//     fetchRequests();
//   };

//   if (loading) {
//     return <div className="text-center p-8">Loading dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-gray-600 mt-1">Manage your blood requests and view your history.</p>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
//           >
//             <PlusCircle size={20} />
//             <span>Request Blood</span>
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Your Blood Requests</h2>
//           {error && <p className="text-red-500">{error}</p>}
          
//           {/* This code is now safe because 'requests' is guaranteed to be an array */}
//           {!loading && requests.length === 0 && !error ? (
//             <p className="text-gray-500 text-center py-8">You have not made any blood requests yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="border-b-2">
//                     <th className="py-3 px-4">Date</th>
//                     <th className="py-3 px-4">Blood Type</th>
//                     <th className="py-3 px-4">Units</th>
//                     <th className="py-3 px-4">Hospital</th>
//                     <th className="py-3 px-4">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req._id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
//                       <td className="py-3 px-4 font-bold text-red-600">{req.bloodType}</td>
//                       <td className="py-3 px-4">{req.unitsRequired}</td>
//                       <td className="py-3 px-4">{req.hospital.name}</td>
//                       <td className="py-3 px-4">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
//                           req.status === 'active' ? 'bg-blue-100 text-blue-800' : 
//                           req.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {req.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <RequestBloodModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleRequestSuccess}
//       />
//     </>
//   );
// }

// export default PatientDashboard;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../api/apiClient';
// import RequestBloodModal from '../components/RequestBloodModal';
// import { PlusCircle } from 'lucide-react';

// // This interface defines the "shape" of a blood request object
// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: {
//     name: string;
//   }
// }

// function PatientDashboard() {
//   const { user } = useAuth();
//   // This initialization ensures 'requests' is always an array, preventing crashes
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/blood-requests');
//       // This check ensures the data from the API is an array before setting state
//       if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
//         setRequests(response.data.data.bloodRequests);
//       } else {
//         setRequests([]); // Default to an empty array if API response is not as expected
//       }
//     } catch (err) {
//       console.error('Failed to fetch blood requests:', err);
//       setError('Failed to fetch blood requests.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const handleRequestSuccess = () => {
//     fetchRequests();
//   };

//   if (loading) {
//     return <div className="text-center p-8">Loading dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-gray-600 mt-1">Manage your blood requests and view your history.</p>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
//           >
//             <PlusCircle size={20} />
//             <span>Request Blood</span>
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Your Blood Requests</h2>
//           {error && <p className="text-red-500">{error}</p>}
          
//           {/* This code is now safe because 'requests' is guaranteed to be an array */}
//           {!loading && requests.length === 0 && !error ? (
//             <p className="text-gray-500 text-center py-8">You have not made any blood requests yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="border-b-2">
//                     <th className="py-3 px-4">Date</th>
//                     <th className="py-3 px-4">Blood Type</th>
//                     <th className="py-3 px-4">Units</th>
//                     <th className="py-3 px-4">Hospital</th>
//                     <th className="py-3 px-4">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req._id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
//                       <td className="py-3 px-4 font-bold text-red-600">{req.bloodType}</td>
//                       <td className="py-3 px-4">{req.unitsRequired}</td>
//                       <td className="py-3 px-4">{req.hospital.name}</td>
//                       <td className="py-3 px-4">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
//                           req.status === 'active' ? 'bg-blue-100 text-blue-800' : 
//                           req.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {req.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <RequestBloodModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleRequestSuccess}
//       />
//     </>
//   );
// }

// export default PatientDashboard;


// import  { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../api/apiClient';
// import RequestBloodModal from '../components/RequestBloodModal';
// import { PlusCircle, Zap } from 'lucide-react'; // Import the Zap icon

// // This interface defines the "shape" of a blood request object
// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: {
//     name: string;
//   }
// }

// function PatientDashboard() {
//   const { user } = useAuth();
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // --- NEW STATE TO TRACK OUTREACH STATUS ---
//   const [outreachInProgress, setOutreachInProgress] = useState<string[]>([]);

//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/blood-requests');
//       if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
//         setRequests(response.data.data.bloodRequests);
//       } else {
//         setRequests([]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch blood requests:', err);
//       setError('Failed to fetch blood requests.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const handleRequestSuccess = () => {
//     fetchRequests();
//   };

//   // --- NEW HANDLER FUNCTION FOR THE AI OUTREACH ---
//   const handleInitiateOutreach = async (requestId: string) => {
//     setOutreachInProgress(prev => [...prev, requestId]); // Disable button immediately
//     try {
//         const response = await apiClient.post(`/blood-requests/${requestId}/initiate-outreach`);
//         alert(response.data.message); // Show success message from backend
//     } catch (error: any) {
//         alert(error.response?.data?.message || 'Failed to start outreach. Please try again.');
//     }
//     // Note: We keep the button disabled for the session even after completion.
//   };


//   if (loading) {
//     return <div className="text-center p-8">Loading dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-gray-600 mt-1">Manage your blood requests and view your history.</p>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
//           >
//             <PlusCircle size={20} />
//             <span>Request Blood</span>
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Your Blood Requests</h2>
//           {error && <p className="text-red-500">{error}</p>}
          
//           {!loading && requests.length === 0 && !error ? (
//             <p className="text-gray-500 text-center py-8">You have not made any blood requests yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="border-b-2">
//                     <th className="py-3 px-4">Date</th>
//                     <th className="py-3 px-4">Blood Type</th>
//                     <th className="py-3 px-4">Units</th>
//                     <th className="py-3 px-4">Status</th>
//                     <th className="py-3 px-4">Action</th> {/* New Column Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req._id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
//                       <td className="py-3 px-4 font-bold text-red-600">{req.bloodType}</td>
//                       <td className="py-3 px-4">{req.unitsRequired}</td>
//                       <td className="py-3 px-4">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
//                           req.status === 'active' ? 'bg-blue-100 text-blue-800' : 
//                           req.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {req.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                       {/* --- NEW ACTION CELL WITH THE AI BUTTON --- */}
//                       <td className="py-3 px-4">
//                         {req.status === 'active' && (
//                             <button
//                                 onClick={() => handleInitiateOutreach(req._id)}
//                                 disabled={outreachInProgress.includes(req._id)}
//                                 className="bg-purple-600 text-white font-semibold py-1 px-3 rounded-lg flex items-center space-x-2 text-sm hover:bg-purple-700 disabled:bg-gray-400"
//                             >
//                                 <Zap size={14} />
//                                 <span>{outreachInProgress.includes(req._id) ? 'In Progress...' : 'Find Donors with AI'}</span>
//                             </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <RequestBloodModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleRequestSuccess}
//       />
//     </>
//   );
// }

// export default PatientDashboard;
// PatientDashboard.tsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../api/apiClient';
// import RequestBloodModal from '../components/RequestBloodModal';
// import { PlusCircle, Zap } from 'lucide-react'; // Import the Zap icon

// // This interface defines the "shape" of a blood request object
// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: {
//     name: string;
//   }
// }

// function PatientDashboard() {
//   const { user } = useAuth();
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // --- NEW STATE TO TRACK OUTREACH STATUS ---
//   const [outreachInProgress, setOutreachInProgress] = useState<string[]>([]);

//   const fetchRequests = useCallback(async () => {
//   setLoading(true);
//   try {
//     // --- 🔽 THIS IS THE FIX 🔽 ---
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError("Authentication token not found. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     // Create a config object with the Authorization header
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     // Pass the config object with the request
//     const response = await apiClient.get('/blood-requests', config);
//     // --- 🔼 END OF FIX 🔼 ---

//     if (response.data.success) {
//       setRequests(response.data.data.bloodRequests);
//     } else {
//       setRequests([]);
//     }
//   } catch (err) {
//     setError('Failed to fetch blood requests.');
//   } finally {
//     setLoading(false);
//   }
// }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const handleRequestSuccess = () => {
//     fetchRequests();
//   };

//   // --- NEW HANDLER FUNCTION FOR THE AI OUTREACH ---
//   const handleInitiateOutreach = async (requestId: string) => {
//     setOutreachInProgress(prev => [...prev, requestId]); // Disable button immediately
//     try {
//         const response = await apiClient.post(`/blood-requests/${requestId}/initiate-outreach`);
//         alert(response.data.message); // Show success message from backend
//     } catch (error: any) {
//         alert(error.response?.data?.message || 'Failed to start outreach. Please try again.');
//     }
//     // Note: We keep the button disabled for the session even after completion.
//   };


//   if (loading) {
//     return <div className="text-center p-8">Loading dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-gray-600 mt-1">Manage your blood requests and view your history.</p>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
//           >
//             <PlusCircle size={20} />
//             <span>Request Blood</span>
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4">Your Blood Requests</h2>
//           {error && <p className="text-red-500">{error}</p>}
          
//           {!loading && requests.length === 0 && !error ? (
//             <p className="text-gray-500 text-center py-8">You have not made any blood requests yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="border-b-2">
//                     <th className="py-3 px-4">Date</th>
//                     <th className="py-3 px-4">Blood Type</th>
//                     <th className="py-3 px-4">Units</th>
//                     <th className="py-3 px-4">Status</th>
//                     <th className="py-3 px-4">Action</th> {/* New Column Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req._id} className="border-b hover:bg-gray-50">
//                       <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
//                       <td className="py-3 px-4 font-bold text-red-600">{req.bloodType}</td>
//                       <td className="py-3 px-4">{req.unitsRequired}</td>
//                       <td className="py-3 px-4">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
//                           req.status === 'active' ? 'bg-blue-100 text-blue-800' : 
//                           req.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {req.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                       {/* --- NEW ACTION CELL WITH THE AI BUTTON --- */}
//                       <td className="py-3 px-4">
//                         {req.status === 'active' && (
//                             <button
//                                 onClick={() => handleInitiateOutreach(req._id)}
//                                 disabled={outreachInProgress.includes(req._id)}
//                                 className="bg-purple-600 text-white font-semibold py-1 px-3 rounded-lg flex items-center space-x-2 text-sm hover:bg-purple-700 disabled:bg-gray-400"
//                             >
//                                 <Zap size={14} />
//                                 <span>{outreachInProgress.includes(req._id) ? 'In Progress...' : 'Find Donors with AI'}</span>
//                             </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <RequestBloodModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handleRequestSuccess}
//       />
//     </>
//   );
// }

// export default PatientDashboard;
import  { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import RequestBloodModal from '../components/RequestBloodModal';
import { PlusCircle, Zap } from 'lucide-react';

// This interface defines the "shape" of a blood request object
interface BloodRequest {
  _id: string;
  bloodType: string;
  unitsRequired: number;
  status: string;
  createdAt: string;
  hospital: {
    name: string;
  }
}

function PatientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [outreachInProgress, setOutreachInProgress] = useState<string[]>([]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await apiClient.get('/blood-requests', config);
      
      if (response.data.success) {
        setRequests(response.data.data.bloodRequests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      setError('Failed to fetch blood requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestSuccess = () => {
    fetchRequests();
  };

  const handleInitiateOutreach = async (requestId: string) => {
    setOutreachInProgress(prev => [...prev, requestId]);
    try {
        const token = localStorage.getItem('authToken'); // Don't forget the token for POST requests too
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await apiClient.post(`/blood-requests/${requestId}/initiate-outreach`, {}, config);
        alert(response.data.message);
    } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to start outreach. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">Manage your blood requests and view your history.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Request Blood</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Blood Requests</h2>
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && requests.length === 0 && !error ? (
            <p className="text-gray-500 text-center py-8">You have not made any blood requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Blood Type</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold text-red-600">{req.bloodType}</td>
                      <td className="py-3 px-4">{req.unitsRequired}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          req.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          req.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {req.status === 'active' && (
                          <button
                            onClick={() => handleInitiateOutreach(req._id)}
                            disabled={outreachInProgress.includes(req._id)}
                            className="bg-purple-600 text-white font-semibold py-1 px-3 rounded-lg flex items-center space-x-2 text-sm hover:bg-purple-700 disabled:bg-gray-400"
                          >
                            <Zap size={14} />
                            <span>{outreachInProgress.includes(req._id) ? 'In Progress...' : 'Find Donors with AI'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RequestBloodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
        patientBloodType={user?.bloodType} 
      />
    </>
  );
}

export default PatientDashboard;