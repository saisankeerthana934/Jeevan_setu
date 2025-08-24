
import { Link } from 'react-router-dom';
import { Heart, UserPlus, ShieldPlus, Stethoscope, Building } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center mb-10">
        <Heart className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Join JeevanSetu
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose your role to create an account and get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Donor Registration Card */}
        <Link to="/register-donor" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
          <ShieldPlus className="mx-auto h-16 w-16 text-red-500 group-hover:scale-110 transition-transform" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-800">Register as a Donor</h3>
          <p className="mt-2 text-gray-500">Become a hero. Register to donate blood and save lives.</p>
        </Link>

        {/* Patient Registration Card */}
        <Link to="/register-patient" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
          <UserPlus className="mx-auto h-16 w-16 text-blue-500 group-hover:scale-110 transition-transform" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-800">Register as a Patient</h3>
          <p className="mt-2 text-gray-500">Create an account to manage your profile and request blood.</p>
        </Link>
        
        {/* Doctor Registration Card */}
        <Link to="/register-doctor" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
          <Stethoscope className="mx-auto h-16 w-16 text-green-500 group-hover:scale-110 transition-transform" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-800">Register as a Doctor</h3>
          <p className="mt-2 text-gray-500">Join our network of medical professionals to support patients.</p>
        </Link>
        
        {/* --- THIS LINK IS NOW CORRECTED --- */}
        <Link to="/register-ngo" className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all text-center">
          <Building className="mx-auto h-16 w-16 text-purple-500 group-hover:scale-110 transition-transform" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-800">Register an NGO</h3>
          <p className="mt-2 text-gray-500">Manage campaigns and connect with donors in your community.</p>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;