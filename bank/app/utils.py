from django.conf import settings
from django.core.mail import send_mail


def send_welcome_email(user, account):
    subject = "Welcome to Online Banking 🎉"

    message = f"""
Hello {user.username},

Welcome to Online Banking! Your account has been created successfully.

Account Details
====================
Account number : {account.account_number}
Username       : {user.username}
Email          : {user.email}
Balance        : Rs. {account.balance}

Keep your account number safe — you'll need it to receive transfers.

Thanks for choosing us.

Regards,
Online Banking Team
"""
    send_mail(subject,
              message,
              settings.DEFAULT_FROM_EMAIL,
              [user.email],
              fail_silently=False
              )


def send_deposit_email(user, account, amount):
    subject = "Deposit Successful — Online Banking"

    message = f"""
Hello {user.username},

Your deposit was successful.

Transaction Details
====================
Amount deposited : Rs. {amount}
Account number   : {account.account_number}
New balance      : Rs. {account.balance}

If you did not make this transaction, please contact support immediately.

Regards,
Online Banking Team
"""
    send_mail(subject,
              message,
              settings.DEFAULT_FROM_EMAIL,
              [user.email],
              fail_silently=False
              )


def send_withdraw_email(user, account, amount):
    subject = "Withdrawal Successful — Online Banking"

    message = f"""
Hello {user.username},

Your withdrawal was successful.

Transaction Details
====================
Amount withdrawn : Rs. {amount}
Account number   : {account.account_number}
New balance      : Rs. {account.balance}

If you did not make this transaction, please contact support immediately.

Regards,
Online Banking Team
"""
    send_mail(subject,
              message,
              settings.DEFAULT_FROM_EMAIL,
              [user.email],
              fail_silently=False
              )


def send_transfer_email(sender_user, sender_account, receiver_user, receiver_account, amount):
    sender_subject = "Money Sent — Online Banking"
    sender_message = f"""
Hello {sender_user.username},

Your transfer was successful.

Transaction Details
====================
Amount sent       : Rs. {amount}
To account number : {receiver_account.account_number}
Your new balance   : Rs. {sender_account.balance}

If you did not make this transaction, please contact support immediately.

Regards,
Online Banking Team
"""
    send_mail(sender_subject,
              sender_message,
              settings.DEFAULT_FROM_EMAIL,
              [sender_user.email],
              fail_silently=False
              )

    receiver_subject = "Money Received — Online Banking"
    receiver_message = f"""
Hello {receiver_user.username},

You've received money in your account.

Transaction Details
====================
Amount received     : Rs. {amount}
From account number : {sender_account.account_number}
Your new balance     : Rs. {receiver_account.balance}

Regards,
Online Banking Team
"""
    send_mail(receiver_subject,
              receiver_message,
              settings.DEFAULT_FROM_EMAIL,
              [receiver_user.email],
              fail_silently=False
              )