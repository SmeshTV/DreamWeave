import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Event, Category } from '../../interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.api.getEvents().subscribe({
      next: (events) => {
        this.events = events.slice(0, 6);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Cannot connect to backend. Make sure server is running on port 8000.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading events:', err);
      }
    });

    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }
}
