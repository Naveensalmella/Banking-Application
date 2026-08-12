from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from app.serializers import RegisterSerializer

from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

from app.serializers import ProfileSerializer
from app.models import Profile

from rest_framework.parsers import MultiPartParser, FormParser

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

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
from app.utils import send_deposit_email


class DepositView(APIView):
    permission_classes = [IsAuthenticated]

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

        try:
            send_deposit_email(request.user, account, amount)
        except Exception as e:
            print("Deposit email failed:", e)

        return Response({"message":"Deposit successful","balance":account.balance})
        

from app.utils import send_withdraw_email

class Withdraw(APIView):
    permission_classes = [IsAuthenticated]

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

        try:
            send_withdraw_email(request.user, account, amount)
        except Exception as e:
            print("Withdraw email failed:", e)

        return Response({"message":"Withdraw successful","balance":account.balance})


from app.utils import send_transfer_email

class TransferView(APIView):
    permission_classes = [IsAuthenticated]

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

        try:
            send_transfer_email(request.user, sender, receiver.user, receiver, amount)
        except Exception as e:
            print("Transfer email failed:", e)

        return Response({"message":"Transfer successfully","Updated balance":sender.balance})

from app.serializers import TransactionSerializer
from django.db.models import Q

class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        account = Account.objects.get(user=self.request.user)
        return Transaction.objects.filter(
            Q(from_account=account) | Q(to_account=account)
        ).order_by("-created_at")