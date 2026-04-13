import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Event, Review } from '../../interfaces';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  reviews: Review[] = [];
  loading = true;
  error: string | null = null;

  newRating = 5;
  newComment = '';
  reviewError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(id);
    this.loadReviews(id);
  }

  loadEvent(id: number): void {
    if (!id || isNaN(id)) {
      this.error = 'Invalid event ID';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.api.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Event not found';
        } else {
          this.error = 'Cannot connect to backend. Make sure server is running on port 8000.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReviews(eventId: number): void {
    this.api.getReviews(eventId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  submitReview(): void {
    if (!this.event || !this.newComment.trim()) return;
    this.reviewError = null;
    this.api.createReview(this.event.id, this.newRating, this.newComment).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newComment = '';
        this.newRating = 5;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.reviewError = err.error?.error || 'Failed to submit review';
        this.cdr.detectChanges();
      }
    });
  }
}
