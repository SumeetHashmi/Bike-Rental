export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface BikeDetails {
  id: string;
  bikeModel: string;
  bikeColor: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ratings {
  id: string;
  userId: string;
  bikeId: string;
  rating: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDates {
  id: string;
  bikeId: string;
  userId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtpVerifications {
  id: string;
  userId: string;
  otp: number;
  createdAt: string;
  updatedAt: string;
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Blocked = 'Blocked',
}

export enum UserTypes {
  Customer = 'Customer',
  Admin = 'Admin',
}
