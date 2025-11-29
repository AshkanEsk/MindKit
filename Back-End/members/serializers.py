from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from cards.models import CardsModel
from rest_framework.serializers import ImageField
import logging

logger = logging.getLogger(__name__)

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'full_name', 'phone_no', 'password', 'is_staff', 'is_active', 'date_joined']
        read_only_fields = ['id', 'is_staff', 'is_active', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user


    def validate_username(self, value):
        if value[0].isdigit():
            raise serializers.ValidationError('Format of selected Username is not acceptable')
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username has been taken')
        return value
    
    def validate_email(self, value):
        top_10_email_providers = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "aol.com",
            "hotmail.co.uk",
            "hotmail.fr",
            "msn.com",
            "yahoo.fr",
            "wanadoo.fr",
            "outlook.com"
        ]

        domain = value.split('@')[1]
        if domain not in top_10_email_providers:
            raise serializers.ValidationError('Email Provider is not acceptable.')
        return value

    def validate_phone_no(self, value):
        if not value.startswith('09') or len(value) != 11:
            raise serializers.ValidationError('Phone number is not in an acceptable format')
        return value


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        
        if user:  # and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")

class ChangePasswordSerializer(serializers.Serializer):
    user = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = data['user']
        password = data['password']
               
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        return data
