from rest_framework import viewsets
from .models import RFQ, Bid
from .serializers import RFQSerializer, BidSerializer

class RFQViewSet(viewsets.ModelViewSet):
    queryset = RFQ.objects.all().order_by('-created_at')
    serializer_class = RFQSerializer

class BidViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bid.objects.select_related('supplier').all().order_by('-submitted_at')
    serializer_class = BidSerializer
