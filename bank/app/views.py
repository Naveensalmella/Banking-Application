from django.shortcuts import render
from rest_framework import generics

from app.serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

from app.serializers import ProfileSerializer
from app.models import Profile

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return Profile.objects.get(user=self.request.user)


from app.serializers import AccountSerializers
from app.models import Account

class AccountView(generics.RetrieveAPIView):
    serializer_class = AccountSerializers

    def get_object(self):
        return Account.objects.get(user=self.request.user)
