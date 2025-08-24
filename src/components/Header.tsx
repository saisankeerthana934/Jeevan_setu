// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart, Menu, X, LogOut, User } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import NotificationBell from './NotificationBell';

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const getDashboardPath = () => {
//     if (!user) return '/login';
//     switch (user.role) {
//       case 'patient': return '/patient-dashboard';
//       case 'doctor': return '/doctor-dashboard';
//       case 'ngo': return '/ngo-dashboard';
//       case 'donor': return '/donor-dashboard'; 
//       default: return '/';
//     }
//   };

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           <Link to="/" className="flex items-center space-x-2">
//             <Heart className="h-8 w-8 text-red-600" />
//             <span className="text-2xl font-bold text-gray-900">JeevanSetu</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
//               Home
//             </Link>
//             <Link to="/register-donor" className="text-gray-700 hover:text-blue-600 transition-colors">
//               Become Donor
//             </Link>
//             <Link to="/education" className="text-gray-700 hover:text-blue-600 transition-colors">
//               Education
//             </Link>
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <NotificationBell />
//                 <Link
//                   to={getDashboardPath()}
//                   className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   <User className="h-4 w-4" />
//                   <span>Dashboard</span>
//                 </Link>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">
//                     {user.name} ({user.role})
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Login
//               </Link>
//             )}
//           </nav>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-gray-200">
//             <div className="flex flex-col space-y-4">
//               <Link
//                 to="/"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/register-donor"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Become Donor
//               </Link>
//               <Link
//                 to="/education"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Education
//               </Link>
//               {user ? (
//                 <>
//                   <Link
//                     to={getDashboardPath()}
//                     className="text-gray-700 hover:text-blue-600 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Dashboard
//                   </Link>
//                   <div className="text-sm text-gray-600 py-2">
//                     Logged in as {user.name} ({user.role})
//                   </div>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="text-left text-gray-700 hover:text-red-600 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="text-blue-600 font-medium"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // This function handles the logout process
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // This function finds the correct dashboard path based on the user's role
  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'patient': return '/patient-dashboard';
      case 'doctor': return '/doctor-dashboard';
      case 'ngo': return '/ngo-dashboard';
      case 'donor': return '/donor-dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">JeevanSetu</span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/education" className="text-gray-700 hover:text-blue-600">Education</Link>
            
            {user ? (
              // --- Links for LOGGED-IN users ---
              <>
                <div className="h-6 border-l border-gray-300"></div>
                <NotificationBell />
                <Link to={getDashboardPath()} className="font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                  <User size={16} className="mr-1" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 flex items-center">
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              // --- Links for GUESTS (not logged in) ---
              <>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-blue-600">
                    <span>Register</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 py-1 w-48 z-50">
                    <Link to="/register-donor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      As a Donor
                    </Link>
                    <Link to="/register-patient" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      As a Patient
                    </Link>
                  </div>
                </div>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Login
                </Link>
              </>
            )}
          </nav>

          {/* --- Mobile Menu Button --- */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* --- Mobile Navigation --- */}
        {isMenuOpen && (
           <div className="md:hidden py-4 border-t border-gray-200">
             <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    <Link to={getDashboardPath()} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link to="/education" onClick={() => setIsMenuOpen(false)}>Education</Link>
                    <button onClick={handleLogout} className="text-left text-red-600 font-semibold">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/education" onClick={() => setIsMenuOpen(false)}>Education</Link>
                    <Link to="/register-donor" onClick={() => setIsMenuOpen(false)}>Register as Donor</Link>
                    <Link to="/register-patient" onClick={() => setIsMenuOpen(false)}>Register as Patient</Link>
                    <Link to="/login" className="font-bold text-blue-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </>
                )}
             </div>
           </div>
        )}
      </div>
    </header>
  );
};

export default Header;