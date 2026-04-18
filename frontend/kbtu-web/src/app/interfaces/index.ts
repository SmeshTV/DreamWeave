export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
  events_count?: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  location: string;
  date: string;
  end_date: string | null;
  image_url: string;
  is_free: boolean;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  reviews_count: number;
  avg_rating: number | null;
  is_completed: boolean;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface Review {
  id: number;
  event: number;
  event_title?: string;
  author: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user: number;
  username: string;
  email: string;
  telegram_id: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface EventSearch {
  query?: string;
  category_id?: number | null;
  is_free?: boolean | null;
  date_from?: string | null;
  date_to?: string | null;
  is_completed?: boolean | null;
}
