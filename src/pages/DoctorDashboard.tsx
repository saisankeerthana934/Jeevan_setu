
// import React, { useState, useEffect, useCallback } from 'react';
// import { PlusCircle, Users, Droplet, Trash2 } from 'lucide-react';
// import AddPatientModal from '../components/AddPatientModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import RequestBloodModal from '../components/RequestBloodModal';
// import apiClient from '../api/apiClient';
// import { useAuth } from '../contexts/AuthContext';
// import BloodBankSearch from '../components/BloodBankSearch';

// interface Patient {
//   id: string;
//   name: string;
//   email: string;
//   last_consultation?: string;
// }

// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: {
//     name: string;
//   };
// }

// const DoctorDashboard: React.FC = () => {
//   const { user } = useAuth();
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  
//   const [loading, setLoading] = useState(true);
//   const [requestsLoading, setRequestsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [doctorName, setDoctorName] = useState('Doctor');
//   const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);

//   useEffect(() => {
//     if (user && user.name) {
//       setDoctorName(user.name);
//     }
//   }, [user]);

//   const fetchPatients = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await apiClient.get('/doctors/patients');
//       if (response.data.success && Array.isArray(response.data.data.patients)) {
//         const formattedPatients = response.data.data.patients
//           .map((p: any) => {
//             if (!p.patient) return null;
//             return {
//               id: p.patient._id,
//               name: p.patient.name,
//               email: p.patient.email,
//               last_consultation: p.lastVisit || 'N/A' 
//             };
//           })
//           .filter((p: Patient | null): p is Patient => p !== null);
//         setPatients(formattedPatients);
//       } else {
//         setPatients([]);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch patients.');
//       setPatients([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchRequests = useCallback(async () => {
//     try {
//       setRequestsLoading(true);
//       const response = await apiClient.get('/doctors/blood-requests');
//       if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
//         setRequests(response.data.data.bloodRequests);
//       } else {
//         setRequests([]);
//       }
//     } catch (err: any) {
//       // Don't overwrite patient errors with request errors
//       if (!error) {
//         setError('Failed to fetch blood requests.');
//       }
//       setRequests([]);
//     } finally {
//       setRequestsLoading(false);
//     }
//   }, [error]);

//   useEffect(() => {
//     if (user) {
//       fetchPatients();
//       fetchRequests();
//     }
//   }, [user, fetchPatients, fetchRequests]);

//   const handlePatientAdded = () => {
//     fetchPatients();
//   };
  
//   const handleRequestSuccess = () => {
//     setRequestModalOpen(false);
//     fetchRequests();
//   };

//   const handleRemovePatient = async () => {
//     if (!patientToRemove) return;
//     try {
//       await apiClient.delete(`/doctors/patients/${patientToRemove.id}`);
//       setPatientToRemove(null);
//       fetchPatients();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to remove patient.');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-blue-100 text-blue-800';
//       case 'fulfilled': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       case 'expired': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-yellow-100 text-yellow-800';
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Welcome, Dr. {doctorName}. Manage your patients and their blood requests.
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="p-6 flex justify-between items-center border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <Users className="mr-3 text-blue-600" />
//               Your Patients
//             </h2>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
//             >
//               <PlusCircle className="h-5 w-5 mr-2" />
//               Add Patient
//             </button>
//           </div>
//           <div className="p-6">
//             {loading && <p className="text-center text-gray-500">Loading patients...</p>}
//             {error && <p className="text-center text-red-500">{error}</p>}
//             {!loading && !error && (
//               patients.length > 0 ? (
//                 <ul className="space-y-4">
//                   {patients.map(patient => (
//                       <li key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold text-gray-800">{patient.name}</p>
//                           <p className="text-sm text-gray-500">{patient.email}</p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <p className="text-sm text-gray-500">Last visit: {patient.last_consultation || 'N/A'}</p>
//                             <button
//                                 onClick={() => setPatientToRemove(patient)}
//                                 className="text-red-500 hover:text-red-700"
//                                 title="Remove patient"
//                             >
//                                 <Trash2 className="h-5 w-5" />
//                             </button>
//                         </div>
//                       </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-gray-500">You have not registered any patients yet.</p>
//               )
//             )}
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 flex justify-between items-center border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <Droplet className="mr-3 text-red-500" />
//               Blood Requests You've Created
//             </h2>
//             <button
//               onClick={() => setRequestModalOpen(true)}
//               className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
//             >
//               <PlusCircle className="h-5 w-5 mr-2" />
//               Create Request
//             </button>
//           </div>
//           <div className="p-6">
//             {requestsLoading && <p className="text-center text-gray-500">Loading requests...</p>}
//             {!requestsLoading && (
//               requests.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {requests.map((req) => (
//                         <tr key={req._id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{req.bloodType}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.unitsRequired}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.hospital.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadge(req.status)}`}>
//                               {req.status.replace('_', ' ')}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500">You have not created any blood requests.</p>
//               )
//             )}
//           </div>
//         </div>
//       </div>

