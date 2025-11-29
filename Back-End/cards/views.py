from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CardEditSerializer, CategorySerializer, SameCategoryCardsSerializer
from .models import CardsModel, CardsCategoryModel
import random
    
class CardEditView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryid):
        try:
            if categoryid == 0:
                categories = CardsCategoryModel.objects.filter(owner=request.user).values()
                return Response({
                    'categories': [{'id': cat.id, 'title': cat.title} for cat in categories]
                }, status=status.HTTP_200_OK)
            category = CardsCategoryModel.objects.get(pk=categoryid, owner=request.user)
            cards = CardsModel.objects.filter(category=category, owner=request.user)
            serializer = CardEditSerializer(cards, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except CardsCategoryModel.DoesNotExist:
            return Response(
                {'message': f'Category with ID {categoryid} not found or does not belong to the user.'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, cardid):
        try:
            card = CardsModel.objects.get(pk=cardid, owner=request.user)
        except CardsModel.DoesNotExist:
            return Response({'message': 'Card not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CardEditSerializer(instance=card, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Card updated successfully!'}, status=status.HTTP_200_OK)

        return Response({'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CardReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryid):
        try:
            category = CardsCategoryModel.objects.get(pk=categoryid, owner=request.user)
        except CardsCategoryModel.DoesNotExist:
            
            return Response(
                {'message': f'Category with ID {categoryid} not found or does not belong to the user.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cards = CardsModel.objects.filter(category=category, owner=request.user)
        serializer = CardEditSerializer(cards, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK)

class NewCardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        category_title = request.data.get('category_title')
        card_title = request.data.get('card_title')
        definition = request.data.get('definition')

        category, created = CardsCategoryModel.objects.get_or_create(
            title=category_title,
            owner=request.user,
        )

        card = CardsModel.objects.create(
            title=card_title,
            definition=definition,
            category=category,
            owner=request.user,
        )

        response_data = {
            'category': {
                'id': category.id,
                'title': category.title,
                'created': created,
            },
            'card': {
                'id': card.id,
                'title': card.title,
                'definition': card.definition,
            },
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    def get(self, request):
        category_title = request.query_params.get('category')
        if not category_title:
            return Response({'words': []}, status=status.HTTP_200_OK)

        try:
            category = CardsCategoryModel.objects.get(title=category_title, owner=request.user)
            cards = CardsModel.objects.filter(owner=request.user, category=category)
            words = [card.title for card in cards]
            return Response({'words': words}, status=status.HTTP_200_OK)
        except CardsCategoryModel.DoesNotExist:
            return Response({'words': []}, status=status.HTTP_200_OK)
            
