from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('book/', views.book_service, name='book'),
    path('book/<int:service_id>/', views.book_service, name='book_with_id'),
    path('confirmation/<int:booking_id>/', views.confirmation_view, name='confirmation'),
    path('work/', views.worker_dashboard, name='work'),
    path('accept/<int:booking_id>/', views.accept_booking, name='accept_booking'),
    path('reject/<int:booking_id>/', views.reject_booking, name='reject_booking'),
    path('generate-bill/<int:booking_id>/', views.generate_bill_pdf, name='generate_bill_pdf'),
    path('cancel/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
    path('part/', views.part_view, name='part'),
    path('add-to-cart/<int:part_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:part_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path("profile/", views.user_profile, name="user_profile"),
    path("logout/", views.logout_view, name="logout"),
    path("services/", views.services_page, name="services"),
    # path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path("chat/<int:booking_id>/", views.chat_view, name="chat"),
    path("my-bookings/", views.my_bookings, name="my_bookings"),
    path("invoice/<int:booking_id>/", views.invoice_view, name="invoice"),
    path('delete-job/<int:id>/', views.delete_job, name='delete_job'),
]
