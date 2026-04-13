from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    """Event category model"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, default='📌')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Event(models.Model):
    """Event model - main content"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    location = models.CharField(max_length=200, blank=True)
    date = models.DateTimeField()
    image_url = models.URLField(blank=True, default='')
    is_free = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class Review(models.Model):
    """User review for an event"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['event', 'author']

    def __str__(self):
        return f'Review by {self.author.username} on {self.event.title}'


class UserProfile(models.Model):
    """Extended user profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    telegram_id = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Profile of {self.user.username}'


# Custom manager for Event
class PublishedEventManager(models.Manager):
    """Custom manager that returns only future events"""
    def get_queryset(self):
        from django.utils import timezone
        return super().get_queryset().filter(date__gte=timezone.now())
