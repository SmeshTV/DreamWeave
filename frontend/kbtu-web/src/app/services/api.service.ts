import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Category, Review, UserProfile, AuthTokens, EventSearch } from '../interfaces';

const API_URL = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // --- Auth ---
  login(username: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${API_URL}/token/`, { username, password });
  }

  refreshToken(refresh: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${API_URL}/token/refresh/`, { refresh });
  }

  register(username: string, email: string, password: string, passwordConfirm: string): Observable<any> {
    return this.http.post(`${API_URL}/register/`, { username, email, password, password_confirm: passwordConfirm });
  }

  // --- Events (CRUD) ---
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/events/`);
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${API_URL}/events/${id}/`);
  }

  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${API_URL}/events/`, eventData);
  }

  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${API_URL}/events/${id}/`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/events/${id}/`);
  }

  searchEvents(params: EventSearch): Observable<any> {
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.category_id) httpParams = httpParams.set('category_id', params.category_id.toString());
    if (params.is_free !== null && params.is_free !== undefined) httpParams = httpParams.set('is_free', params.is_free.toString());
    if (params.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params.date_to) httpParams = httpParams.set('date_to', params.date_to);
    if (params.is_completed !== null && params.is_completed !== undefined) httpParams = httpParams.set('is_completed', params.is_completed.toString());
    return this.http.get(`${API_URL}/events/search/`, { params: httpParams });
  }

  // --- Categories ---
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/categories/`);
  }

  // --- Reviews ---
  getReviews(eventId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_URL}/events/${eventId}/reviews/`);
  }

  createReview(eventId: number, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`${API_URL}/events/${eventId}/reviews/`, { rating, comment });
  }

  // --- Profile ---
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URL}/profile/`);
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API_URL}/profile/`, data);
  }
  getUserReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_URL}/profile/reviews/`);
  }
}
