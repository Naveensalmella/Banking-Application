from django.conf import settings
from django.core.mail import send_mail


def send_welcome_email(user,account):
    subject = "Welcome to online banking"

    message = f"""
Hello {user.username}, Welcome to online banking website

Your account is created successfully

Account Details
====================
Account number : {account.account_number}
username : {user.username}
email : {user.email}


Keep your account number safe.
Thanks for choosing us.

Regards
===========
Online banking team

"""
    send_mail(subject,
              message,
              settings.DEFAULT_FROM_EMAIL,
              [user.email],
              fail_silently=False
              )