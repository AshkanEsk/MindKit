from django.urls import path
from .views import CardEditView, CardReviewView, NewCardView

urlpatterns = [
    path('newcategory/', NewCardView.as_view(), name='new-category'),
    path('edit/<int:categoryid>/', CardEditView.as_view(), name='cardeditview'),
    #path('edit/card/<int:cardid>/', CardEditView.as_view(), name='cardeditview'),
    path('review/<int:categoryid>/', CardReviewView.as_view(), name='cardreviewview'),
]