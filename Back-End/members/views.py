import smtplib
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from cards.models import CardsCategoryModel
from .models import CustomUser
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from leitnercard import settings
from .throttling import IPThrottle, ChangePasswordThrottle
import logging

logger = logging.getLogger(__name__)

class SignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        logging.info(f'----->Call Serializer')
        serializer = SignUpSerializer(data = request.data)
        logging.info(f'----->End of Serializer')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignInView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print('----->View Calls Serializer.')
        serializer = SignInSerializer(data=request.data)
        print('----->View Calling serializer ended.')
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            print('----->View Token created.')
            return Response({
                'message': 'Login successful',
                'user': user.username,
                'token': token.key
            })
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user 
        categories = CardsCategoryModel.objects.filter(owner=user).values('id', 'title')    
        response_data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'phone_no': user.phone_no,
                'fullname': user.full_name,
                'gender' : user.gender,
            },
            'categories': [(query['id'], query['title']) for query in categories],
        }
        print(response_data)
        return Response(response_data, status=status.HTTP_200_OK)

class LogOutView(APIView):

    def get(self, request):
        logout(request)

class FindUserView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)
            code = get_random_string(5, allowed_chars='1234567890')
            
            try:
                send_mail(
                    subject="Password Recovery Code",
                    message=f"Your password recovery code is: {code}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except smtplib.SMTPException as e:
                print(f"Email sending failed: {str(e)}")
                return Response(
                    {"message": "Failed to send recovery email. Please check your email configuration."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


            return Response({
                "message": "Recovery code sent to your email",
                "code": code
            }, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"message": "Username not found"}, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ChangePasswordThrottle]

    def post(self, request):
        try:
            user = CustomUser.objects.get(email=request.data['email'])
            code = get_random_string(5, allowed_chars='1234567890')
            send_mail(
                subject="Security Alert",
                message=f"Confirm You have requested to Reset Your Password. The Code is: {code}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[request.data['email']],
                fail_silently=False,
            )
            return Response({
                "message": f"An Email has been sent to {request.data['email']}",
                "code": code,
            }, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"message": "This user has not registered."}, status=status.HTTP_404_NOT_FOUND)

        except smtplib.SMTPException as e:
            logger.error(f"Email sending failed for {request.data['email']}: {str(e)}")
            return Response({"message": "Email sending failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=serializer.validated_data['user'])
            user.set_password(serializer.validated_data['password'])
            user.save()

            try:
                send_mail(
                    subject="Security Alert",
                    message="Your password has been changed successfully.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except smtplib.SMTPException as e:
                logger.error(f"Email sending failed for {user.email}: {str(e)}")

            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            logger.warning(f"Password change attempt for non-existent user: {serializer.validated_data['user']}")
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
class EmailConfirmation(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [IPThrottle]

    def post(self, request):
        code = get_random_string(5, allowed_chars='1234567890')
        try:
                send_mail(
                    subject="Confirm Your Email",
                    message=f"To Confirm Your Email Enter This code: {code}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[request.data['email']],
                    fail_silently=False,
                )
        except smtplib.SMTPException as e:
            print(f"Email sending failed: {str(e)}")
            return Response(
                {"message": "Failed to send email. Please check your email configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({
                "message": "Confirmation code sent to your email",
                "code": code
            }, status=status.HTTP_200_OK)

