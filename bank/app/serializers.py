from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username","first_name","last_name","email","password"]
        except_kwargs = {
            "password": {
                "write_only":True
            }
        }

    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exist")
        return value
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

from app.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username",read_only=True)
    first_name = serializers.CharField(source="user.first_name",read_only=True)
    last_name = serializers.CharField(source="user.last_name",read_only=True)
    email = serializers.EmailField(source="user.email",read_only=True)

    class Meta:
        model = Profile
        fields = ["username","first_name","last_name","email","phone","image","address"]

from app.models import Account

class AccountSerializers(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"

from app.models import Transaction

class TransactionSerializer(serializers.ModelSerializer):

    from_account_number = serializers.CharField(source="from_account.account_number",read_only=True)
    to_account_number = serializers.CharField(source="to_account.account_number",read_only=True)
    from_user = serializers.CharField(source="from_account.user.username",read_only=True)
    to_user = serializers.CharField(source="to_account.user.username",read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"