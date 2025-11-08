from django.contrib import admin
from .models import Supplier, RFQ, Bid

class BidInline(admin.TabularInline):
    model = Bid
    extra = 0
    readonly_fields = ('submitted_at',)
    fields = ('supplier', 'price', 'submitted_at')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    list_filter = ('name',)
    search_fields = ('name', 'email', 'phone')
    ordering = ('name',)
    fieldsets = (
        (None, {
            'fields': ('name', 'email', 'phone')
        }),
    )

@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = ('item', 'quantity', 'deadline', 'created_at', 'bid_count')
    list_filter = ('deadline', 'created_at')
    search_fields = ('item',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('item', 'quantity', 'deadline')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    inlines = [BidInline]

    def bid_count(self, obj):
        return obj.bids.count()
    bid_count.short_description = 'Number of Bids'

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'rfq', 'price', 'submitted_at')
    list_filter = ('submitted_at', 'supplier', 'rfq')
    search_fields = ('supplier__name', 'rfq__item')
    date_hierarchy = 'submitted_at'
    ordering = ('-submitted_at',)
    readonly_fields = ('submitted_at',)
    fieldsets = (
        (None, {
            'fields': ('rfq', 'supplier', 'price')
        }),
        ('Timestamps', {
            'fields': ('submitted_at',),
            'classes': ('collapse',)
        }),
    )
    raw_id_fields = ('rfq', 'supplier')  # For better performance with large datasets
