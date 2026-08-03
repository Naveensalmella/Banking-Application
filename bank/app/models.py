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