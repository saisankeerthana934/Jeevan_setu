import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Droplet, Flag, Printer } from 'lucide-react';
import apiClient from '../api/apiClient';

// Define the shape of the campaign data
interface Campaign {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: { city: string; venue?: string; address?: string; };
  status: string;
  targetParticipants: number;
  actualParticipants: number;
  bloodCollected: number;
}

const CampaignReport: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/ngos/campaigns/${campaignId}`);
        if (response.data.success) {
          setCampaign(response.data.data.campaign);
        }
      } catch (err: any) {
        setError('Failed to fetch campaign details.');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  if (loading) return <div className="text-center p-10">Loading report...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;
  if (!campaign) return <div className="text-center p-10">Campaign not found.</div>;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link to="/ngo-dashboard" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
            <p className="text-lg text-gray-500 capitalize mt-1">{campaign.type.replace('_', ' ')} Campaign</p>
          </div>
          <button onClick={() => window.print()} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>

        <div className="border-t my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Campaign Summary</h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center"><Calendar size={16} className="mr-3 text-gray-400" /><strong>Duration:</strong> {formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}</p>
              <p className="flex items-center"><MapPin size={16} className="mr-3 text-gray-400" /><strong>Location:</strong> {campaign.location.city}</p>
              <p className="flex items-center"><Flag size={16} className="mr-3 text-gray-400" /><strong>Status:</strong> <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">{campaign.status}</span></p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center"><Users size={16} className="mr-3 text-gray-400" /><strong>Participants:</strong> {campaign.actualParticipants} / {campaign.targetParticipants}</p>
              <p className="flex items-center"><Droplet size={16} className="mr-3 text-gray-400" /><strong>Blood Units Collected:</strong> {campaign.bloodCollected}</p>
            </div>
          </div>
        </div>

        {campaign.description && (
          <>
            <div className="border-t my-6"></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignReport;