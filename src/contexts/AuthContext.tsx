// import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import apiClient from '../api/apiClient'; // Import our new API client

// // Define the shape of your User object based on your backend's User model
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'patient' | 'donor' | 'doctor' | 'ngo';
//   bloodType?: string; // Corrected from ReactNode to string?
// }

// // Define the shape of the context value
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (credentials: any) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
// }

// // Create the context with a default undefined value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // AuthProvider component that will wrap your app
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
//   const [loading, setLoading] = useState(true);

//   // Effect to check for an existing token and fetch user data on app load
//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       if (token) {
//         try {
//           // The apiClient will automatically use the token from localStorage
//           const response = await apiClient.get('/auth/me');
//           setUser(response.data.data.user);
//         } catch (error) {
//           console.error('Session expired or token invalid', error);
//           localStorage.removeItem('authToken');
//           setToken(null);
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };
//     checkLoggedIn();
//   }, [token]);

//   // --- LOGIN FUNCTION ---
//   const login = async (credentials: any) => {
//     const response = await apiClient.post('/auth/login', credentials);
//     const { token, user } = response.data.data;
//     localStorage.setItem('authToken', token);
//     setToken(token);
//     setUser(user);
//   };

//   // --- REGISTER FUNCTION ---
//   const register = async (userData: any) => {
//     const response = await apiClient.post('/auth/register', userData);
//     const { token, user } = response.data.data;
//     localStorage.setItem('authToken', token);
//     setToken(token);
//     setUser(user);
//   };

//   // --- LOGOUT FUNCTION ---
//   const logout = () => {
//     localStorage.removeItem('authToken');
//     setToken(null);
//     setUser(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// // Custom hook to easily use the auth context in other components
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
import  { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../api/apiClient';

// Define the shape of your User object
interface User {
  _id: string;
  name: string;
  email: string;
  // --- 🔽 ADD THIS LINE 🔽 ---
  phone?: string; // Add the phone property
  role: 'patient' | 'donor' | 'doctor' | 'ngo';
  bloodType?: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is the custom hook that components will use.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// This is the main component that provides the context to your app.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const response = await apiClient.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Session token is invalid, logging out.', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const login = async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data.data || response.data;

    if (!token) {
      throw new Error("No token received from backend");
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const register = async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    const { token, user } = response.data.data || response.data;

    if (!token) {
      throw new Error("No token received from backend");
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}