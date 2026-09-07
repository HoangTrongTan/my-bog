/**
 * Types & Interfaces for Expression View & Feedback Database Module
 */

export interface FeedbackItem {
  id: string;
  fullName: string;
  email: string;
  category: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackPayload {
  fullName: string;
  email?: string;
  category: string;
  rating: number;
  content: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  id?: string;
  message?: string;
}
