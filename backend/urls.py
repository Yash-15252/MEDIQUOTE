from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from quotes import views

router = routers.DefaultRouter()
router.register(r'rfq', views.RFQViewSet)
router.register(r'bids', views.BidViewSet)
router.register(r'suppliers', views.SupplierViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
