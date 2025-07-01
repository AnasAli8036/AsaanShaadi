// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR'
}

// Venue Types
export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  area: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
  isAirConditioned: boolean;
  amenities: string[];
  images: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Caterer Types
export interface Caterer {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  serviceAreas: string[];
  pricePerPerson: number;
  minimumOrder: number;
  specialties: string[];
  images: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  venueId?: string;
  catererId?: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  guestCount: number;
  eventType: EventType;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventType {
  WEDDING = 'WEDDING',
  ENGAGEMENT = 'ENGAGEMENT',
  MEHNDI = 'MEHNDI',
  RECEPTION = 'RECEPTION',
  BIRTHDAY = 'BIRTHDAY',
  CORPORATE = 'CORPORATE',
  OTHER = 'OTHER'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED'
}

// Search and Filter Types
export interface VenueSearchFilters {
  city?: string;
  area?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  isAirConditioned?: boolean;
  amenities?: string[];
  eventDate?: Date;
  sortBy?: 'price' | 'rating' | 'capacity' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CatererSearchFilters {
  serviceAreas?: string[];
  cuisine?: string[];
  minPrice?: number;
  maxPrice?: number;
  minimumOrder?: number;
  eventDate?: Date;
  sortBy?: 'price' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface BookingForm {
  venueId?: string;
  catererId?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  eventType: EventType;
  specialRequests?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  venueId?: string;
  catererId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
  };
}
