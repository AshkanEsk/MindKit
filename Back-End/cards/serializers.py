from rest_framework import serializers
from .models import *

class CardEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardsModel
        fields = "__all__"
        read_only_fields = ['owner']

    def create(self, validated_data):
        return CardsModel.objects.create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CardsCategoryModel
        fields = ['title']
        read_only_fields = ['owner']

    def create(self, validated_data):
        user = self.context['request'].user
        if CardsCategoryModel.objects.filter(title=validated_data['title'], owner=user).exists():
            raise serializers.ValidationError('This category already exists in your categories.')
        return CardsCategoryModel.objects.create(owner=user, **validated_data)

class CardReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardsModel
        fields = "__all__"
        read_only_fields = ['owner']

class SameCategoryCardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardsModel
        fields = ['title', 'owner', 'category']

    def retriver(self):
        user = self.context['request'].user
        cat = self.context['request'].category
        words = []
        if cat:
            words = CardsModel.objects.filter(owner = user, category = cat)
        return words