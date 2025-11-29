from django.urls import path
from .views import EmailConfirmation, SignUpView, SignInView, ProfileView, LogOutView, ChangePasswordView, FindUserView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signupview'),
    path('signin/', SignInView.as_view(), name='signinview'),
    path('profile/', ProfileView.as_view(), name='profileview'),
    path('logout/', LogOutView.as_view(), name='logoutview'),
    path('finduser/', FindUserView.as_view(), name='finduserview'),
    path('changepassword/', ChangePasswordView.as_view(), name='changepasswordview'),
    path('emailconfirmation/', EmailConfirmation.as_view(), name='emailconfirmationview'),
]
