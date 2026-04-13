# KBTU Underground - Events Platform

> A web application for discovering, sharing, and reviewing events at KBTU University.

## Group Members

| Name | ID | Role |
|------|-----|------|
| Student 1 | XXXXXX | Full-stack (Angular + Django) |
| Student 2 | XXXXXX | Full-stack (Angular + Django) |
| Student 3 | XXXXXX | Full-stack (Angular + Django) |

## Tech Stack

- **Frontend**: Angular 21, TypeScript, CSS
- **Backend**: Django 5.1, Django REST Framework, SimpleJWT
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT (JSON Web Tokens)

## Project Description

KBTU Underground is a university events platform where students can:
- Browse upcoming events by category
- Create and manage their own events
- Write reviews and rate events
- Search and filter events
- Manage their user profile

---

## Requirements Coverage

### Frontend (Angular)

| Requirement | Status | Details |
|---|---|---|
| Interfaces & Services | ✅ | `src/app/interfaces/`, `src/app/services/api.service.ts` |
| 4+ click events triggering API | ✅ | Search events, submit review, create event, delete event, logout |
| 4+ form controls with [(ngModel)] | ✅ | Login (username, password), Create Event (title, description, category, date, etc.), Review (rating, comment), Profile (bio, telegram) |
| Basic CSS styling | ✅ | Custom CSS on all components |
| Routing with 3+ routes | ✅ | 6 routes: home, login, events, event-detail, create-event, profile |
| @for loop & @if conditional | ✅ | Used in all components (Angular 17+ syntax) |
| JWT auth + interceptor | ✅ | `jwt.interceptor.ts` + `auth.service.ts` + login/logout |
| Angular Service with HttpClient | ✅ | `api.service.ts` handles all API communication |
| Error handling | ✅ | Error messages displayed on all API failures |

### Backend (Django + DRF)

| Requirement | Status | Details |
|---|---|---|
| 4+ models | ✅ | Category, Event, Review, UserProfile |
| Custom model manager | ✅ | `PublishedEventManager` in models.py |
| 2+ ForeignKey relationships | ✅ | Event→Category, Event→User, Review→Event, Review→User, UserProfile→User |
| 2+ serializers.Serializer | ✅ | `UserRegistrationSerializer`, `EventSearchSerializer` |
| 2+ serializers.ModelSerializer | ✅ | `CategorySerializer`, `EventSerializer`, `ReviewSerializer`, `UserProfileSerializer` |
| 2+ Function-Based Views | ✅ | `search_events()`, `register_user()` |
| 2+ Class-Based Views | ✅ | `EventListCreateView`, `EventDetailView`, `CategoryListCreateView`, `ReviewListCreateView`, `ProfileView` |
| Token auth + login/logout | ✅ | SimpleJWT: `/api/token/`, `/api/token/refresh/` |
| Full CRUD for one model | ✅ | Events: List, Create, Read, Update, Delete |
| Link objects to request.user | ✅ | Events and Reviews auto-linked to authenticated user |
| CORS configured | ✅ | `django-cors-headers` allows localhost:4200 |
| Postman collection | ✅ | `KBTU_Underground.postman_collection.json` |

---

## Getting Started

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

**Demo credentials:**
- Username: `demo`
- Password: `demo123`

### Frontend Setup

```bash
cd frontend/kbtu-web
npm install
ng serve
```

The app will be available at `http://localhost:4200/`

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/token/` | No | Login (get JWT) |
| POST | `/api/token/refresh/` | No | Refresh token |
| POST | `/api/register/` | No | Register new user |
| GET | `/api/events/` | No | List all events |
| POST | `/api/events/` | Yes | Create event |
| GET | `/api/events/:id/` | No | Get event details |
| PUT | `/api/events/:id/` | Yes | Update event (owner) |
| DELETE | `/api/events/:id/` | Yes | Delete event (owner) |
| GET | `/api/events/search/` | No | Search/filter events |
| GET | `/api/categories/` | No | List categories |
| GET | `/api/events/:id/reviews/` | No | List reviews |
| POST | `/api/events/:id/reviews/` | Yes | Create review |
| GET | `/api/profile/` | Yes | Get profile |
| PUT | `/api/profile/` | Yes | Update profile |

---

## Project Structure

```
Lab11/
├── backend/
│   ├── kbtu_backend/       # Django project settings
│   ├── api/                # Main app
│   │   ├── models.py       # 4 models + custom manager
│   │   ├── serializers.py  # 2 Serializer + 4 ModelSerializer
│   │   ├── views.py        # 2 FBV + 5 CBV
│   │   ├── urls.py         # API routes
│   │   ├── admin.py        # Admin registration
│   │   └── management/commands/seed.py
│   ├── manage.py
│   ├── requirements.txt
│   └── KBTU_Underground.postman_collection.json
└── frontend/
    └── kbtu-web/
        └── src/app/
            ├── interfaces/     # TypeScript interfaces
            ├── services/       # API & Auth services
            ├── interceptors/   # JWT HTTP interceptor
            └── components/     # 7 components
                ├── navbar/
                ├── home/
                ├── login/
                ├── events/
                ├── event-detail/
                ├── create-event/
                └── profile/
```
