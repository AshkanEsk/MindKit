from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class AIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        is_review = request.data.get['is_review']
        if is_review:
            pass
        else:
            pass