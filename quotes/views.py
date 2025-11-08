from rest_framework import viewsets
from .models import RFQ, Bid, Supplier
from .serializers import RFQSerializer, BidSerializer, SupplierSerializer


class RFQViewSet(viewsets.ModelViewSet):
    queryset = RFQ.objects.all().order_by('-created_at')
    serializer_class = RFQSerializer


class BidViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing Bid instances.
    """
    queryset = Bid.objects.select_related('supplier').all().order_by('-submitted_at')  # ✅ define queryset here
    serializer_class = BidSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('name')
    serializer_class = SupplierSerializer
