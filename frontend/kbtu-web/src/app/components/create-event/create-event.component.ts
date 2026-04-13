import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../interfaces';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  categories: Category[] = [];

  title = '';
  description = '';
  category = 0;
  location = '';
  date = '';
  time = '18:00';
  isFree = true;
  imageUrl = '';

  error: string | null = null;
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.description.trim() || !this.category || !this.date) {
      this.error = 'Please fill in all required fields';
      this.cdr.detectChanges();
      return;
    }

    this.error = null;
    this.loading = true;
    this.cdr.detectChanges();

    const eventDate = new Date(`${this.date}T${this.time}`);

    const eventData = {
      title: this.title,
      description: this.description,
      category: this.category,
      location: this.location,
      date: eventDate.toISOString(),
      is_free: this.isFree,
      image_url: this.imageUrl,
    };

    this.api.createEvent(eventData).subscribe({
      next: (event) => {
        this.loading = false;
        this.router.navigate(['/events', event.id]);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to create event';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
