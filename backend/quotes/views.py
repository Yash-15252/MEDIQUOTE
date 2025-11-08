from rest_framework import viewsets
from .models import Supplier, RFQ, Bid
from .serializers import SupplierSerializer, RFQSerializer, BidSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer

class RFQViewSet(viewsets.ModelViewSet):
    queryset = RFQ.objects.all().order_by('-created_at')
    serializer_class = RFQSerializer

class BidViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bid.objects.select_related('supplier').all().order_by('-submitted_at')
    serializer_class = BidSerializer
