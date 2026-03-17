from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Phone number must be provided")

        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(phone_number, password, **extra_fields)

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('worker', 'Worker'),
        ('admin', 'Admin'),
    )

    username = None
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return self.phone_number
class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    minimum_price = models.IntegerField()
    image = models.ImageField(upload_to='services/')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
class WorkerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    experience = models.IntegerField()
    service_type = models.ForeignKey(Service, on_delete=models.CASCADE)
    location = models.CharField(max_length=200)
    address = models.TextField()
    photo = models.ImageField(upload_to='worker_photos/')
    id_proof = models.ImageField(upload_to='worker_ids/')
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.user.full_name

class Booking(models.Model):
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('accepted', 'Accepted'),
        ('on_the_way', 'On The Way'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    assigned_worker = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='worker_bookings'
    )

    full_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    address = models.TextField()
    problem_description = models.TextField()
    problem_image = models.ImageField(upload_to='problems/', null=True, blank=True)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    minimum_cost = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    created_at = models.DateTimeField(auto_now_add=True)
    user_lat = models.FloatField(null=True, blank=True)
    user_lng = models.FloatField(null=True, blank=True)

    worker_lat = models.FloatField(null=True, blank=True)
    worker_lng = models.FloatField(null=True, blank=True)

    tracking_active = models.BooleanField(default=False)
    distance_km = models.FloatField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['assigned_worker']),
        ]
    def __str__(self):
        return f"Booking {self.id}"
class Bill(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    worker = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True,blank=True)
    service_type = models.CharField(max_length=200,default="General Service")
    service_charge = models.IntegerField()
    parts_used = models.TextField(blank=True)
    parts_charge = models.IntegerField()
    total_amount = models.IntegerField()
    pdf = models.FileField(upload_to="bills/", blank=True, null=True)

    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Bill for Booking {self.booking.id}"
class Payment(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.IntegerField()
    payment_method = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    paid_at = models.DateTimeField(auto_now_add=True)
class Part(models.Model):
    SERVICE_CHOICES = [
        ('Electrical', 'Electrical'),
        ('Plumbing', 'Plumbing'),
    ]

    name = models.CharField(max_length=200)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    description = models.TextField()
    normal_price = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    worker_price = models.DecimalField(max_digits=10, decimal_places=2,default=0)

    bulk_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bulk_min_quantity = models.IntegerField(default=10)
    # price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='parts/')

    def __str__(self):
        return self.name
class Order(models.Model):
    first_name = models.CharField(max_length=200,default="c")
    last_name = models.CharField(max_length=200,default="k")
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    subtotal = models.FloatField()
    shipping = models.FloatField()
    tax = models.FloatField()
    grand_total = models.FloatField()

    payment_method = models.CharField(max_length=50, default="Cash on Delivery")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
      return f"{self.first_name} {self.last_name}"
class Message(models.Model):

    booking = models.ForeignKey(
        "Booking",
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_messages"
    )

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} → {self.receiver} : {self.message[:30]}"