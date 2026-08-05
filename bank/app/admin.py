from django.contrib import admin
from app.models import Account,Transaction

# Register your models here.


class AccountAdmin(admin.ModelAdmin):
    list_display = ["id","account_number","user","balance","created_at"]

admin.site.register(Account,AccountAdmin)

class TransactionAdmin(admin.ModelAdmin):
    list_display = ["id","from_account","to_account","amount","transaction_type"]

admin.site.register(Transaction,TransactionAdmin)