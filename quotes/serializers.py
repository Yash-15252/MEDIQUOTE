from rest_framework import serializers
from .models import RFQ, Bid, Supplier
from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class RFQSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQ
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer()
    class Meta:
        model = Bid
        fields = '__all__'