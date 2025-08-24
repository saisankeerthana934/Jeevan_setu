import React, { useState, useEffect, useCallback } from 'react';
    import apiClient from '../api/apiClient';
    import { CheckCircle, XCircle } from 'lucide-react';

    interface NGO {
        _id: string;
        organizationName: string;
        verificationStatus: 'pending' | 'approved' | 'rejected';
        userId: {
            name: string;
            email: string;
        };
    }

    const AdminDashboard: React.FC = () => {
        const [ngos, setNgos] = useState<NGO[]>([]);
        const [loading, setLoading] = useState(true);

        const fetchNGOs = useCallback(async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/admin/ngos');
                if (response.data.success) {
                    setNgos(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch NGOs", error);
            } finally {
                setLoading(false);
            }
        }, []);

        useEffect(() => {
            fetchNGOs();
        }, [fetchNGOs]);

        const handleVerification = async (ngoId: string, status: 'approved' | 'rejected') => {
            try {
                await apiClient.put(`/admin/ngos/${ngoId}/verify`, { status });
                // Refresh the list to show the change
                fetchNGOs();
            } catch (error) {
                alert(`Failed to update status. Please try again.`);
                console.error("Verification error", error);
            }
        };

        const pendingNGOs = ngos.filter(ngo => ngo.verificationStatus === 'pending');

        if (loading) {
            return <div className="text-center p-10">Loading Admin Panel...</div>;
        }

        return (
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Admin Verification Panel</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Pending NGO Approvals</h2>
                    {pendingNGOs.length > 0 ? (
                        <ul className="space-y-4">
                            {pendingNGOs.map(ngo => (
                                <li key={ngo._id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">{ngo.organizationName}</p>
                                        <p className="text-sm text-gray-600">{ngo.userId.name} ({ngo.userId.email})</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleVerification(ngo._id, 'approved')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                                            <CheckCircle />
                                        </button>
                                        <button onClick={() => handleVerification(ngo._id, 'rejected')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200">
                                            <XCircle />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No NGOs are currently pending verification.</p>
                    )}
                </div>
            </div>
        );
    };

    export default AdminDashboard;