from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('members.urls')),
    path('cards/', include('cards.urls')),
    #path('api/', include('APIs.urls')),
    
]