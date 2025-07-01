import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Venues API
export const venuesApi = {
  getVenues: async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    area?: string;
    minCapacity?: number;
    maxCapacity?: number;
    minPrice?: number;
    maxPrice?: number;
    isAirConditioned?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get<ApiResponse<PaginatedResponse<any>>>('/venues', { params });
    return response.data;
  },

  getVenueById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/venues/${id}`);
    return response.data;
  },

  createVenue: async (venueData: any) => {
    const response = await api.post<ApiResponse<any>>('/venues', venueData);
    return response.data;
  },

  updateVenue: async (id: string, venueData: any) => {
    const response = await api.put<ApiResponse<any>>(`/venues/${id}`, venueData);
    return response.data;
  },

  deleteVenue: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/venues/${id}`);
    return response.data;
  },

  getVenueAvailability: async (id: string, startDate: string, endDate: string) => {
    const response = await api.get<ApiResponse<any>>(`/venues/${id}/availability`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

// Caterers API
export const caterersApi = {
  getCaterers: async (params?: {
    page?: number;
    limit?: number;
    serviceAreas?: string[];
    cuisine?: string[];
    minPrice?: number;
    maxPrice?: number;
    minimumOrder?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get<ApiResponse<PaginatedResponse<any>>>('/caterers', { params });
    return response.data;
  },

  getCatererById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/caterers/${id}`);
    return response.data;
  },

  createCaterer: async (catererData: any) => {
    const response = await api.post<ApiResponse<any>>('/caterers', catererData);
    return response.data;
  },

  updateCaterer: async (id: string, catererData: any) => {
    const response = await api.put<ApiResponse<any>>(`/caterers/${id}`, catererData);
    return response.data;
  },

  deleteCaterer: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/caterers/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookingsApi = {
  getBookings: async () => {
    const response = await api.get<ApiResponse<any[]>>('/bookings');
    return response.data;
  },

  createBooking: async (bookingData: any) => {
    const response = await api.post<ApiResponse<any>>('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id: string, bookingData: any) => {
    const response = await api.put<ApiResponse<any>>(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/bookings/${id}`);
    return response.data;
  },
};

// Contact API
export const contactApi = {
  submitContactForm: async (formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post<ApiResponse<any>>('/contact', formData);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get<ApiResponse<any>>('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get<ApiResponse<any[]>>('/admin/users');
    return response.data;
  },
};
