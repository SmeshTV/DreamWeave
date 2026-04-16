from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Event, Review, UserProfile


# --- ModelSerializers (2+) ---

class CategorySerializer(serializers.ModelSerializer):
    events_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'created_at', 'events_count']

    def get_events_count(self, obj):
        return obj.events.count()


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'event', 'author', 'author_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['author', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    reviews_count = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'location', 'date', 'image_url', 'is_free',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'reviews_count', 'avg_rating', 'is_completed'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_avg_rating(self, obj):
        from django.db.models import Avg
        result = obj.reviews.aggregate(avg=Avg('rating'))
        return result['avg']

    def get_is_completed(self, obj):
        from django.utils import timezone
        return obj.date < timezone.now()

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'email', 'telegram_id', 'bio', 'avatar_url', 'created_at']
        read_only_fields = ['user', 'created_at']


# --- Standard Serializers (2+) ---

class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration (not ModelSerializer)"""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


class EventSearchSerializer(serializers.Serializer):
    """Serializer for event search/filter (not ModelSerializer)"""
    query = serializers.CharField(required=False, allow_blank=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    is_free = serializers.BooleanField(required=False, allow_null=True)
    date_from = serializers.DateField(required=False, allow_null=True)
    date_to = serializers.DateField(required=False, allow_null=True)
    is_completed = serializers.BooleanField(required=False, allow_null=True)
