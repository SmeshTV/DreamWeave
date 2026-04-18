import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile, Review } from '../../interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  userReviews: Review[] = [];
  loading = true;
  error: string | null = null;
  reviewsLoading = true;

  isEditing = false;
  editBio = '';
  editTelegram = '';

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadUserReviews();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.api.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editBio = profile.bio || '';
        this.editTelegram = profile.telegram_id || '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Cannot connect to backend. Make sure server is running on port 8000.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadUserReviews(): void {
    this.reviewsLoading = true;
    this.cdr.detectChanges();

    this.api.getUserReviews().subscribe({
      next: (reviews) => {
        this.userReviews = reviews;
        this.reviewsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.reviewsLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(): void {
    this.isEditing = true;
    if (this.profile) {
      this.editBio = this.profile.bio || '';
      this.editTelegram = this.profile.telegram_id || '';
    }
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    if (!this.profile) return;
    this.api.updateProfile({
      bio: this.editBio,
      telegram_id: this.editTelegram
    }).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.isEditing = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to update profile';
        this.cdr.detectChanges();
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.cdr.detectChanges();
  }
}
