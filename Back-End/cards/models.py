from django.db import models
from members.models import CustomUser


class CardsCategoryModel(models.Model):
    title = models.CharField(max_length=25, blank=False)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='category')

class CardsModel(models.Model):
    title = models.TextField(verbose_name="Title", blank=False)
    definition = models.TextField(verbose_name="Definition", blank=False)
    category = models.ForeignKey(to=CardsCategoryModel, on_delete=models.CASCADE, verbose_name="Category", blank=False)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='cards')

