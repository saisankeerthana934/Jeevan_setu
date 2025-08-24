// import React, { useState, useEffect, useCallback } from 'react';
// import { Users, Activity, MapPin, Calendar, Plus, RefreshCw } from 'lucide-react';
// // CORRECTED: This import was the source of the "no token" error.
// // It now points to the correct apiClient that sends the login token.
// import apiClient from '../api/apiClient';

// interface Campaign {
//   _id: string;
//   title: string;
//   type: string;
//   startDate: string;
//   endDate: string;
//   location: {
//     city: string;
//     venue?: string;
//   };
//   targetParticipants: number;
//   actualParticipants: number;
//   bloodCollected: number;
//   status: string;
// }

// interface NGOStats {
//   totalCampaigns: number;
//   activeCampaigns: number;
//   totalVolunteers: number;
//   bloodUnitsCollected: number;
//   patientsHelped: number;
// }

// const NGODashboard: React.FC = () => {
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [stats, setStats] = useState<NGOStats>({
//     totalCampaigns: 0,
//     activeCampaigns: 0,
//     totalVolunteers: 0,
//     bloodUnitsCollected: 0,
//     patientsHelped: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       // Use the corrected apiClient for these calls
//       const [campaignsResponse, statsResponse] = await Promise.all([
//         apiClient.get('/ngos/campaigns'),
//         apiClient.get('/ngos/stats')
//       ]);

//       if (campaignsResponse.data.success) {
//         setCampaigns(campaignsResponse.data.data.campaigns);
//       }

//       if (statsResponse.data.success) {
//         setStats(statsResponse.data.data.statistics);
//       }
//     } catch (error) {
//       console.error('Error fetching NGO dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);


//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchDashboardData();
//     setRefreshing(false);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'planned': return 'bg-blue-100 text-blue-800';
//       case 'completed': return 'bg-gray-100 text-gray-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const dashboardStats = [
//     { label: 'Active Campaigns', value: stats.activeCampaigns.toString(), icon: Activity, color: 'bg-blue-600' },
//     { label: 'Total Volunteers', value: stats.totalVolunteers.toString(), icon: Users, color: 'bg-green-600' },
//     { label: 'Patients Helped', value: stats.patientsHelped.toString(), icon: Users, color: 'bg-purple-600' },
//     { label: 'Blood Units Collected', value: stats.bloodUnitsCollected.toString(), icon: Activity, color: 'bg-red-600' }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
//             <p className="text-gray-600 mt-1">Manage campaigns, volunteers, and community outreach</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//           >
//             <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//             <span>Refresh</span>
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {dashboardStats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex items-center">
//                 <div className={`${stat.color} p-3 rounded-lg`}>
//                   <stat.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                   <p className="text-sm text-gray-600">{stat.label}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-sm mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {[
//                 { id: 'overview', label: 'Overview' },
//                 { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
//                 { id: 'volunteers', label: 'Volunteers' },
//                 { id: 'reports', label: 'Reports' }
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setSelectedTab(tab.id)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                     selectedTab === tab.id
//                       ? 'border-blue-600 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {tab.label}
//                   {tab.count !== undefined && (
//                     <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
//                       selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
//                     }`}>
//                       {tab.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-6">
//             {selectedTab === 'overview' && (
//               <div className="grid lg:grid-cols-2 gap-8">
//                 {/* Recent Campaigns */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
//                     <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
//                       <Plus className="h-4 w-4" />
//                       <span>New Campaign</span>
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     {campaigns.slice(0, 3).map((campaign) => (
//                       <div key={campaign._id} className="border border-gray-200 rounded-lg p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-medium text-gray-900">{campaign.title}</h3>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
//                             {campaign.status}
//                           </span>
//                         </div>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           <p className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{formatDate(campaign.startDate)}</p>
//                           <p className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{campaign.location.city}</p>
//                           <p>{campaign.actualParticipants || 0} participants • {campaign.bloodCollected || 0} units collected</p>
//                         </div>
//                       </div>
//                     ))}
//                     {campaigns.length === 0 && (
//                       <div className="text-center py-6 text-gray-500">
//                         <Activity className="mx-auto h-8 w-8 mb-2" />
//                         <p>No campaigns yet. Create your first campaign!</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//                   <div className="space-y-3">
//                     <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                       <div className="flex items-center space-x-3">
//                         <div className="bg-red-100 p-2 rounded-full">
//                           <Plus className="h-5 w-5 text-red-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-gray-900">Create Blood Drive</h3>
//                           <p className="text-sm text-gray-600">Organize a new blood donation campaign</p>
//                         </div>
//                       </div>
//                     </button>
                    
//                     <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                       <div className="flex items-center space-x-3">
//                         <div className="bg-blue-100 p-2 rounded-full">
//                           <Users className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-gray-900">Recruit Volunteers</h3>
//                           <p className="text-sm text-gray-600">Add new volunteers to your team</p>
//                         </div>
//                       </div>
//                     </button>
                    
//                     <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//                       <div className="flex items-center space-x-3">
//                         <div className="bg-green-100 p-2 rounded-full">
//                           <Calendar className="h-5 w-5 text-green-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-gray-900">Schedule Awareness Program</h3>
//                           <p className="text-sm text-gray-600">Plan educational events for community</p>
//                         </div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {selectedTab === 'campaigns' && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
//                     <Plus className="h-4 w-4" />
//                     <span>New Campaign</span>
//                   </button>
//                 </div>
//                 {campaigns.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3>
//                     <p className="text-gray-600 mb-4">Start making an impact by creating your first campaign</p>
//                     <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
//                       Create Campaign
//                     </button>
//                   </div>
//                 ) : (
//                   campaigns.map((campaign) => (
//                     <div key={campaign._id} className="border border-gray-200 rounded-lg p-6">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
//                           <p className="text-gray-600 flex items-center mt-1">
//                             <MapPin className="h-4 w-4 mr-1" />
//                             {campaign.location.city}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
//                           </p>
//                         </div>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
//                           {campaign.status}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4 text-center mb-4">
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <p className="text-2xl font-bold text-gray-900">{campaign.actualParticipants || 0}</p>
//                           <p className="text-sm text-gray-600">Participants</p>
//                           <p className="text-xs text-gray-500">Target: {campaign.targetParticipants}</p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <p className="text-2xl font-bold text-red-600">{campaign.bloodCollected || 0}</p>
//                           <p className="text-sm text-gray-600">Units Collected</p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <p className="text-lg font-bold text-gray-900 capitalize">{campaign.type.replace('_', ' ')}</p>
//                           <p className="text-sm text-gray-600">Campaign Type</p>
//                         </div>
//                       </div>
//                       <div className="flex space-x-3">
//                         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
//                           Manage
//                         </button>
//                         <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//                           View Report
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {selectedTab === 'volunteers' && (
//               <div className="text-center py-12">
//                 <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Volunteer Management</h3>
//                 <p className="text-gray-600 mb-4">
//                   Volunteer management features will be available soon.
//                 </p>
//                 <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
//                   Add Volunteer
//                 </button>
//               </div>
//             )}

//             {selectedTab === 'reports' && (
//               <div className="text-center py-12">
//                 <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
//                 <p className="text-gray-600">
//                   Detailed reports and impact analytics will be available soon.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NGODashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Activity, Heart, Droplet, MapPin, Calendar, Plus, RefreshCw, Trash2, UserCheck } from 'lucide-react';
// import apiClient from '../api/apiClient';
// import CreateCampaignModal from '../components/CreateCampaignModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import ManageCampaignModal from '../components/ManageCampaignModal';
// import RecruitVolunteerModal from '../components/RecruitVolunteerModal';

// // --- DATA STRUCTURES ---
// interface Campaign {
//   _id: string;
//   title: string;
//   description?: string;
//   type: string;
//   startDate: string;
//   endDate: string;
//   location: { city: string; venue?: string; };
//   targetParticipants: number;
//   actualParticipants: number;
//   bloodCollected: number;
//   status: string;
//   outcomes?: { livesImpacted?: number };
// }

// interface NGOStats {
//   activeCampaigns: number;
//   totalVolunteers: number;
//   patientsHelped: number;
//   bloodUnitsCollected: number;
// }

// interface Volunteer {
//   _id: string;
//   volunteer: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   role: string;
//   joinedAt: string;
// }

// const NGODashboard: React.FC = () => {
//   // --- STATE MANAGEMENT ---
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
  
//   // Data State
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [stats, setStats] = useState<NGOStats | null>(null);
//   const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

//   // Modal State
//   const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
//   const [isRecruitModalOpen, setRecruitModalOpen] = useState(false);
//   const [campaignToRemove, setCampaignToRemove] = useState<Campaign | null>(null);
//   const [campaignToManage, setCampaignToManage] = useState<Campaign | null>(null);

//   // --- DATA FETCHING ---
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const [statsResponse, campaignsResponse] = await Promise.all([
//         apiClient.get('/ngos/stats'),
//         apiClient.get('/ngos/campaigns')
//       ]);
//       if (statsResponse.data.success) { setStats(statsResponse.data.data.statistics); }
//       if (campaignsResponse.data.success) { setCampaigns(campaignsResponse.data.data.campaigns); }
//     } catch (error) { console.error('Error fetching dashboard data:', error); }
//   }, []);

//   const fetchVolunteers = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/ngos/volunteers');
//       if (response.data.success) { setVolunteers(response.data.data.volunteers); }
//     } catch (error) { console.error('Error fetching volunteers:', error); }
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([fetchDashboardData(), fetchVolunteers()]).finally(() => setLoading(false));
//   }, [fetchDashboardData, fetchVolunteers]);

//   // --- EVENT HANDLERS ---
//   const handleCampaignCreated = () => { fetchDashboardData(); };
//   const handleCampaignUpdated = () => { fetchDashboardData(); };
//   const handleVolunteerAdded = () => {
//     fetchVolunteers();
//     fetchDashboardData();
//   };
//   const handleRemoveCampaign = async () => {
//     if (!campaignToRemove) return;
//     try {
//       await apiClient.delete(`/ngos/campaigns/${campaignToRemove._id}`);
//       setCampaignToRemove(null);
//       fetchDashboardData();
//     } catch (error) { console.error("Failed to delete campaign", error); }
//   };

//   // --- HELPER FUNCTIONS ---
//   const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'planned': return 'bg-blue-100 text-blue-800';
//       case 'completed': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-red-100 text-red-800';
//     }
//   };

//   const dashboardStats = [
//     { label: 'Active Campaigns', value: stats?.activeCampaigns ?? 0, icon: Activity, color: 'bg-blue-600' },
//     { label: 'Total Volunteers', value: stats?.totalVolunteers ?? 0, icon: Users, color: 'bg-green-600' },
//     { label: 'Patients Helped', value: stats?.patientsHelped ?? 0, icon: Heart, color: 'bg-purple-600' },
//     { label: 'Blood Units Collected', value: stats?.bloodUnitsCollected ?? 0, icon: Droplet, color: 'bg-red-600' }
//   ];

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-8 flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
//               <p className="text-gray-600 mt-1">Manage campaigns, volunteers, and community outreach</p>
//             </div>
//             <button onClick={fetchDashboardData} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><RefreshCw className="h-4 w-4" /><span>Refresh</span></button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {dashboardStats.map((stat, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="h-6 w-6 text-white" /></div><div className="ml-4"><p className="text-2xl font-bold text-gray-900">{stat.value}</p><p className="text-sm text-gray-600">{stat.label}</p></div></div></div>
//             ))}
//           </div>

//           <div className="bg-white rounded-lg shadow-sm mb-6">
//             <div className="border-b border-gray-200">
//               <nav className="flex space-x-8 px-6">
//                  {[ { id: 'overview', label: 'Overview' }, { id: 'campaigns', label: 'Campaigns', count: campaigns.length }, { id: 'volunteers', label: 'Volunteers', count: volunteers.length }, { id: 'reports', label: 'Reports' } ].map((tab) => (
//                   <button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
//                     {tab.label} {tab.count !== undefined && <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             <div className="p-6">
//               {/* Overview Tab */}
//               {selectedTab === 'overview' && (
//                 <div className="grid lg:grid-cols-2 gap-8">
//                    <div>
//                     <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /><span>New Campaign</span></button></div>
//                     <div className="space-y-4">
//                       {campaigns.length > 0 ? campaigns.slice(0, 3).map((campaign) => (
//                         <div key={campaign._id} className="border rounded-lg p-4">
//                            <div className="flex justify-between items-start mb-2">
//                             <h3 className="font-medium text-gray-900">{campaign.title}</h3>
//                             <div className="flex items-center space-x-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>{campaign.status}</span><button onClick={() => setCampaignToRemove(campaign)} className="text-red-400 hover:text-red-600" title="Delete Campaign"><Trash2 size={16} /></button></div>
//                           </div>
//                           <div className="text-sm text-gray-600 flex space-x-4"><p className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p><p className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" />{campaign.location.city}</p></div>
//                         </div>
//                       )) : <div className="text-center py-6 text-gray-500"><Activity className="mx-auto h-8 w-8 mb-2" /><p>No campaigns yet. Create your first campaign!</p></div>}
//                     </div>
//                   </div>
//                    <div>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//                     <div className="space-y-3">
//                        <button onClick={() => setCampaignModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-red-100 p-2 rounded-full"><Plus className="h-5 w-5 text-red-600" /></div><div><h3 className="font-medium text-gray-900">Create Blood Drive</h3><p className="text-sm text-gray-600">Organize a new blood donation campaign</p></div></div></button>
//                        <button onClick={() => setRecruitModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-blue-100 p-2 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div><div><h3 className="font-medium text-gray-900">Recruit Volunteers</h3><p className="text-sm text-gray-600">Add new volunteers to your team</p></div></div></button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Campaigns Tab */}
//               {selectedTab === 'campaigns' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Campaigns ({campaigns.length})</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /> <span>New Campaign</span></button></div>
//                   {campaigns.length === 0 ? <div className="text-center py-12"><Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3></div> : <div className="space-y-4">{campaigns.map((campaign) => (<div key={campaign._id} className="border border-gray-200 rounded-lg p-6"><div className="flex justify-between items-start mb-4"><div><h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3><p className="text-gray-600 flex items-center mt-1"><MapPin className="h-4 w-4 mr-1" /> {campaign.location.city}</p><p className="text-sm text-gray-500 mt-1">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p></div><span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(campaign.status)}`}>{campaign.status}</span></div><div className="grid grid-cols-3 gap-4 text-center mb-4 border-t pt-4"><div><p className="text-2xl font-bold">{campaign.actualParticipants || 0}</p><p className="text-sm text-gray-600">Participants</p></div><div><p className="text-2xl font-bold text-red-600">{campaign.bloodCollected || 0}</p><p className="text-sm text-gray-600">Units Collected</p></div><div><p className="text-lg font-bold capitalize">{campaign.type.replace('_', ' ')}</p><p className="text-sm text-gray-600">Type</p></div></div><div className="flex space-x-3"><button onClick={() => setCampaignToManage(campaign)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Manage</button><Link to={`/campaign-report/${campaign._id}`} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">View Report</Link><button onClick={() => setCampaignToRemove(campaign)} className="ml-auto text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"><Trash2 size={14} /> <span>Delete</span></button></div></div>))}</div>}
//                 </div>
//               )}

//               {/* Volunteers Tab */}
//               {selectedTab === 'volunteers' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Volunteers ({volunteers.length})</h2><button onClick={() => setRecruitModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><UserCheck className="h-4 w-4" /> <span>Recruit Volunteer</span></button></div>
//                   {volunteers.length === 0 ? <div className="text-center py-12 text-gray-500"><Users className="mx-auto h-12 w-12 mb-4 text-gray-400" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Yet</h3><p>Recruit volunteers to help with your campaigns.</p></div> : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{volunteers.map((v) => (<tr key={v._id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.volunteer.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.volunteer.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{v.role}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(v.joinedAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* --- MODALS --- */}
//       <CreateCampaignModal isOpen={isCampaignModalOpen} onClose={() => setCampaignModalOpen(false)} onSuccess={handleCampaignCreated} />
//       <RecruitVolunteerModal isOpen={isRecruitModalOpen} onClose={() => setRecruitModalOpen(false)} onSuccess={handleVolunteerAdded} />
//       <ConfirmationModal isOpen={!!campaignToRemove} onClose={() => setCampaignToRemove(null)} onConfirm={handleRemoveCampaign} title="Delete Campaign" message={`Are you sure you want to permanently delete the campaign "${campaignToRemove?.title}"?`} />
//       <ManageCampaignModal isOpen={!!campaignToManage} onClose={() => setCampaignToManage(null)} onSuccess={handleCampaignUpdated} campaign={campaignToManage} />
//     </>
//   );
// };

// export default NGODashboard;
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Activity, Heart, Droplet, MapPin, Calendar, Plus, RefreshCw, Trash2, UserCheck } from 'lucide-react';
// import apiClient from '../api/apiClient';
// import CreateCampaignModal from '../components/CreateCampaignModal';
// import ConfirmationModal from '../components/ConfirmationModal';
// import ManageCampaignModal from '../components/ManageCampaignModal';
// import RecruitVolunteerModal from '../components/RecruitVolunteerModal';


// // --- DATA STRUCTURES ---
// interface Campaign {
//   _id: string;
//   title: string;
//   description?: string;
//   type: string;
//   startDate: string;
//   endDate: string;
//   location: { city: string; venue?: string; };
//   targetParticipants: number;
//   actualParticipants: number;
//   bloodCollected: number;
//   status: string;
//   outcomes?: { livesImpacted?: number };
// }

// interface NGOStats {
//   activeCampaigns: number;
//   totalVolunteers: number;
//   patientsHelped: number;
//   bloodUnitsCollected: number;
// }

// interface Volunteer {
//   _id: string;
//   volunteer: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   role: string;
//   joinedAt: string;
// }

// const NGODashboard: React.FC = () => {
//   // --- STATE MANAGEMENT ---
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
  
//   // Data State
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [stats, setStats] = useState<NGOStats | null>(null);
//   const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

//   // Modal State
//   const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
//   const [isRecruitModalOpen, setRecruitModalOpen] = useState(false);
//   const [campaignToRemove, setCampaignToRemove] = useState<Campaign | null>(null);
//   const [campaignToManage, setCampaignToManage] = useState<Campaign | null>(null);

//   // --- DATA FETCHING ---
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const [statsResponse, campaignsResponse] = await Promise.all([
//         apiClient.get('/ngos/stats'),
//         apiClient.get('/ngos/campaigns')
//       ]);
//       if (statsResponse.data.success) { setStats(statsResponse.data.data.statistics); }
//       if (campaignsResponse.data.success) { setCampaigns(campaignsResponse.data.data.campaigns); }
//     } catch (error) { console.error('Error fetching dashboard data:', error); }
//   }, []);

//   const fetchVolunteers = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/ngos/volunteers');
//       if (response.data.success) { setVolunteers(response.data.data.volunteers); }
//     } catch (error) { console.error('Error fetching volunteers:', error); }
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([fetchDashboardData(), fetchVolunteers()]).finally(() => setLoading(false));
//   }, [fetchDashboardData, fetchVolunteers]);

//   // --- EVENT HANDLERS ---
//   const handleCampaignCreated = () => { fetchDashboardData(); };
//   const handleCampaignUpdated = () => { fetchDashboardData(); };
//   const handleVolunteerAdded = () => {
//     fetchVolunteers();
//     fetchDashboardData();
//   };
//   const handleRemoveCampaign = async () => {
//     if (!campaignToRemove) return;
//     try {
//       await apiClient.delete(`/ngos/campaigns/${campaignToRemove._id}`);
//       setCampaignToRemove(null);
//       fetchDashboardData();
//     } catch (error) { console.error("Failed to delete campaign", error); }
//   };

//   // --- HELPER FUNCTIONS ---
//   const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'planned': return 'bg-blue-100 text-blue-800';
//       case 'completed': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-red-100 text-red-800';
//     }
//   };

//   const dashboardStats = [
//     { label: 'Active Campaigns', value: stats?.activeCampaigns ?? 0, icon: Activity, color: 'bg-blue-600' },
//     { label: 'Total Volunteers', value: stats?.totalVolunteers ?? 0, icon: Users, color: 'bg-green-600' },
//     { label: 'Patients Helped', value: stats?.patientsHelped ?? 0, icon: Heart, color: 'bg-purple-600' },
//     { label: 'Blood Units Collected', value: stats?.bloodUnitsCollected ?? 0, icon: Droplet, color: 'bg-red-600' }
//   ];

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-8 flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
//               <p className="text-gray-600 mt-1">Manage campaigns, volunteers, and community outreach</p>
//             </div>
//             <button onClick={fetchDashboardData} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><RefreshCw className="h-4 w-4" /><span>Refresh</span></button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {dashboardStats.map((stat, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="h-6 w-6 text-white" /></div><div className="ml-4"><p className="text-2xl font-bold text-gray-900">{stat.value}</p><p className="text-sm text-gray-600">{stat.label}</p></div></div></div>
//             ))}
//           </div>

//           <div className="bg-white rounded-lg shadow-sm mb-6">
//             <div className="border-b border-gray-200">
//               <nav className="flex space-x-8 px-6">
//                  {[ { id: 'overview', label: 'Overview' }, { id: 'campaigns', label: 'Campaigns', count: campaigns.length }, { id: 'volunteers', label: 'Volunteers', count: volunteers.length }, { id: 'reports', label: 'Reports' } ].map((tab) => (
//                   <button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
//                     {tab.label} {tab.count !== undefined && <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             <div className="p-6">
//               {/* Overview Tab */}
//               {selectedTab === 'overview' && (
//                 <div className="grid lg:grid-cols-2 gap-8">
//                    <div>
//                     <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /><span>New Campaign</span></button></div>
//                     <div className="space-y-4">
//                       {campaigns.length > 0 ? campaigns.slice(0, 3).map((campaign) => (
//                         <div key={campaign._id} className="border rounded-lg p-4">
//                            <div className="flex justify-between items-start mb-2">
//                             <h3 className="font-medium text-gray-900">{campaign.title}</h3>
//                             <div className="flex items-center space-x-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>{campaign.status}</span><button onClick={() => setCampaignToRemove(campaign)} className="text-red-400 hover:text-red-600" title="Delete Campaign"><Trash2 size={16} /></button></div>
//                           </div>
//                           <div className="text-sm text-gray-600 flex space-x-4"><p className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p><p className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" />{campaign.location.city}</p></div>
//                         </div>
//                       )) : <div className="text-center py-6 text-gray-500"><Activity className="mx-auto h-8 w-8 mb-2" /><p>No campaigns yet. Create your first campaign!</p></div>}
//                     </div>
//                   </div>
//                    <div>
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//                     <div className="space-y-3">
//                        <button onClick={() => setCampaignModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-red-100 p-2 rounded-full"><Plus className="h-5 w-5 text-red-600" /></div><div><h3 className="font-medium text-gray-900">Create Blood Drive</h3><p className="text-sm text-gray-600">Organize a new blood donation campaign</p></div></div></button>
//                        <button onClick={() => setRecruitModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-blue-100 p-2 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div><div><h3 className="font-medium text-gray-900">Recruit Volunteers</h3><p className="text-sm text-gray-600">Add new volunteers to your team</p></div></div></button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Campaigns Tab */}
//               {selectedTab === 'campaigns' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Campaigns ({campaigns.length})</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /> <span>New Campaign</span></button></div>
//                   {campaigns.length === 0 ? <div className="text-center py-12"><Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3></div> : <div className="space-y-4">{campaigns.map((campaign) => (<div key={campaign._id} className="border border-gray-200 rounded-lg p-6"><div className="flex justify-between items-start mb-4"><div><h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3><p className="text-gray-600 flex items-center mt-1"><MapPin className="h-4 w-4 mr-1" /> {campaign.location.city}</p><p className="text-sm text-gray-500 mt-1">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p></div><span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(campaign.status)}`}>{campaign.status}</span></div><div className="grid grid-cols-3 gap-4 text-center mb-4 border-t pt-4"><div><p className="text-2xl font-bold">{campaign.actualParticipants || 0}</p><p className="text-sm text-gray-600">Participants</p></div><div><p className="text-2xl font-bold text-red-600">{campaign.bloodCollected || 0}</p><p className="text-sm text-gray-600">Units Collected</p></div><div><p className="text-lg font-bold capitalize">{campaign.type.replace('_', ' ')}</p><p className="text-sm text-gray-600">Type</p></div></div><div className="flex space-x-3"><button onClick={() => setCampaignToManage(campaign)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Manage</button><Link to={`/campaign-report/${campaign._id}`} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">View Report</Link><button onClick={() => setCampaignToRemove(campaign)} className="ml-auto text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"><Trash2 size={14} /> <span>Delete</span></button></div></div>))}</div>}
//                 </div>
//               )}

//               {/* Volunteers Tab */}
//               {selectedTab === 'volunteers' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Volunteers ({volunteers.length})</h2><button onClick={() => setRecruitModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><UserCheck className="h-4 w-4" /> <span>Recruit Volunteer</span></button></div>
//                   {volunteers.length === 0 ? <div className="text-center py-12 text-gray-500"><Users className="mx-auto h-12 w-12 mb-4 text-gray-400" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Yet</h3><p>Recruit volunteers to help with your campaigns.</p></div> : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{volunteers.map((v) => (<tr key={v._id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.volunteer.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.volunteer.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{v.role}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(v.joinedAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* --- MODALS --- */}
//       <CreateCampaignModal isOpen={isCampaignModalOpen} onClose={() => setCampaignModalOpen(false)} onSuccess={handleCampaignCreated} />
//       <RecruitVolunteerModal isOpen={isRecruitModalOpen} onClose={() => setRecruitModalOpen(false)} onSuccess={handleVolunteerAdded} />
//       <ConfirmationModal isOpen={!!campaignToRemove} onClose={() => setCampaignToRemove(null)} onConfirm={handleRemoveCampaign} title="Delete Campaign" message={`Are you sure you want to permanently delete the campaign "${campaignToRemove?.title}"?`} />
//       <ManageCampaignModal isOpen={!!campaignToManage} onClose={() => setCampaignToManage(null)} onSuccess={handleCampaignUpdated} campaign={campaignToManage} />
//     </>
//   );
// };

// export default NGODashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Heart, Droplet, MapPin, Calendar, Plus, RefreshCw, Trash2, UserCheck, Zap } from 'lucide-react';
import apiClient from '../api/apiClient';
import CreateCampaignModal from '../components/CreateCampaignModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ManageCampaignModal from '../components/ManageCampaignModal';
import RecruitVolunteerModal from '../components/RecruitVolunteerModal';
import AIStrategistModal from '../components/modals/AIStrategistModal';

// --- DATA STRUCTURES ---
interface Campaign {
  _id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  location: { city: string; venue?: string; };
  targetParticipants: number;
  actualParticipants: number;
  bloodCollected: number;
  status: string;
  outcomes?: { livesImpacted?: number };
}

interface NGOStats {
  activeCampaigns: number;
  totalVolunteers: number;
  patientsHelped: number;
  bloodUnitsCollected: number;
}

interface Volunteer {
  _id: string;
  volunteer: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
  joinedAt: string;
}
interface CampaignDraft {
  _id: string;
  aiGeneratedPlan: {
    campaignTitle: string;
    campaignDescription: string;
  };
}

const NGODashboard: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [drafts, setDrafts] = useState<CampaignDraft[]>([]);

  // Data State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<NGOStats | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // Modal State
  const [isCampaignModalOpen, setCampaignModalOpen] = useState(false);
  const [isRecruitModalOpen, setRecruitModalOpen] = useState(false);
  const [campaignToRemove, setCampaignToRemove] = useState<Campaign | null>(null);
  const [campaignToManage, setCampaignToManage] = useState<Campaign | null>(null);

  // --- DATA FETCHING ---
  const fetchDashboardData = useCallback(async () => {
    try {
        // --- ✅ FIX: ADD AUTH TOKEN ---
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsResponse, campaignsResponse] = await Promise.all([
            apiClient.get('/ngos/stats', config),
            apiClient.get('/ngos/campaigns', config)
        ]);
        if (statsResponse.data.success) { setStats(statsResponse.data.data.statistics); }
        if (campaignsResponse.data.success) { setCampaigns(campaignsResponse.data.data.campaigns); }
    } catch (error) { console.error('Error fetching dashboard data:', error); }
  }, []);
  
  const fetchVolunteers = useCallback(async () => {
    try {
        // --- ✅ FIX: ADD AUTH TOKEN ---
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await apiClient.get('/ngos/volunteers', config);
        if (response.data.success) { setVolunteers(response.data.data.volunteers); }
    } catch (error) { console.error('Error fetching volunteers:', error); }
  }, []);

  const fetchDrafts = useCallback(async () => {
    try {
        // --- ✅ FIX: ADD AUTH TOKEN ---
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await apiClient.get('/ngos/campaign-drafts', config);
        if (response.data.success) {
            setDrafts(response.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch drafts", error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboardData(), fetchVolunteers(), fetchDrafts()]).finally(() => setLoading(false));
  }, [fetchDashboardData, fetchVolunteers, fetchDrafts]);

  // --- EVENT HANDLERS ---
  const refreshAllData = () => {
    fetchDashboardData();
    fetchVolunteers();
    fetchDrafts();
  };
  const handleRemoveCampaign = async () => {
    if (!campaignToRemove) return;
    try {
        // --- ✅ FIX: ADD AUTH TOKEN ---
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await apiClient.delete(`/ngos/campaigns/${campaignToRemove._id}`, config);
        setCampaignToRemove(null);
        refreshAllData();
    } catch (error) { console.error("Failed to delete campaign", error); }
  };
  const handleApproveDraft = async (draftId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await apiClient.post(`/ngos/campaign-drafts/${draftId}/approve`, {}, config);
      alert(response.data.message);
      refreshAllData();
      setSelectedTab('campaigns'); // Switch to campaigns tab
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve draft.');
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const dashboardStats = [
    { label: 'Active Campaigns', value: stats?.activeCampaigns ?? 0, icon: Activity, color: 'bg-blue-600' },
    { label: 'Total Volunteers', value: stats?.totalVolunteers ?? 0, icon: Users, color: 'bg-green-600' },
    { label: 'Patients Helped', value: stats?.patientsHelped ?? 0, icon: Heart, color: 'bg-purple-600' },
    { label: 'Blood Units Collected', value: stats?.bloodUnitsCollected ?? 0, icon: Droplet, color: 'bg-red-600' }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header and Stats Grid */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage campaigns, volunteers, and community outreach</p>
            </div>
            <button onClick={refreshAllData} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><RefreshCw className="h-4 w-4" /><span>Refresh</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6"><div className="flex items-center"><div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="h-6 w-6 text-white" /></div><div className="ml-4"><p className="text-2xl font-bold text-gray-900">{stat.value}</p><p className="text-sm text-gray-600">{stat.label}</p></div></div></div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                  {[ { id: 'overview', label: 'Overview' }, { id: 'campaigns', label: 'Campaigns', count: campaigns.length }, { id: 'volunteers', label: 'Volunteers', count: volunteers.length } ].map((tab) => (
                  <button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab.label} {tab.count !== undefined && <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Campaign Drafts for Your Review</h2>
                    {drafts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No pending AI drafts.</p>
                    ) : (
                      <div className="space-y-4">
                        {drafts.map((draft) => (
                          <div key={draft._id} className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-purple-800">{draft.aiGeneratedPlan.campaignTitle}</h4>
                              <p className="text-sm text-purple-600">{draft.aiGeneratedPlan.campaignDescription}</p>
                            </div>
                            <button onClick={() => handleApproveDraft(draft._id)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">Approve</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /><span>New Campaign</span></button></div>
                        {/* Recent Campaigns List */}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                      <div className="space-y-3">
                        <button onClick={() => setIsAIModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-purple-100 p-2 rounded-full"><Zap className="h-5 w-5 text-purple-600" /></div><div><h3 className="font-medium text-gray-900">Create Campaign with AI</h3><p className="text-sm text-gray-600">Use AI to generate a complete campaign strategy</p></div></div></button>
                        <button onClick={() => setCampaignModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-red-100 p-2 rounded-full"><Plus className="h-5 w-5 text-red-600" /></div><div><h3 className="font-medium text-gray-900">Create Blood Drive</h3><p className="text-sm text-gray-600">Organize a new blood donation campaign</p></div></div></button>
                        <button onClick={() => setRecruitModalOpen(true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"><div className="flex items-center space-x-3"><div className="bg-blue-100 p-2 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div><div><h3 className="font-medium text-gray-900">Recruit Volunteers</h3><p className="text-sm text-gray-600">Add new volunteers to your team</p></div></div></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaigns Tab */}
              {selectedTab === 'campaigns' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Campaigns ({campaigns.length})</h2><button onClick={() => setCampaignModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><Plus className="h-4 w-4" /> <span>New Campaign</span></button></div>
                  {campaigns.length === 0 ? <div className="text-center py-12"><Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3></div> : <div className="space-y-4">{campaigns.map((campaign) => (<div key={campaign._id} className="border border-gray-200 rounded-lg p-6"><div className="flex justify-between items-start mb-4"><div><h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3><p className="text-gray-600 flex items-center mt-1"><MapPin className="h-4 w-4 mr-1" /> {campaign.location.city}</p><p className="text-sm text-gray-500 mt-1">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p></div><span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(campaign.status)}`}>{campaign.status}</span></div><div className="grid grid-cols-3 gap-4 text-center mb-4 border-t pt-4"><div><p className="text-2xl font-bold">{campaign.actualParticipants || 0}</p><p className="text-sm text-gray-600">Participants</p></div><div><p className="text-2xl font-bold text-red-600">{campaign.bloodCollected || 0}</p><p className="text-sm text-gray-600">Units Collected</p></div><div><p className="text-lg font-bold capitalize">{campaign.type.replace('_', ' ')}</p><p className="text-sm text-gray-600">Type</p></div></div><div className="flex space-x-3"><button onClick={() => setCampaignToManage(campaign)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Manage</button><Link to={`/campaign-report/${campaign._id}`} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">View Report</Link><button onClick={() => setCampaignToRemove(campaign)} className="ml-auto text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"><Trash2 size={14} /> <span>Delete</span></button></div></div>))}</div>}
                </div>
              )}

              {/* Volunteers Tab */}
              {selectedTab === 'volunteers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">All Volunteers ({volunteers.length})</h2><button onClick={() => setRecruitModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><UserCheck className="h-4 w-4" /> <span>Recruit Volunteer</span></button></div>
                  {volunteers.length === 0 ? <div className="text-center py-12 text-gray-500"><Users className="mx-auto h-12 w-12 mb-4 text-gray-400" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Volunteers Yet</h3><p>Recruit volunteers to help with your campaigns.</p></div> : <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{volunteers.map((v) => (<tr key={v._id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.volunteer.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.volunteer.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{v.role}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(v.joinedAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* --- MODALS --- */}
      <CreateCampaignModal isOpen={isCampaignModalOpen} onClose={() => setCampaignModalOpen(false)} onSuccess={refreshAllData} />
      <RecruitVolunteerModal isOpen={isRecruitModalOpen} onClose={() => setRecruitModalOpen(false)} onSuccess={refreshAllData} />
      <ConfirmationModal isOpen={!!campaignToRemove} onClose={() => setCampaignToRemove(null)} onConfirm={handleRemoveCampaign} title="Delete Campaign" message={`Are you sure you want to permanently delete the campaign "${campaignToRemove?.title}"?`} />
      <ManageCampaignModal isOpen={!!campaignToManage} onClose={() => setCampaignToManage(null)} onSuccess={refreshAllData} campaign={campaignToManage} />
      <AIStrategistModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onSuccess={refreshAllData} />
    </>
  );
};

export default NGODashboard;