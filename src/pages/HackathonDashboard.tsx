// import React, { useState, useEffect } from 'react';
// import apiClient from '../api/apiClient';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// // --- Interfaces for our data shapes ---
// interface ForecastData {
//     _id: string;
//     count: number;
// }
// interface Donor {
//     _id: string;
//     userId: string;
//     callsToDonationsRatio: number;
// }
// interface HeatmapPoint {
//     location: { coordinates: [number, number] };
//     bloodGroup: string;
// }

// const HackathonDashboard: React.FC = () => {
//     const [forecast, setForecast] = useState<ForecastData[]>([]);
//     const [bridgeDonors, setBridgeDonors] = useState<Donor[]>([]);
//     const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
//     const [selectedBloodGroup, setSelectedBloodGroup] = useState('A Positive');
//     const [loading, setLoading] = useState(true);

//     // Fetch all data on component load
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const forecastPromise = apiClient.get('/dashboard/shortage-forecast');
//                 const heatmapPromise = apiClient.get('/dashboard/heatmap');
                
//                 const [forecastRes, heatmapRes] = await Promise.all([forecastPromise, heatmapPromise]);
                
//                 setForecast(forecastRes.data.data);
//                 setHeatmapData(heatmapRes.data.data);

//             } catch (error) {
//                 console.error("Failed to fetch initial dashboard data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // Fetch bridge donors when the selected blood group changes
//     useEffect(() => {
//         if (selectedBloodGroup) {
//             apiClient.get(`/dashboard/find-bridge-donors?bloodGroup=${selectedBloodGroup}`)
//                 .then(res => setBridgeDonors(res.data.data))
//                 .catch(err => console.error("Failed to fetch bridge donors", err));
//         }
//     }, [selectedBloodGroup]);

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen"><p>Loading Dashboard...</p></div>;
//     }

//     return (
//         <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//             <header className="mb-8">
//                 <h1 className="text-4xl font-bold text-red-600">Project Lifeline 🩸</h1>
//                 <p className="text-lg text-gray-600">The Smart Blood Supply Chain Dashboard</p>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* --- Left Column: Predictions and Actions --- */}
//                 <div className="lg:col-span-1 space-y-8">
//                     {/* Blood Supply Forecast */}
//                     <div className="p-6 bg-white rounded-2xl shadow-lg">
//                         <h2 className="text-xl font-bold mb-4">14-Day Blood Supply Forecast</h2>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={forecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//                                 <XAxis dataKey="_id" angle={-45} textAnchor="end" height={60} interval={0} />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="count" fill="#ef4444" name="Eligible Donors" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>

//                     {/* Smart Bridge Donor Activation */}
//                     <div className="p-6 bg-white rounded-2xl shadow-lg">
//                         <h2 className="text-xl font-bold mb-2">Activate Bridge Donors</h2>
//                         <p className="text-sm text-gray-500 mb-4">Find the most reliable donors to call for a specific need.</p>
//                         <select
//                             value={selectedBloodGroup}
//                             onChange={(e) => setSelectedBloodGroup(e.target.value)}
//                             className="w-full p-2 border rounded-lg mb-4 bg-white"
//                         >
//                             <option>A Positive</option>
//                             <option>A Negative</option>
//                             <option>B Positive</option>
//                             <option>B Negative</option>
//                             <option>AB Positive</option>
//                             <option>AB Negative</option>
//                             <option>O Positive</option>
//                             <option>O Negative</option>
//                         </select>
//                         <ul className="space-y-2 h-48 overflow-y-auto">
//                            {bridgeDonors.length > 0 ? bridgeDonors.map(donor => (
//                                <li key={donor._id} className="p-2 bg-red-50 rounded-lg">
//                                    <p className="font-semibold">Donor ID: {donor.userId}</p>
//                                    <p className="text-sm text-green-700">Reliability: {Math.round(donor.callsToDonationsRatio * 100)}%</p>
//                                </li>
//                            )) : <p className="text-gray-500 text-sm">No eligible Bridge Donors found.</p>}
//                         </ul>
//                     </div>
//                 </div>

