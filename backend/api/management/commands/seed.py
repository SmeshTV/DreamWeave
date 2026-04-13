from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from api.models import Category, Event, Review, UserProfile


class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create categories
        categories_data = [
            {'name': 'Lectures', 'description': 'Educational lectures and talks', 'icon': 'LEC'},
            {'name': 'Sports', 'description': 'Sports events and competitions', 'icon': 'SPT'},
            {'name': 'Music', 'description': 'Concerts and music events', 'icon': 'MUS'},
            {'name': 'Tech', 'description': 'Hackathons, workshops, tech meetups', 'icon': 'TEC'},
            {'name': 'Art', 'description': 'Exhibitions and creative workshops', 'icon': 'ART'},
            {'name': 'Social', 'description': 'Meetups and networking events', 'icon': 'SOC'},
        ]

        categories = []
        for data in categories_data:
            cat, created = Category.objects.get_or_create(name=data['name'], defaults=data)
            categories.append(cat)
            status = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status} category: {cat.name}')

        # Create demo user
        if not User.objects.filter(username='demo').exists():
            demo_user = User.objects.create_user(
                username='demo', email='demo@kbtu.kz', password='demo123'
            )
            UserProfile.objects.get_or_create(user=demo_user)
            self.stdout.write('  Created demo user (password: demo123)')
        else:
            demo_user = User.objects.get(username='demo')
            self.stdout.write('  Demo user exists')

        # Create events
        events_data = [
            {
                'title': 'Python Workshop for Beginners',
                'description': 'Learn the basics of Python programming. Perfect for first-year students.',
                'category': categories[3],
                'location': 'KBTU, Room 301',
                'date': timezone.now() + timedelta(days=3),
                'is_free': True,
            },
            {
                'title': 'KBTU Basketball Tournament',
                'description': 'Annual inter-faculty basketball championship. Register your team now!',
                'category': categories[1],
                'location': 'KBTU Sports Hall',
                'date': timezone.now() + timedelta(days=7),
                'is_free': True,
            },
            {
                'title': 'AI and Machine Learning Talk',
                'description': 'Guest lecturer from Google DeepMind will talk about latest AI research.',
                'category': categories[0],
                'location': 'KBTU, Main Hall',
                'date': timezone.now() + timedelta(days=5),
                'is_free': True,
            },
            {
                'title': 'Open Mic Night',
                'description': 'Showcase your talent! Sing, rap, play guitar - anything goes.',
                'category': categories[2],
                'location': 'KBTU Cafeteria',
                'date': timezone.now() + timedelta(days=10),
                'is_free': False,
            },
            {
                'title': 'Startup Weekend KBTU',
                'description': '48 hours to build a startup. Form a team, pitch ideas, win prizes.',
                'category': categories[5],
                'location': 'KBTU Innovation Hub',
                'date': timezone.now() + timedelta(days=14),
                'is_free': False,
            },
            {
                'title': 'Digital Art Exhibition',
                'description': 'Students showcase their digital art, 3D models, and animations.',
                'category': categories[4],
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
            status = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status} event: {event.title}')

        # Create a review
        if Review.objects.count() == 0 and Event.objects.count() > 0:
            first_event = Event.objects.first()
            Review.objects.create(
                event=first_event,
                author=demo_user,
                rating=5,
                comment='Amazing event! Learned so much.'
            )
            self.stdout.write('  Created sample review')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Categories: {Category.objects.count()}, '
            f'Events: {Event.objects.count()}, Reviews: {Review.objects.count()}'
        ))
