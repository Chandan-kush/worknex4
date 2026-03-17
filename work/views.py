from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate,logout
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import *
import random
from reportlab.pdfgen import canvas
from django.conf import settings
import os
import json
from django.http import JsonResponse
from math import radians, sin, cos, sqrt, asin
from datetime import date, timedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from datetime import datetime
User = get_user_model()
def signup(request):
    print("VIEW HIT")
    if request.method == "POST":
        full_name = request.POST.get('full_name')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        role = request.POST.get('role')

        if User.objects.filter(phone_number=phone).exists():
            messages.error(request, "Phone number already exists")
            return redirect('signin')

        user = User.objects.create_user(
            phone_number=phone,
            full_name=full_name,
            email=email,
            role=role,
            is_verified=True
        )

        user.set_unusable_password()
        user.save()

        # ✅ YAHAN WORKER PROFILE BANEGI
        if role == "worker":
            experience = request.POST.get('experience')
            service_id = request.POST.get('service_type')
            location = request.POST.get('location')
            address = request.POST.get('address')
            photo = request.FILES.get('photo')
            id_proof = request.FILES.get('id_proof')
            service = Service.objects.get(id=service_id)
            WorkerProfile.objects.create(
                user=user,
                experience=experience,
                service_type=service,
                location=location,
                address=address,
                photo=photo,
                id_proof=id_proof
            )

        login(request, user)

        if role == "worker":
            return redirect('work')
        
        else:
            return redirect('home')

    # return render(request, 'signin.html')
    services = Service.objects.all()
    return render(request, 'signin.html', {"services": services})

def signin(request):
    if request.method == "POST":
        phone = request.POST.get('phone')

        try:
            user = User.objects.get(phone_number=phone)
            login(request, user)

            if user.role == "worker":
                return redirect('work')
            else:
                return redirect('home')

        except User.DoesNotExist:
            messages.error(request, "User not found")
    services = Service.objects.all()   # ✅ ADD THIS
    return render(request, 'signin.html', {"services": services})
   
def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect("signin")   # ya "signin"
def home_view(request):
    services = Service.objects.filter(is_active=True)

    my_bookings = None
    if request.user.is_authenticated and request.user.role != "worker":
        my_bookings = Booking.objects.filter(user=request.user)

    return render(request, 'home.html', {
        'services': services,
        'bookings': my_bookings
    })

def book_service(request, service_id):
    services = Service.objects.all()
    
    if service_id:
        service = get_object_or_404(Service, id=service_id)
    else:
        service = services.first()  # default first service
    if request.method == "POST":
        full_name = request.POST.get('full_name')
        mobile = request.POST.get('mobile')
        address = request.POST.get('address')
        description = request.POST.get('problem_description')
        date = request.POST.get('preferred_date')
        time = request.POST.get('preferred_time')
        period = request.POST.get('time_period')
        problem_image = request.FILES.get('problem_image')
        final_time = datetime.strptime(f"{time} {period}", "%I:%M %p ").time()
        booking = Booking.objects.create(
            user=request.user,
            service=service,
            full_name=full_name,
            mobile=mobile,
            address=address,
            problem_description=description,
            preferred_date=date,
            preferred_time=final_time,
            minimum_cost=service.minimum_price,
            problem_image=problem_image,
        )

        return redirect('confirmation', booking_id=booking.id)
    # 👇 YEH ADD KARO
    nearby_workers = WorkerProfile.objects.filter(
        service_type=service,
        
    )
    return render(request, 'book.html', {
        'service': service,
        'services': services,
        'nearby_workers': nearby_workers  # 👈 YE ADD KARNA THA
    })