//                 {/* --- Right Column: Geospatial Heatmap --- */}
//                 <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 min-h-[600px]">
//                     <h2 className="text-xl font-bold mb-4">Live Donor Supply Heatmap</h2>
//                     <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ height: '100%', width: '100%', minHeight: '550px', borderRadius: '1rem' }}>
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                         />
//                         {heatmapData.map((point, idx) => (
//                             <CircleMarker
//                                 key={idx}
//                                 center={[point.location.coordinates[1], point.location.coordinates[0]]} // lat, lon
//                                 radius={5}
//                                 pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5, stroke: false }}
//                             >
//                                 <Popup>Blood Group: {point.bloodGroup}</Popup>
//                             </CircleMarker>
//                         ))}
//                     </MapContainer>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HackathonDashboard;
import React, { useState, useEffect } from 'react'; // <-- THIS LINE IS NOW FIXED
import apiClient from '../api/apiClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- Interfaces for our data shapes ---
interface ForecastData {
    _id: string;
    count: number;
}
interface Donor {
    _id: string;
    userId: string;
    callsToDonationsRatio: number;
}
interface HeatmapPoint {
    location: { coordinates: [number, number] };
    bloodGroup: string;
}

// --- Jitter function to fix map overlap ---
const addJitter = (coord: number) => coord + (Math.random() - 0.5) * 0.05;

const HackathonDashboard: React.FC = () => {
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const [bridgeDonors, setBridgeDonors] = useState<Donor[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('O Positive');
    const [loading, setLoading] = useState(true);
    const [donorsLoading, setDonorsLoading] = useState(false);

    // Fetch initial data on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const forecastPromise = apiClient.get('/dashboard/shortage-forecast');
                const heatmapPromise = apiClient.get('/dashboard/heatmap');
                
                const [forecastRes, heatmapRes] = await Promise.all([forecastPromise, heatmapPromise]);
                
                setForecast(forecastRes.data.data);
                setHeatmapData(heatmapRes.data.data);

            } catch (error) {
                console.error("Failed to fetch initial dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch bridge donors when the selected blood group changes
    useEffect(() => {
        if (selectedBloodGroup) {
            setDonorsLoading(true);
            setBridgeDonors([]);
            apiClient.get(`/dashboard/find-bridge-donors?bloodGroup=${selectedBloodGroup}`)
                .then(res => setBridgeDonors(res.data.data))
                .catch(err => console.error("Failed to fetch bridge donors", err))
                .finally(() => setDonorsLoading(false));
        }
    }, [selectedBloodGroup]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Dashboard...</p></div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-red-600">Project Lifeline 🩸</h1>
                <p className="text-lg text-gray-600">The Smart Blood Supply Chain Dashboard</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-1 space-y-8">
                    {/* Blood Supply Forecast */}
                    <div className="p-6 bg-white rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">14-Day Blood Supply Forecast</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={forecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={60} interval={0} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#ef4444" name="Eligible Donors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Smart Bridge Donor Activation */}
                    <div className="p-6 bg-white rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Activate Bridge Donors</h2>
                        <p className="text-sm text-gray-500 mb-4">Find the most reliable donors to call for a specific need.</p>
                        <select
                            value={selectedBloodGroup}
                            onChange={(e) => setSelectedBloodGroup(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4 bg-white"
                        >
                            <option>A Positive</option><option>A Negative</option>
                            <option>B Positive</option><option>B Negative</option>
                            <option>AB Positive</option><option>AB Negative</option>
                            <option>O Positive</option><option>O Negative</option>
                        </select>
                        <div className="space-y-2 h-48 overflow-y-auto">
                           {donorsLoading ? <p className="text-gray-500 text-sm">Searching...</p> : 
                           (bridgeDonors.length > 0 ? bridgeDonors.map(donor => (
                               <li key={donor._id} className="p-2 bg-red-50 rounded-lg">
                                   <p className="font-semibold">Donor ID: {donor.userId}</p>
                                   <p className="text-sm text-green-700">Reliability: {Math.round(donor.callsToDonationsRatio * 100)}%</p>
                               </li>
                           )) : <p className="text-gray-500 text-sm">No eligible Bridge Donors found.</p>)}
                        </div>
                    </div>
                </div>

                {/* Geospatial Heatmap */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 min-h-[600px]">
                    <h2 className="text-xl font-bold mb-4">Live Donor Supply Heatmap</h2>
                    <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ height: '100%', width: '100%', minHeight: '550px', borderRadius: '1rem' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {heatmapData.map((point, idx) => (
                            <CircleMarker
                                key={idx}
                                center={[addJitter(point.location.coordinates[1]), addJitter(point.location.coordinates[0])]} 
                                radius={5}
                                pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5, stroke: false }}
                            >
                                <Popup>Blood Group: {point.bloodGroup}</Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default HackathonDashboard;