//       <AddPatientModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={handlePatientAdded}
//       />
//       <ConfirmationModal
//         isOpen={!!patientToRemove}
//         onClose={() => setPatientToRemove(null)}
//         onConfirm={handleRemovePatient}
//         title="Remove Patient"
//         message={`Are you sure you want to remove ${patientToRemove?.name} from your patient list? This action cannot be undone.`}
//       />
//       {/* This block is now correct, without the extra closing tag */}
//       <RequestBloodModal 
//         isOpen={isRequestModalOpen}
//         onClose={() => setRequestModalOpen(false)}
//         onSuccess={handleRequestSuccess}
//         doctorDetails={user ? { name: user.name, phone: user.phone || '' } : undefined}
//         patientList={patients}
//       />
//     </div>
//   );
// };

// export default DoctorDashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { PlusCircle, Users, Droplet, Trash2, Search } from 'lucide-react';
// import AddPatientModal from '../components/AddPatientModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import RequestBloodModal from '../components/RequestBloodModal';
// import apiClient from '../api/apiClient';
// import { useAuth } from '../contexts/AuthContext';

// // --- DATA STRUCTURES ---
// interface Patient {
//   id: string;
//   name: string;
//   email: string;
//   last_consultation?: string;
// }
// interface BloodRequest {
//   _id: string;
//   bloodType: string;
//   unitsRequired: number;
//   status: string;
//   createdAt: string;
//   hospital: { name: string; };
// }
// interface FoundDonor {
//   _id: string;
//   userId: {
//     name: string;
//     phone: string;
//     location: { city: string; };
//   };
//   bloodType: string;
// }