@login_required(login_url="signin")
def confirmation_view(request, booking_id):
    booking = get_object_or_404(
        Booking,
        id=booking_id,
        user=request.user
    )
    bill = Bill.objects.filter(booking=booking).first()
    return render(request, 'confirmation.html', {
    'booking': booking,
    'bill': bill
})
def generate_bill_pdf(bill):
    
    bills_folder = os.path.join(settings.MEDIA_ROOT, "bills")
    os.makedirs(bills_folder, exist_ok=True)

    file_path = os.path.join(bills_folder, f"bill_{bill.id}.pdf")
    c = canvas.Canvas(file_path)

    c.drawString(100, 800, "WorkNex Invoice")
    c.drawString(100, 780, f"Booking ID: {bill.booking.id}")
    c.drawString(100, 760, f"Customer: {bill.booking.full_name}")
    c.drawString(100, 740, f"Service Type: {bill.service_type}")
    c.drawString(100, 720, f"Service Charge: {bill.service_charge}")
    c.drawString(100, 700, f"Parts Used: {bill.parts_used}")
    c.drawString(100, 680, f"Parts Charge: {bill.parts_charge}")
    c.drawString(100, 660, f"Total Amount: {bill.total_amount}")

    c.save()

    bill.pdf = f"bills/bill_{bill.id}.pdf"
    bill.save()
