from django.contrib import admin
from .models import Supplier, RFQ, Bid

admin.site.register(Supplier)
admin.site.register(RFQ)
admin.site.register(Bid)