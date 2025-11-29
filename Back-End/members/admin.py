from django.contrib import admin
from .models import *

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    #date_hierarchy = "pub_date"
    list_display = [
        "id", "username", "email", "phone_no", "is_staff", "is_active", "date_joined"
    ]
    list_filter = (
        'is_staff', 'is_active', 
    )
    fieldsets = (
        (None, {
            'fields': (
                'username', 'full_name', 'email', 'phone_no',
            )
        }),
        ('status', {
            'fields': ('is_active', 'is_staff')
        }),
    )