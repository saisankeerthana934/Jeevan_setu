import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MapPin, Shield, Phone, Clock } from 'lucide-react';
import apiClient from '../api/apiClient';
import ContactUsModal from '../components/ContactUsModal';
 // Add this line

// This interface defines the shape of the stats data we expect from the API
interface LiveStats {
  registeredDonors: number;
  livesSaved: number;
  citiesCovered: number;
  successRate: number;
}

const HomePage: React.FC = () => {
  // State to hold live stats from the backend
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  // State to control the visibility of the contact modal
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  // This useEffect hook fetches the stats from the backend when the page loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/public/stats');
        if (response.data.success) {
          setLiveStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch homepage stats:", error);
        // Set default stats on error so the page doesn't look broken
        setLiveStats({ registeredDonors: 0, livesSaved: 0, citiesCovered: 0, successRate: 0 });
      }
    };

    fetchStats();
  }, []);

  // This array is now built dynamically using the liveStats state
  const stats = [
    { icon: Users, label: 'Registered Donors', value: `${liveStats?.registeredDonors.toLocaleString() ?? '... '}+` },
    { icon: Heart, label: 'Lives Saved', value: `${liveStats?.livesSaved.toLocaleString() ?? '... '}+` },
    { icon: MapPin, label: 'Cities Covered', value: `${liveStats?.citiesCovered ?? '... '}+` },
    { icon: Shield, label: 'Success Rate', value: `${liveStats?.successRate ?? '... '}%` }
  ];

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Connecting Lives Through 
                  <span className="text-red-400"> Blood Donation</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                  JeevanSetu bridges the gap between Thalassemia patients and life-saving blood donors, 
                  creating a network of hope and support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register-donor"
                    className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Become a Donor
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-center"
                  >
                    Request Blood
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Medical care"
                  className="rounded-2xl shadow-2xl"
                />
                <button 
                  onClick={() => setContactModalOpen(true)}
                  className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">24/7 Support</p>
                      <p className="text-gray-600">Emergency helpline</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How JeevanSetu Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform uses advanced matching algorithms to connect patients with compatible donors quickly and efficiently.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Users className="h-10 w-10 text-white" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Register as Donor</h3>
                <p className="text-gray-600 leading-relaxed">Quick and easy registration process with blood type verification and location details.</p>
              </div>
              <div className="text-center">
                <div className="bg-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Heart className="h-10 w-10 text-white" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
                <p className="text-gray-600 leading-relaxed">AI-powered system matches patients with compatible donors based on location and availability.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Clock className="h-10 w-10 text-white" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Alerts</h3>
                <p className="text-gray-600 leading-relaxed">Instant notifications ensure donors and patients are connected when time matters most.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Life-Saving Community</h2>
            <p className="text-xl text-blue-100 mb-8">Every donation counts. Every connection saves a life. Be part of the solution.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register-donor" className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105">Start Donating Today</Link>
              <Link to="/education" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300">Learn About Thalassemia</Link>
            </div>
          </div>
        </section>
      </div>

      <ContactUsModal 
        isOpen={isContactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
        
    </>
  );
};

export default HomePage;