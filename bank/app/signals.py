from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from app.models import Profile,Account
import random
from app.utils import send_welcome_email

@receiver(post_save,sender=User)
def create_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)

        account = Account.objects.create(user=instance,account_number = str(random.randint(1000000000,9000000000)))

        send_welcome_email(instance,account)