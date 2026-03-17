from django.contrib import admin
from .models import *
from django.utils.html import format_html
from django.urls import reverse

# ================= CUSTOM USER ADMIN =================

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'full_name', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff')
    search_fields = ('phone_number', 'full_name')
    ordering = ('phone_number',)


# ================= WORKER PROFILE ADMIN =================

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'service_type', 'experience', 'location', 'is_approved')
    list_filter = ('is_approved', 'service_type')
    search_fields = ('user__phone_number', 'service_type')


# ================= SERVICE ADMIN =================

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'minimum_price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


# ================= BOOKING ADMIN =================

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'service',
        'assigned_worker',
        'status',
        'preferred_date',
        'preferred_time',
        'minimum_cost',
        'created_at'
    )
    list_filter = ('status', 'preferred_date')
    search_fields = ('user__phone_number', 'service__name')
    ordering = ('-created_at',)


# ================= BILL ADMIN =================

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('booking', 'service_charge', 'parts_charge', 'total_amount', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('booking__id',)
    def download_bill(self, obj):
        url = reverse('generate_bill_pdf', args=[obj.id])
        return format_html('<a href="{}">Download PDF</a>', url)

# ================= PAYMENT ADMIN =================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'payment_method', 'status', 'transaction_id', 'paid_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('transaction_id',)
@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'service_type', 'normal_price')
    list_filter = ('service_type',)
    search_fields = ('name',)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name', 'phone', 'grand_total', 'payment_method', 'created_at')
    search_fields = ('first_name', 'phone')
    list_filter = ('payment_method', 'created_at')

admin.site.register(Order, OrderAdmin)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "booking",
        "sender",
        "receiver",
        "message",
        "created_at",
        "is_read",
    )

    list_filter = (
        "created_at",
        "is_read",
    )

    search_fields = (
        "sender__full_name",
        "receiver__full_name",
        "message",
    )

    ordering = ("-created_at",)