from django.urls import path
from .views import (
    EventListCreateView, EventDetailView,
    search_events, register_user,
    CategoryListCreateView, ReviewListCreateView, ProfileView
)

urlpatterns = [
    # Events - CRUD
    path('events/', EventListCreateView.as_view(), name='events-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    # Search
    path('events/search/', search_events, name='events-search'),

    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='categories-list'),

    # Reviews
    path('events/<int:event_id>/reviews/', ReviewListCreateView.as_view(), name='reviews-list'),

    # Profile
    path('profile/', ProfileView.as_view(), name='user-profile'),

    # Registration
    path('register/', register_user, name='user-register'),
]
