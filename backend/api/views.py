from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q, Avg

from .models import Category, Event, Review, UserProfile
from .serializers import (
    CategorySerializer, EventSerializer, ReviewSerializer,
    UserProfileSerializer, UserRegistrationSerializer, EventSearchSerializer,
    ReviewWithEventSerializer
)


# ==================== Class-Based Views (2+) ====================

class EventListCreateView(APIView):
    """CBV: List all events or create a new event"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetailView(APIView):
    """CBV: Get, update, or delete a single event"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return None

    def get(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        if event.created_by != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(event, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self.get_object(pk)
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        if event.created_by != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        event.delete()
        return Response({'message': 'Event deleted'}, status=status.HTTP_204_NO_CONTENT)


# ==================== Function-Based Views (2+) ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def search_events(request):
    """FBV: Search and filter events"""
    serializer = EventSearchSerializer(data=request.query_params)
    serializer.is_valid(raise_exception=True)

    events = Event.objects.all()
    data = serializer.validated_data

    if data.get('query'):
        events = events.filter(
            Q(title__icontains=data['query']) | Q(description__icontains=data['query'])
        )
    if data.get('category_id'):
        events = events.filter(category_id=data['category_id'])
    if data.get('is_free') is not None:
        events = events.filter(is_free=data['is_free'])
    if data.get('date_from'):
        events = events.filter(date__gte=data['date_from'])
    if data.get('date_to'):
        events = events.filter(date__lte=data['date_to'])
    if data.get('is_completed') is not None:
        from django.utils import timezone
        if data['is_completed']:
            events = events.filter(date__lt=timezone.now())
        else:
            events = events.filter(date__gte=timezone.now())

    output_serializer = EventSerializer(events, many=True, context={'request': request})
    return Response({'count': len(output_serializer.data), 'results': output_serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_user(request):
    """FBV: Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== Additional CRUD Views ====================

class CategoryListCreateView(APIView):
    """CBV: List/create categories"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewListCreateView(APIView):
    """CBV: List/create reviews for an event"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, event_id):
        reviews = Review.objects.filter(event_id=event_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, event_id):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        if Review.objects.filter(event=event, author=request.user).exists():
            return Response({'error': 'You already reviewed this event'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(event=event, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """CBV: Get/update current user profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserReviewsView(APIView):
    """CBV: Get current user's reviews (attended events)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(author=request.user).select_related('event')
        serializer = ReviewWithEventSerializer(reviews, many=True)
        return Response(serializer.data)
