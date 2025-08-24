
// import React, { useState } from 'react';
// import { X, MapPin, Calendar, AlertTriangle } from 'lucide-react';
// import apiClient from '../api/apiClient';

// interface RequestBloodModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// const RequestBloodModal: React.FC<RequestBloodModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     bloodType: '',
//     unitsRequired: '',
//     urgency: 'moderate',
//     hospital: { name: '', city: '', address: '', contactNumber: '' },
//     requiredBy: '',
//     doctor: { name: '', phone: '', specialization: '' },
//     patientCondition: { currentCondition: '', hemoglobinLevel: '', criticalNotes: '' },
//     additionalNotes: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
//   const urgencyLevels = [
//     { value: 'critical', label: 'Critical (Within 6 hours)', color: 'text-red-600' },
//     { value: 'high', label: 'High (Within 24 hours)', color: 'text-orange-600' },
//     { value: 'moderate', label: 'Moderate (Within 3 days)', color: 'text-yellow-600' },
//     { value: 'routine', label: 'Routine (Within a week)', color: 'text-green-600' }
//   ];

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...(prev[parent as keyof typeof prev] as any),
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const requestData = {
//         ...formData,
//         unitsRequired: parseInt(formData.unitsRequired),
//         requiredBy: new Date(formData.requiredBy).toISOString(),
//         patientCondition: {
//             ...formData.patientCondition,
//             hemoglobinLevel: formData.patientCondition.hemoglobinLevel ? parseFloat(formData.patientCondition.hemoglobinLevel) : undefined
//         },
//       };

//       await apiClient.post('/blood-requests', requestData);
//       alert('Blood request submitted successfully!');
//       onSuccess?.();
//       onClose();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to create blood request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
//         <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-900">Request Blood</h2>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
//           {/* Your full form UI goes here */}
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//             <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="text-red-800 font-medium">Emergency Protocol</p>
//               <p className="text-red-700 text-sm">For life-threatening emergencies, call our 24/7 helpline.</p>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//               <span className="block sm:inline">{error}</span>
//             </div>
//           )}

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type Required *</label>
//               <select name="bloodType" required value={formData.bloodType} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
//                 <option value="">Select blood type</option>
//                 {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Units Required *</label>
//               <input type="number" name="unitsRequired" required min="1" max="10" value={formData.unitsRequired} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="1-10"/>
//             </div>
//           </div>
          
//           <div className="flex justify-end space-x-4 pt-4 border-t">
//             <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
//             <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-300">
//               {loading ? 'Submitting...' : 'Submit Request'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequestBloodModal;
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/apiClient';

// Define the shape of the data we expect for props
interface DoctorDetails {
  name: string;
  phone: string;
}

interface Patient {
  id: string;
  name: string;
}

interface RequestBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  doctorDetails?: DoctorDetails; // Optional prop for doctor's info
  patientList?: Patient[]; 
  patientBloodType?: string;      // Optional prop for the patient list
}

const RequestBloodModal: React.FC<RequestBloodModalProps> = ({ isOpen, onClose, onSuccess, doctorDetails, patientList }) => {
  const [formData, setFormData] = useState({
    patientId: '', // New field for the selected patient
    bloodType: '',
    unitsRequired: '',
    urgency: 'moderate',
    hospital: { name: '', city: '' },
    requiredBy: '',
    doctor: { name: '', phone: '' },
    additionalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // This effect pre-fills the doctor's details when the modal opens
  useEffect(() => {
    if (doctorDetails) {
      setFormData(prev => ({
        ...prev,
        doctor: {
          name: doctorDetails.name,
          phone: doctorDetails.phone
        }
      }));
    }
  }, [isOpen, doctorDetails]);


  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      if (parentKey === 'hospital' || parentKey === 'doctor') {
        setFormData(prev => ({
          ...prev,
          [parentKey]: { ...prev[parentKey], [childKey]: value },
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        unitsRequired: parseInt(formData.unitsRequired),
        requiredBy: new Date(formData.requiredBy).toISOString(),
      };

      await apiClient.post('/blood-requests', requestData);
      alert('Blood request submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create blood request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Create Blood Request</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          {/* --- 🔽 NEW PATIENT DROPDOWN 🔽 --- */}
          {patientList && patientList.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
              <select 
                name="patientId" 
                required 
                value={formData.patientId} 
                onChange={handleInputChange} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Choose a patient --</option>
                {patientList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type Required *</label>
              <select name="bloodType" required value={formData.bloodType} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Units Required *</label>
              <input type="number" name="unitsRequired" required min="1" max="10" value={formData.unitsRequired} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="1-10"/>
            </div>
          </div>
          
          <div className="border-t pt-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor's Information</h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Name *</label>
                  {/* This field will now be pre-filled and disabled for doctors */}
                  <input type="text" name="doctor.name" required value={formData.doctor.name} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" disabled={!!doctorDetails} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Phone *</label>
                   {/* This field will now be pre-filled and disabled for doctors */}
                  <input type="tel" name="doctor.phone" required value={formData.doctor.phone} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" disabled={!!doctorDetails} />
                </div>
             </div>
          </div>

          <div className="border-t pt-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Hospital & Date</h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
                  <input type="text" name="hospital.name" required value={formData.hospital.name} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" name="hospital.city" required value={formData.hospital.city} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Required By *</label>
                  <input type="date" name="requiredBy" required value={formData.requiredBy} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
             </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-300">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBloodModal;

