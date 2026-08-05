from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from app.serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

from app.serializers import ProfileSerializer
from app.models import Profile

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)


from app.serializers import AccountSerializers
from app.models import Account

class AccountView(generics.RetrieveAPIView):
    serializer_class = AccountSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Account.objects.get(user=self.request.user)

from rest_framework.views import APIView
from decimal import Decimal
from rest_framework.response import Response

from app.models import Transaction

class DepositView(APIView):

    def post(self,request):

        amount = Decimal(request.data.get("amount","0"))
        account = Account.objects.get(user=request.user)

        if amount <= 0 :

            return Response({"error":"invalid amount"},status=400)

        account.balance += amount
        account.save()

        Transaction.objects.create(
            to_account = account,
            amount = amount,
            transaction_type = "deposit"
        )

        return Response({"message":"Deposit successful","balance":account.balance})
        

class Withdraw(APIView):

    def post(self,request):

        amount = Decimal(request.data.get("amount","0"))
        account = Account.objects.get(user=request.user)

        if amount <= 0 :
            return Response({"error":"invalid amount"},status=400)

        if account.balance < amount :
            return Response({"error":"Insufficient balance"},status=400)

        account.balance -= amount
        account.save()

        Transaction.objects.create(
            to_account = account,
            amount = amount,
            transaction_type = "withdraw"
        )

        return Response({"message":"Withdraw successful","balance":account.balance})


class TransferView(APIView):

    def post(self,request):

        sender = Account.objects.get(user=request.user)
        receiver_account = request.data.get("account_number")
        amount = Decimal(request.data.get("amount",0))

        if amount <= 0 :
            return Response({"error":"Invalid amount"},status=400)

        try:
            receiver = Account.objects.get(account_number=receiver_account)

        except Account.DoesNotExist :
            return Response({"error":"Account not found"},status=400)

        if sender.balance <= amount:
            return Response({"error":"Insufficient balance"},status=400)

        sender.balance -= amount
        receiver.balance += amount

        sender.save()
        receiver.save()

        Transaction.objects.create(
            to_account = receiver,
            from_account = sender,
            amount = amount,
            transaction_type = "transfer"
        )

        return Response({"message":"Transfer successfully","Updated balance":sender.balance})