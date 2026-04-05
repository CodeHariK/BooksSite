import { Timestamp } from 'firebase/firestore';

export interface Book {
  title: string;
  author: string;
  description?: string;
  coverImageUrl?: string;
  image: string; // Required for current UI
  price: number;
  originalPrice?: number;
  discount?: string;
  status: 'Available' | 'Out of Stock';
  createdAt: Timestamp | string;
  // Fields for PDP (Product Detail Page)
  summary?: string;
  pages?: number;
  dimensions?: string;
  releaseDate?: string;
  buttonText?: string;
}

export interface BookOrder {
  customerName: string;
  mobileNumber: string;
  city: string;
  bookId: string;
  bookTitle: string;
  status: 'Pending' | 'Contacted';
  createdAt: Timestamp | string;
}

export interface AuthorSubmission {
  authorName: string;
  email: string;
  phone: string;
  synopsis: string;
  manuscriptUrl?: string;
  status: 'Unread' | 'Under Review' | 'Rejected';
  createdAt: Timestamp | string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp | string;
}
