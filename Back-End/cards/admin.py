from django.contrib import admin
from .models import *

class CardsModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'owner')
admin.site.register(CardsModel, CardsModelAdmin)
