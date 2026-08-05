from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    phone = models.CharField(max_length=50)
    image = models.ImageField(upload_to="profile/")
    address = models.TextField()

    def __str__(self):
        return self.user.username


class Account(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    account_number = models.CharField(max_length=50,unique=True)
    balance = models.DecimalField(max_digits=12,decimal_places=2,default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ("deposit","deposit"),
        ("withdraw","withdraw"),
        ("transfer","transfer")
    )

    from_account = models.ForeignKey(Account,on_delete=models.CASCADE,null=True,blank=True,related_name="sent")
    to_account = models.ForeignKey(Account,on_delete=models.CASCADE,null=True,blank=True,related_name="receiver")
    amount = models.DecimalField(max_digits=12,decimal_places=2)
    transaction_type = models.CharField(max_length=20,choices=TRANSACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)