from django.contrib import admin
from .models import Category, Event, Review, UserProfile

admin.site.register(Category)
admin.site.register(Event)
admin.site.register(Review)
admin.site.register(UserProfile)
