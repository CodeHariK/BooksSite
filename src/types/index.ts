import { Timestamp } from 'firebase/firestore';

export type AuthorStatus = 'Ok' | 'pending' | 'NO';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  isAdmin: boolean;
  authorStatus: AuthorStatus;
  bio?: string;
  imageUrl?: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface Book {
  id?: string;
  title: string;
  author: string; // The display name of the author
  authorId: string; // Link to user.uid
  description?: string;
  coverImageUrl?: string;
  image: string; // URL to storage or legacy temp_assets
  price: number;
  originalPrice?: number;
  discount?: string;
  status: 'Available' | 'Out of Stock';
  createdAt: Timestamp | string;
  isPublished: boolean;
  isBestSeller?: boolean;
  isComingSoon?: boolean;
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
  userId: string;
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