@login_required(login_url="signin")
def worker_dashboard(request):
    services = Service.objects.all()
    if request.user.role != "worker":
        return redirect("home")

    worker_profile = WorkerProfile.objects.filter(user=request.user).first()

    if not worker_profile:
        messages.error(request, "Worker profile not found")
        return redirect("home")

    pending_bookings = Booking.objects.filter(
        service=worker_profile.service_type,
        status="requested"
    )
    accepted_bookings = Booking.objects.filter(
        assigned_worker=request.user,
        status="accepted"
        
    )
    today_jobs = Booking.objects.filter(
        assigned_worker=request.user,
     ).exclude(status="requested")

    total_requests_today = Booking.objects.filter(
    service=worker_profile.service_type,
    status="requested",
    preferred_date=date.today()
    ).count()

    completed_jobs = Booking.objects.filter(
    assigned_worker=request.user,
    status="completed"
    ).count()



    accepted_jobs = Booking.objects.filter(
    assigned_worker=request.user,
    status="accepted"
    ).count()

    today_earnings = Bill.objects.filter(
        worker=request.user,
        created_at__date=date.today()
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    week_start = date.today() - timedelta(days=7)
    weekly_earnings = Bill.objects.filter(
        worker=request.user,
        created_at__gte=week_start
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    monthly_earnings = Bill.objects.filter(
        worker=request.user,
        created_at__month=date.today().month,
        created_at__year=date.today().year
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    # Today completed jobs
    today_completed_jobs = Booking.objects.filter(
    assigned_worker=request.user,
    status="completed",
    preferred_date=date.today()
     ).count()

    total_earnings = Bill.objects.filter(
    worker=request.user
).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
# Weekly completed jobs
    week_start = date.today() - timedelta(days=7)

    weekly_completed_jobs = Booking.objects.filter(
    assigned_worker=request.user,
    status="completed",
    preferred_date__gte=week_start
     ).count()


# Monthly completed jobs
    monthly_completed_jobs = Booking.objects.filter(
    assigned_worker=request.user,
    status="completed",
    preferred_date__month=date.today().month,
    preferred_date__year=date.today().year
     ).count()
    if request.method == "POST" and request.POST.get("form_type") == "profile":

        worker_profile.user.full_name = request.POST.get("full_name")
        worker_profile.user.phone_number = request.POST.get("mobile")
        worker_profile.user.email = request.POST.get("email")

        worker_profile.experience = request.POST.get("experience")
        worker_profile.location = request.POST.get("location")

        service_id = request.POST.get("service_category")
        worker_profile.service_type = Service.objects.get(id=service_id)

        if request.FILES.get("profile_photo"):
          worker_profile.photo = request.FILES.get("profile_photo")

        if request.FILES.get("id_proof"):
            worker_profile.id_proof = request.FILES.get("id_proof")

        worker_profile.user.save()
        worker_profile.save()

        messages.success(request,"Profile Updated Successfully")
        return redirect("work")
    elif request.method == "POST" and request.POST.get("form_type") == "bill":

          booking_id = request.POST.get("booking")
          service_type = request.POST.get("service_type")
          service_charge = int(request.POST.get("service_charge") or 0)
          parts_used = request.POST.get("parts_used")
          parts_cost = int(request.POST.get("parts_cost") or 0)
          booking = get_object_or_404(Booking, id=booking_id)
          if Bill.objects.filter(booking=booking).exists():
                 messages.error(request,"Bill already created")
                 return redirect("work")
          total = service_charge + parts_cost

          bill = Bill.objects.create(
                   booking=booking,
                   worker=request.user,
                   service_type=service_type,
                   service_charge=service_charge,
                    parts_used=parts_used,
                   parts_charge=parts_cost,
                   total_amount=total
              )

          generate_bill_pdf(bill)

          booking.status = "completed"
          booking.save()

          messages.success(request, "Bill Created Successfully")
          return redirect("work")
    parts = Part.objects.all()
    cart = request.session.get("worker_cart", {})

    total = 0
    for item in cart.values():
        total += item['price'] * item['quantity']
    return render(request, 'work.html', {
        'bookings': pending_bookings,
        'accepted_bookings': accepted_bookings,
        'parts': parts,
        'cart': cart,     # ✅ ADD
        'total': total,
        'today_jobs': today_jobs,
        "today_earnings": today_earnings,
        "weekly_earnings": weekly_earnings,
        "monthly_earnings": monthly_earnings,
        "today_completed_jobs": today_completed_jobs,
        "weekly_completed_jobs": weekly_completed_jobs,
        "monthly_completed_jobs": monthly_completed_jobs,
        "total_requests_today": total_requests_today,
        "accepted_jobs": accepted_jobs,
        "completed_jobs": completed_jobs,
        'worker': worker_profile,
        "total_earnings": total_earnings,
        'services': services,
    })
@login_required(login_url="signin")
def accept_booking(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id)

    booking.status = "accepted"
    booking.assigned_worker = request.user
    booking.tracking_active = True
    booking.save()

    return redirect('work')
@login_required(login_url="signin")
def reject_booking(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id)

    booking.status = "cancelled"
    booking.save()

    return redirect('work')

@login_required(login_url="signin")
def cancel_booking(request, booking_id):
    if request.method == "POST":
        booking = get_object_or_404(Booking, id=booking_id)

        # Optional: Sirf owner hi cancel kar sake
        if booking.user == request.user:
            booking.status = "cancelled"
            booking.save()
            messages.success(request, "Booking cancelled successfully.")

        return redirect('book', booking_id=booking.id)

def part_view(request):
    parts = Part.objects.all()
    if request.user.is_authenticated and request.user.role == "worker":
        cart = request.session.get("worker_cart", {})
    else:
        cart = request.session.get("user_cart", {})
    for part in parts:
        if request.user.is_authenticated and request.user.role == "worker":
            part.display_price = part.worker_price
        else:
            part.display_price = part.normal_price
    total = 0
    for item in cart.values():
        total += item['price'] * item['quantity']

    return render(request, "part.html", {
        'parts': parts,
        'cart': cart,
        'total': total
    })

def add_to_cart(request, part_id):
    part = get_object_or_404(Part, id=part_id)
    quantity = int(request.POST.get("quantity", 1))

    if request.user.is_authenticated and request.user.role == "worker":
        cart_key = "worker_cart"
        price = part.worker_price
    else:
        cart_key = "user_cart"
        price = part.normal_price

    cart = request.session.get(cart_key, {})
    
    price = price
    # 🔹 Bulk condition (better version)
    existing_qty = cart.get(str(part_id), {}).get('quantity', 0)
    new_qty = existing_qty + quantity

    if new_qty >= part.bulk_min_quantity and part.bulk_price > 0:
        price = part.bulk_price
    
    
    cart[str(part_id)] = {
            'name': part.name,
            'price': float(price),
            'quantity': new_qty,
    }

    request.session[cart_key] = cart
    request.session.modified=True
    if request.user.is_authenticated and request.user.role == "worker":
        return redirect('work')
    else:
        return redirect('part')
def remove_from_cart(request, part_id):
    
    if request.user.is_authenticated and request.user.role == "worker":
        cart_key = "worker_cart"
    else:
        cart_key = "user_cart"
    cart = request.session.get(cart_key, {})
    part_id = str(part_id)
    if str(part_id) in cart:
        del cart[str(part_id)]

    request.session[cart_key] = cart
    request.session.modified = True
    if request.user.is_authenticated and request.user.role == "worker":
      return redirect('work')
    else:
      return redirect('part')
@login_required(login_url="signin")
def checkout_view(request):
    
    if request.user.is_authenticated and request.user.role == "worker":
        cart_key = "worker_cart"
    else:
        cart_key = "user_cart"

    cart = request.session.get(cart_key, {})

    subtotal = 0
    for item in cart.values():
        subtotal += float(item['price']) * int(item['quantity'])

    shipping = 30
    tax = subtotal * 0.02
    grand_total = subtotal + shipping + tax

    if request.method == "POST":
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        phone = request.POST['phone']
        address = request.POST['address']
        city = request.POST['city']
        state = request.POST['state']
        pincode = request.POST['pincode']

        Order.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            address=address,
            city=city,
            state=state,
            pincode=pincode,
            subtotal=subtotal,
            shipping=shipping,
            tax=tax,
            grand_total=grand_total,
        )

        request.session[cart_key] = {}   # cart empty
        return redirect('part')

    return render(request, "checkout.html", {
        'cart': cart,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'grand_total': grand_total
    })



def user_profile(request):
    user = request.user

    if request.method == "POST":
        user.full_name = request.POST.get("full_name")
        user.phone_number = request.POST.get("phone_number")
        user.email = request.POST.get("email")

        if request.FILES.get("profile_image"):
            user.profile_image = request.FILES.get("profile_image")

        user.save()
        messages.success(request, "Profile updated successfully.")
        return redirect("user_profile")

    return render(request, "profile.html", {"user": user})
def services_page(request):
    services = Service.objects.filter(is_active=True)

    search = request.GET.get("search")
    location = request.GET.get("location")

    if search:
        services = services.filter(name__icontains=search)

    if location:
        services = services.filter(location__icontains=location)

    return render(request, "services.html", {
        "services": services
    })
@login_required(login_url="signin")
def chat_view(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id)

    if request.user != booking.user and request.user != booking.assigned_worker:
        return redirect("home")

    if request.user == booking.user:
        bookings = Booking.objects.filter(user=request.user)
        receiver = booking.assigned_worker
    else:
        bookings = Booking.objects.filter(assigned_worker=request.user)
        receiver = booking.user

    messages = Message.objects.filter(booking=booking).order_by("created_at")

    if request.method == "POST":

        text = request.POST.get("message")

        Message.objects.create(
            booking=booking,
            sender=request.user,
            receiver=receiver,
            message=text
        )

        return redirect("chat", booking_id=booking.id)

    return render(request,"chat.html",{
        "booking":booking,
        "messages":messages,
        "bookings":bookings
    })
@login_required(login_url="signin")
def my_bookings(request):

    bookings = Booking.objects.filter(user=request.user).order_by("-created_at")

    context = {
        "bookings": bookings
    }

    return render(request, "mybook.html", context)
def invoice_view(request, booking_id):

    bill = Bill.objects.filter(booking_id=booking_id).first()
    if not bill:
        return redirect("confirmation", booking_id=booking_id)
    service_charge = bill.service_charge
    parts_charge = bill.parts_charge
   
    subtotal = service_charge + parts_charge
    platform_fee = 50
    tax = subtotal * 0.05
    total = subtotal + platform_fee + tax
    

    return render(request, "invoice.html", {
        "bill": bill,
        "booking": bill.booking,
        "worker": bill.worker,
        "subtotal": subtotal,
        "platform_fee": platform_fee,
        "tax": tax,
        "total": total
    })

def delete_job(request,id):
    job=get_object_or_404(Booking,id=id)
    job.delete()
    return redirect('work')