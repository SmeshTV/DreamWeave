import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EventsComponent } from './components/events/events.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'events', component: EventsComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
