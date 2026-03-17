// ========================================
// UTILITY FUNCTIONS
// ========================================

// Generate Random Booking ID
function generateBookingId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `BK-${year}-${randomNum}`;
}

// Format Currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// BOOKING ID INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const bookingIdElement = document.getElementById('bookingId');
    bookingIdElement.textContent = generateBookingId();
});

// ========================================
// PAYMENT MODAL FUNCTIONS
// ========================================

const payBtn = document.getElementById('payBtn');
const paymentModal = document.getElementById('paymentModal');
const selectedPaymentOption = document.querySelector('input[name="payment"]:checked');

payBtn.addEventListener('click', () => {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (selectedPayment.value === 'online') {
        // Show payment success popup
        openPaymentModal();
    } else {
        // For cash payment
        alert('Payment will be collected by the worker at the service location.');
    }
});

function openPaymentModal() {
    paymentModal.classList.add('active');
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
}

// Close modal when clicking outside
paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        closePaymentModal();
    }
});

// ========================================
// CANCEL BOOKING MODAL FUNCTIONS
// ========================================

const cancelBtn = document.getElementById('cancelBtn');
const cancelModal = document.getElementById('cancelModal');

cancelBtn.addEventListener('click', () => {
    openCancelModal();
});

function openCancelModal() {
    cancelModal.classList.add('active');
}

function closeCancelModal() {
    cancelModal.classList.remove('active');
}

function confirmCancel() {
    // Simulate cancellation
    closeCancelModal();
    alert('Your booking has been cancelled. We\'re sorry to see you go!');
    // In a real application, this would send a request to the backend
}

// Close modal when clicking outside
cancelModal.addEventListener('click', (e) => {
    if (e.target === cancelModal) {
        closeCancelModal();
    }
});

// ========================================
// TRACK WORKER MODAL FUNCTIONS
// ========================================

const trackBtn = document.querySelector('.btn-track');
const trackModal = document.getElementById('trackModal');
const callBtn = document.querySelector('.btn-call');

trackBtn.addEventListener('click', () => {
    openTrackModal();
});

callBtn.addEventListener('click', () => {
    // Simulate phone call
    alert('Calling John Davis...\n\n+91-98765-43210');
});

function openTrackModal() {
    trackModal.classList.add('active');
    // Simulate live tracking updates
    simulateLiveTracking();
}

function closeTrackModal() {
    trackModal.classList.remove('active');
}

// Close modal when clicking outside
trackModal.addEventListener('click', (e) => {
    if (e.target === trackModal) {
        closeTrackModal();
    }
});

function simulateLiveTracking() {
    // Simulate updating distance and time every 3 seconds
    let distance = 2.3;
    let minutes = 5;

    const trackingInterval = setInterval(() => {
        if (!trackModal.classList.contains('active')) {
            clearInterval(trackingInterval);
            return;
        }

        distance -= 0.1;
        minutes -= 0.1;

        if (distance <= 0) {
            distance = 0;
            minutes = 0;
        }

        const trackingStatus = trackModal.querySelector('.tracking-status');
        const etaInfo = trackModal.querySelector('.eta-info');

        if (distance <= 0) {
            trackingStatus.innerHTML = 'John Davis has <strong>arrived</strong>';
            etaInfo.innerHTML = '<p><strong>Status:</strong> Arrived at your location</p>';
            clearInterval(trackingInterval);
        } else {
            trackingStatus.innerHTML = `John Davis is <strong>${minutes.toFixed(1)} minutes away</strong>`;
            etaInfo.innerHTML = `
                <p><strong>Estimated Arrival:</strong> ${minutes.toFixed(1)} min from now</p>
                <p><strong>Current Location:</strong> ${distance.toFixed(1)} km away</p>
            `;
        }
    }, 3000);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('fade-in')) {
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCancelModal();
        closePaymentModal();
        closeTrackModal();
    }
});

// ========================================
// RESPONSIVE BUTTON SIZE ADJUSTMENT
// ========================================

function adjustButtonSizes() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.add('mobile');
        });
    } else {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.remove('mobile');
        });
    }
}

window.addEventListener('resize', adjustButtonSizes);
adjustButtonSizes();

// ========================================
// DEMO DATA UPDATE FUNCTION
// ========================================

function updateDemoData() {
    // This function can be used to update booking data dynamically
    const demoData = {
        bookingId: generateBookingId(),
        service: 'Home Maintenance',
        date: 'Feb 20, 2026',
        time: '2:00 PM',
        cost: '₹499',
        workerName: 'John Davis',
        workerPhone: '+91-98765-43210',
        rating: '4.5 ★'
    };

    return demoData;
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll event
const optimizedScroll = debounce(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ========================================
// INITIALIZATION
// ========================================

console.log('Booking Confirmation Page Initialized');
console.log('Demo Booking ID:', document.getElementById('bookingId').textContent);
