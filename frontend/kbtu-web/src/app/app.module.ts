import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// Components
import { App } from './app';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EventsComponent } from './components/events/events.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    EventsComponent,
    EventDetailComponent,
    CreateEventComponent,
    ProfileComponent
  ],
  providers: [
    provideHttpClient(withInterceptors([JwtInterceptor])),
    provideRouter(routes)
  ],
  bootstrap: [App]
})
export class AppModule { }
