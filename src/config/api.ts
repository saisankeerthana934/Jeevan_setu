const API_BASE_URL = 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  users: {
    profile: '/users/profile',
  },
  donors: {
    list: '/donors',
    profile: '/donors/profile',
    register: '/donors/register',
    availability: '/donors/availability',
    donations: '/donors/donations',
    stats: '/donors/stats',
  },
  bloodRequests: {
    list: '/blood-requests',
    create: '/blood-requests',
    byId: (id: string) => `/blood-requests/${id}`,
    respond: (id: string) => `/blood-requests/${id}/respond`,
    status: (id: string) => `/blood-requests/${id}/status`,
  },
  doctors: {
    profile: '/doctors/profile',
    patients: '/doctors/patients',
    bloodRequests: '/doctors/blood-requests',
    stats: '/doctors/stats',
  },
  ngos: {
    profile: '/ngos/profile',
    campaigns: '/ngos/campaigns',
    volunteers: '/ngos/volunteers',
    stats: '/ngos/stats',
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    stats: '/notifications/stats',
  },
  education: {
    articles: '/education/articles',
    videos: '/education/videos',
    resources: '/education/resources',
    faqs: '/education/faqs',
  },
};