// const DoctorDashboard: React.FC = () => {
//   // --- STATE ---
//   const { user } = useAuth();
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isRequestModalOpen, setRequestModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [requestsLoading, setRequestsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [doctorName, setDoctorName] = useState('Doctor');
//   const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);

//   // State for the donor search feature
//   const [searchCity, setSearchCity] = useState('');
//   const [searchBloodType, setSearchBloodType] = useState('A+');
//   const [foundDonors, setFoundDonors] = useState<FoundDonor[]>([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchError, setSearchError] = useState('');
//   const [searchPerformed, setSearchPerformed] = useState(false);

//   // --- DATA FETCHING & EVENT HANDLERS ---
//   useEffect(() => { if (user?.name) setDoctorName(user.name); }, [user]);

//   const fetchPatients = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await apiClient.get('/doctors/patients');
//       if (response.data.success && Array.isArray(response.data.data.patients)) {
//         const formattedPatients = response.data.data.patients
//           .map((p: any) => {
//             if (!p.patient) return null;
//             return {
//               id: p.patient._id,
//               name: p.patient.name,
//               email: p.patient.email,
//               last_consultation: p.lastVisit || 'N/A' 
//             };
//           })
//           .filter((p: Patient | null): p is Patient => p !== null);
//         setPatients(formattedPatients);
//       } else {
//         setPatients([]);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch patients.');
//       setPatients([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchRequests = useCallback(async () => {
//     try {
//       setRequestsLoading(true);
//       const response = await apiClient.get('/doctors/blood-requests');
//       if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
//         setRequests(response.data.data.bloodRequests);
//       } else {
//         setRequests([]);
//       }
//     } catch (err: any) {
//       if (!error) {
//         setError('Failed to fetch blood requests.');
//       }
//       setRequests([]);
//     } finally {
//       setRequestsLoading(false);
//     }
//   }, [error]);

//   useEffect(() => {
//     if (user) {
//       fetchPatients();
//       fetchRequests();
//     }
//   }, [user, fetchPatients, fetchRequests]);

//   const handlePatientAdded = () => { fetchPatients(); };
//   const handleRequestSuccess = () => { setRequestModalOpen(false); fetchRequests(); };
//   const handleRemovePatient = async () => {
//     if (!patientToRemove) return;
//     try {
//       await apiClient.delete(`/doctors/patients/${patientToRemove.id}`);
//       setPatientToRemove(null);
//       fetchPatients();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to remove patient.');
//     }
//   };

//   const handleFindDonors = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearchLoading(true);
//     setSearchError('');
//     setFoundDonors([]);
//     setSearchPerformed(true);

//     try {
//       const response = await apiClient.post('/doctors/find-donors', {
//         city: searchCity,
//         bloodType: searchBloodType,
//       });
//       if (response.data.success) {
//         setFoundDonors(response.data.data.donors);
//       }
//     } catch (err: any) {
//       setSearchError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-blue-100 text-blue-800';
//       case 'fulfilled': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Welcome Header Card */}
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Welcome, Dr. {doctorName}. Manage your patients and their blood requests.
//           </p>
//         </div>

//         {/* Your Patients Card */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="p-6 flex justify-between items-center border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <Users className="mr-3 text-blue-600" /> Your Patients
//             </h2>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
//             >
//               <PlusCircle className="h-5 w-5 mr-2" /> Add Patient
//             </button>
//           </div>
//           <div className="p-6">
//             {loading && <p className="text-center text-gray-500">Loading patients...</p>}
//             {error && <p className="text-center text-red-500">{error}</p>}
//             {!loading && !error && (
//               patients.length > 0 ? (
//                 <ul className="space-y-4">
//                   {patients.map(patient => (
//                       <li key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold text-gray-800">{patient.name}</p>
//                           <p className="text-sm text-gray-500">{patient.email}</p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <p className="text-sm text-gray-500">Last visit: {patient.last_consultation || 'N/A'}</p>
//                             <button onClick={() => setPatientToRemove(patient)} className="text-red-500 hover:text-red-700" title="Remove patient">
//                                 <Trash2 className="h-5 w-5" />
//                             </button>
//                         </div>
//                       </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-gray-500">You have not registered any patients yet.</p>
//               )
//             )}
//           </div>
//         </div>
        
//         {/* Blood Requests Card */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 flex justify-between items-center border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <Droplet className="mr-3 text-red-500" /> Blood Requests You've Created
//             </h2>
//             <button
//               onClick={() => setRequestModalOpen(true)}
//               className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
//             >
//               <PlusCircle className="h-5 w-5 mr-2" /> Create Request
//             </button>
//           </div>
//           <div className="p-6">
//             {requestsLoading && <p className="text-center text-gray-500">Loading requests...</p>}
//             {!requestsLoading && (
//               requests.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Type</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {requests.map((req) => (
//                         <tr key={req._id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{req.bloodType}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.unitsRequired}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.hospital.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadge(req.status)}`}>
//                               {req.status.replace('_', ' ')}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500">You have not created any blood requests.</p>
//               )
//             )}
//           </div>
//         </div>

//         {/* Find Compatible Donors Card */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="p-6 border-b"><h2 className="text-xl font-semibold text-gray-800">Find Compatible Donors</h2></div>
//           <form onSubmit={handleFindDonors} className="p-6 space-y-4">
//             <div className="grid md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 value={searchCity}
//                 onChange={(e) => setSearchCity(e.target.value)}
//                 placeholder="Enter city (e.g., Hyderabad)"
//                 required
//                 className="md:col-span-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//               <select
//                 value={searchBloodType}
//                 onChange={(e) => setSearchBloodType(e.target.value)}
//                 className="md:col-span-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
//               </select>
//               <button
//                 type="submit"
//                 disabled={searchLoading}
//                 className="md:col-span-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
//               >
//                 <Search size={18} className="mr-2" />
//                 {searchLoading ? 'Searching...' : 'Search'}
//               </button>
//             </div>
//           </form>

//           <div className="p-6 border-t">
//             {searchError && <p className="text-center text-red-500">{searchError}</p>}
//             {!searchError && foundDonors.length > 0 && (
//               <ul className="space-y-3">
//                 {foundDonors.map(donor => (
//                   <li key={donor._id} className="p-4 border rounded-lg flex justify-between items-center">
//                     <div>
//                       <p className="font-semibold">{donor.userId.name}</p>
//                       <p className="text-sm text-gray-500">{donor.userId.phone}</p>
//                     </div>
//                     <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{donor.bloodType}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             {!searchError && searchPerformed && foundDonors.length === 0 && (
//               <p className="text-center text-gray-500">No compatible donors found for this search.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* --- MODALS --- */}
//       <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePatientAdded} />
//       <ConfirmationModal isOpen={!!patientToRemove} onClose={() => setPatientToRemove(null)} onConfirm={handleRemovePatient} title="Remove Patient" message={`Are you sure you want to remove ${patientToRemove?.name} from your patient list?`} />
//       <RequestBloodModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSuccess={handleRequestSuccess} doctorDetails={user ? { name: user.name, phone: user.phone || '' } : undefined} patientList={patients} />
//     </div>
//   );
// };

// export default DoctorDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Users, Droplet, Trash2, Search } from 'lucide-react';
import AddPatientModal from '../components/AddPatientModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RequestBloodModal from '../components/RequestBloodModal';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';

// --- DATA STRUCTURES ---
interface Patient {
  id: string;
  name: string;
  email: string;
  last_consultation?: string;
}
interface BloodRequest {
  _id: string;
  bloodType: string;
  unitsRequired: number;
  status: string;
  createdAt: string;
  hospital: { name: string; };
}
// This interface needs to be updated to include the structure of the populated userId
interface FoundDonor {
  _id: string;
  userId: {
    _id: string; // <-- Add the user's ID
    name: string;
    phone: string;
    location: { city: string; };
  };
  bloodType: string;
}

const DoctorDashboard: React.FC = () => {
  // --- STATE ---
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorName, setDoctorName] = useState('Doctor');
  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);

  // State for the donor search feature
  const [searchCity, setSearchCity] = useState('');
  const [searchBloodType, setSearchBloodType] = useState('A+');
  const [foundDonors, setFoundDonors] = useState<FoundDonor[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  // --- NEW STATE FOR TRACKING CONTACTED DONORS ---
  const [contactedDonors, setContactedDonors] = useState<string[]>([]);


  // --- DATA FETCHING & EVENT HANDLERS ---
  useEffect(() => { if (user?.name) setDoctorName(user.name); }, [user]);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/doctors/patients');
      if (response.data.success && Array.isArray(response.data.data.patients)) {
        const formattedPatients = response.data.data.patients
          .map((p: any) => {
            if (!p.patient) return null;
            return {
              id: p.patient._id,
              name: p.patient.name,
              email: p.patient.email,
              last_consultation: p.lastVisit || 'N/A' 
            };
          })
          .filter((p: Patient | null): p is Patient => p !== null);
        setPatients(formattedPatients);
      } else {
        setPatients([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch patients.');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setRequestsLoading(true);
      const response = await apiClient.get('/doctors/blood-requests');
      if (response.data.success && Array.isArray(response.data.data.bloodRequests)) {
        setRequests(response.data.data.bloodRequests);
      } else {
        setRequests([]);
      }
    } catch (err: any) {
      if (!error) {
        setError('Failed to fetch blood requests.');
      }
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchRequests();
    }
  }, [user, fetchPatients, fetchRequests]);

  const handlePatientAdded = () => { fetchPatients(); };
  const handleRequestSuccess = () => { setRequestModalOpen(false); fetchRequests(); };
  const handleRemovePatient = async () => {
    if (!patientToRemove) return;
    try {
      await apiClient.delete(`/doctors/patients/${patientToRemove.id}`);
      setPatientToRemove(null);
      fetchPatients();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove patient.');
    }
  };

  const handleFindDonors = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError('');
    setFoundDonors([]);
    setSearchPerformed(true);

    try {
      const response = await apiClient.post('/doctors/find-donors', {
        city: searchCity,
        bloodType: searchBloodType,
      });
      if (response.data.success) {
        setFoundDonors(response.data.data.donors);
      }
    } catch (err: any) {
      setSearchError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };
  
  // --- NEW HANDLER FOR THE "REQUEST CONTACT" BUTTON ---
  const handleRequestContact = async (donorUserId: string) => {
    try {
        await apiClient.post(`/doctors/request-contact/${donorUserId}`);
        alert('Notification sent successfully!');
        setContactedDonors(prev => [...prev, donorUserId]);
    } catch (error) {
        alert('Failed to send notification. Please try again.');
    }
  };


  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, Dr. {doctorName}. Manage your patients and their blood requests.
          </p>
        </div>

        {/* Your Patients Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Users className="mr-3 text-blue-600" /> Your Patients
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Patient
            </button>
          </div>
          <div className="p-6">
            {loading && <p className="text-center text-gray-500">Loading patients...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
              patients.length > 0 ? (
                <ul className="space-y-4">
                  {patients.map(patient => (
                      <li key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-500">Last visit: {patient.last_consultation || 'N/A'}</p>
                            <button onClick={() => setPatientToRemove(patient)} className="text-red-500 hover:text-red-700" title="Remove patient">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                      </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">You have not registered any patients yet.</p>
              )
            )}
          </div>
        </div>
        
        {/* Blood Requests Card */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Droplet className="mr-3 text-red-500" /> Blood Requests You've Created
            </h2>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Create Request
            </button>
          </div>
          <div className="p-6">
            {requestsLoading && <p className="text-center text-gray-500">Loading requests...</p>}
            {!requestsLoading && (
              requests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((req) => (
                        <tr key={req._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{req.bloodType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.unitsRequired}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.hospital.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadge(req.status)}`}>
                              {req.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">You have not created any blood requests.</p>
              )
            )}
          </div>
        </div>

        {/* Find Compatible Donors Card */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b"><h2 className="text-xl font-semibold text-gray-800">Find Compatible Donors</h2></div>
          <form onSubmit={handleFindDonors} className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city (e.g., Hyderabad)"
                required
                className="md:col-span-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={searchBloodType}
                onChange={(e) => setSearchBloodType(e.target.value)}
                className="md:col-span-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
              <button
                type="submit"
                disabled={searchLoading}
                className="md:col-span-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                <Search size={18} className="mr-2" />
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          <div className="p-6 border-t">
            {searchError && <p className="text-center text-red-500">{searchError}</p>}
            {!searchError && foundDonors.length > 0 && (
              <ul className="space-y-3">
                {foundDonors.map(donor => (
                  <li key={donor._id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{donor.userId.name}</p>
                      <p className="text-sm text-gray-500">{donor.userId.phone}</p>
                    </div>
                    {/* --- UPDATED SECTION WITH NEW BUTTON --- */}
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{donor.bloodType}</span>
                        <button
                            onClick={() => handleRequestContact(donor.userId._id)}
                            disabled={contactedDonors.includes(donor.userId._id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {contactedDonors.includes(donor.userId._id) ? 'Contacted' : 'Request Contact'}
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!searchError && searchPerformed && foundDonors.length === 0 && (
              <p className="text-center text-gray-500">No compatible donors found for this search.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePatientAdded} />
      <ConfirmationModal isOpen={!!patientToRemove} onClose={() => setPatientToRemove(null)} onConfirm={handleRemovePatient} title="Remove Patient" message={`Are you sure you want to remove ${patientToRemove?.name} from your patient list?`} />
      <RequestBloodModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSuccess={handleRequestSuccess} doctorDetails={user ? { name: user.name, phone: user.phone || '' } : undefined} patientList={patients} />
    </div>
  );
};

export default DoctorDashboard;
