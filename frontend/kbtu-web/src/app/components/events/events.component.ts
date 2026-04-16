import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Event, Category, EventSearch } from '../../interfaces';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  selectedCategory: number | null = null;
  onlyFree = false;
  completedFilter: string = 'all';
  Math = Math;

  private searchSubject = new Subject<void>();

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.loadEvents();
    });
  }

  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    let isCompleted: boolean | null = null;
    if (this.completedFilter === 'completed') isCompleted = true;
    else if (this.completedFilter === 'upcoming') isCompleted = false;

    const params: EventSearch = {
      query: this.searchQuery || undefined,
      category_id: this.selectedCategory,
      is_free: this.onlyFree,
      is_completed: isCompleted,
    };

    this.api.searchEvents(params).subscribe({
      next: (res) => {
        this.events = res.results;
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

  onSearch(): void {
    this.searchSubject.next();
  }

  onReset(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.onlyFree = false;
    this.completedFilter = 'all';
    this.searchSubject.next();
  }
}
