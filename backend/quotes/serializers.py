from rest_framework import serializers
from .models import Supplier, RFQ, Bid

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name']

class RFQSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQ
        fields = ['id', 'item', 'quantity', 'deadline', 'created_at']

class BidSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()
    class Meta:
        model = Bid
        fields = ['id', 'supplier', 'price', 'submitted_at']
