"""
Seed script to populate database with initial data.
Run: python manage.py shell < api/seed.py
"""
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from api.models import Category, Event, Review, UserProfile

# Create categories
categories_data = [
    {'name': 'Lectures', 'description': 'Educational lectures and talks', 'icon': '🎓'},
    {'name': 'Sports', 'description': 'Sports events and competitions', 'icon': '⚽'},
    {'name': 'Music', 'description': 'Concerts and music events', 'icon': '🎵'},
    {'name': 'Tech', 'description': 'Hackathons, workshops, tech meetups', 'icon': '💻'},
    {'name': 'Art', 'description': 'Exhibitions and creative workshops', 'icon': '🎨'},
    {'name': 'Social', 'description': 'Meetups and networking events', 'icon': '🤝'},
]

categories = []
for data in categories_data:
    cat, created = Category.objects.get_or_create(name=data['name'], defaults=data)
    categories.append(cat)
    print(f'{"Created" if created else "Exists"} category: {cat.name}')

# Create demo user
if not User.objects.filter(username='demo').exists():
    demo_user = User.objects.create_user(username='demo', email='demo@kbtu.kz', password='demo123')
    UserProfile.objects.get_or_create(user=demo_user)
    print('Created demo user (password: demo123)')
else:
    demo_user = User.objects.get(username='demo')
    print('Demo user exists')

# Create events
events_data = [
    {
        'title': 'Python Workshop for Beginners',
        'description': 'Learn the basics of Python programming. Perfect for first-year students.',
        'category': categories[3],  # Tech
        'location': 'KBTU, Room 301',
        'date': timezone.now() + timedelta(days=3),
        'is_free': True,
    },
    {
        'title': 'KBTU Basketball Tournament',
        'description': 'Annual inter-faculty basketball championship. Register your team now!',
        'category': categories[1],  # Sports
        'location': 'KBTU Sports Hall',
        'date': timezone.now() + timedelta(days=7),
        'is_free': True,
    },
    {
        'title': 'AI & Machine Learning Talk',
        'description': 'Guest lecturer from Google DeepMind will talk about latest AI research.',
        'category': categories[0],  # Lectures
        'location': 'KBTU, Main Hall',
        'date': timezone.now() + timedelta(days=5),
        'is_free': True,
    },
    {
        'title': 'Open Mic Night',
        'description': 'Showcase your talent! Sing, rap, play guitar - anything goes.',
        'category': categories[2],  # Music
        'location': 'KBTU Cafeteria',
        'date': timezone.now() + timedelta(days=10),
        'is_free': False,
    },
    {
        'title': 'Startup Weekend KBTU',
        'description': '48 hours to build a startup. Form a team, pitch ideas, win prizes.',
        'category': categories[5],  # Social
        'location': 'KBTU Innovation Hub',
        'date': timezone.now() + timedelta(days=14),
        'is_free': False,
    },
    {
        'title': 'Digital Art Exhibition',
        'description': 'Students showcase their digital art, 3D models, and animations.',
        'category': categories[4],  # Art
        'location': 'KBTU Gallery',
        'date': timezone.now() + timedelta(days=8),
        'is_free': True,
    },
]

for data in events_data:
    event, created = Event.objects.get_or_create(
        title=data['title'],
        defaults={**data, 'created_by': demo_user}
    )
    print(f'{"Created" if created else "Exists"} event: {event.title}')

# Create reviews
if Review.objects.count() == 0:
    Review.objects.create(
        event=Event.objects.first(),
        author=demo_user,
        rating=5,
        comment='Amazing event! Learned so much about Python.'
    )
    print('Created sample review')

print('\n✅ Database seeded successfully!')
print(f'Total categories: {Category.objects.count()}')
print(f'Total events: {Event.objects.count()}')
print(f'Total reviews: {Review.objects.count()}')
