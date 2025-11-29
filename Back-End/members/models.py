from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class CustomUser(AbstractUser):
    GENDER_CHOICES = [
    ("M", "Male"),
    ("F", "Female")
    ]
    
    username = models.CharField(max_length=50, unique=True, verbose_name='Username')
    email = models.EmailField(unique=True, verbose_name='Email Address')
    full_name = models.CharField(max_length=50, verbose_name='Full Name')
    phone_no = models.CharField(max_length=11, verbose_name='Phone Number')
    #profile_image = models.ImageField(verbose_name='Profile Image', upload_to='profile_images/', null=True, blank=True)
    last_login = models.DateTimeField(auto_now=True)
    gender = models.CharField(max_length=3, choices=GENDER_CHOICES, default="M")

    groups = models.ManyToManyField(Group, related_name='custom_user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name', 'phone_no']

    def __str__(self):
        return self.username
