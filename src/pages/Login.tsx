
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';

type Role = 'patient' | 'doctor' | 'ngo' | 'donor'; // Added 'donor'

function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/'); 
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleButtonClass = (role: Role) => {
    return `flex-1 py-3 px-2 text-center text-sm font-semibold rounded-md transition-colors focus:outline-none ${
      selectedRole === role
        ? 'bg-red-600 text-white shadow-md'
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">I am a:</label>
            {/* --- UPDATED THIS SECTION --- */}
            <div className="flex space-x-2 mt-2">
              <button onClick={() => setSelectedRole('patient')} className={getRoleButtonClass('patient')}>Patient</button>
              <button onClick={() => setSelectedRole('donor')} className={getRoleButtonClass('donor')}>Donor</button>
              <button onClick={() => setSelectedRole('doctor')} className={getRoleButtonClass('doctor')}>Doctor</button>
              <button onClick={() => setSelectedRole('ngo')} className={getRoleButtonClass('ngo')}>NGO</button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"  className="sr-only">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import apiClient from '../api/apiClient';

// type Role = 'patient' | 'doctor' | 'ngo' | 'donor';

// function Login() {
//   const [selectedRole, setSelectedRole] = useState<Role>('patient');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (event: React.FormEvent) => {
//   event.preventDefault();
//   setError('');
//   setIsSubmitting(true);

//   try {
//     // 🔹 call backend login API
//     const response = await apiClient.post('/auth/login', {
//       email,
//       password,
//       role: selectedRole, // only if backend expects role
//     });

//     // 🔹 save token + user to localStorage
//     localStorage.setItem('token', response.data.token);
//     localStorage.setItem('user', JSON.stringify(response.data));

//     alert('Login successful!');
//     navigate('/'); // redirect after login
//   } catch (err: any) {
//     const errorMessage =
//       err.response?.data?.message || 'Login failed. Please check your credentials.';
//     setError(errorMessage);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   const getRoleButtonClass = (role: Role) => {
//     return `flex-1 py-3 px-2 text-center text-sm font-semibold rounded-md transition-colors focus:outline-none ${
//       selectedRole === role
//         ? 'bg-red-600 text-white shadow-md'
//         : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//     }`;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <Heart className="mx-auto h-12 w-12 text-red-500" />
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
//           <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
//         </div>

//         <div className="bg-white p-8 rounded-2xl shadow-lg">
//           <div className="mb-6">
//             <label className="text-sm font-medium text-gray-700">I am a:</label>
//             <div className="flex space-x-2 mt-2">
//               <button
//                 onClick={() => setSelectedRole('patient')}
//                 type="button"
//                 className={getRoleButtonClass('patient')}
//               >
//                 Patient
//               </button>
//               <button
//                 onClick={() => setSelectedRole('donor')}
//                 type="button"
//                 className={getRoleButtonClass('donor')}
//               >
//                 Donor
//               </button>
//               <button
//                 onClick={() => setSelectedRole('doctor')}
//                 type="button"
//                 className={getRoleButtonClass('doctor')}
//               >
//                 Doctor
//               </button>
//               <button
//                 onClick={() => setSelectedRole('ngo')}
//                 type="button"
//                 className={getRoleButtonClass('ngo')}
//               >
//                 NGO
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//             </div>

//             {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full justify-center rounded-lg bg-blue-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
//               >
//                 {isSubmitting ? 'Signing In...' : 'Sign In'}
//               </button>
//             </div>
//           </form>

//           <div className="text-center mt-4">
//             <Link
//               to="/forgot-password"
//               className="text-sm font-medium text-blue-600 hover:text-blue-500"
//             >
//               Forgot your password?
//             </Link>
//           </div>

//           <p className="mt-6 text-center text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
