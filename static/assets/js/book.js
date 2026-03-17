// Service data
// const services = {
//     electrician: {
//         title: 'Electrician Service',
//         description: 'Professional electrician services for all your electrical needs. Expert diagnosis and quick solutions for residential and commercial properties.',
//         price: '₹299',
//         image: '⚡'
//     },
//     plumber: {
//         title: 'Plumber Service',
//         description: 'Expert plumbing services for all water and drainage issues. Quick repairs and maintenance solutions from certified professionals.',
//         price: '₹249',
//         image: '🔧'
//     },
//     ac: {
//         title: 'AC Repair',
//         description: 'Professional AC repair and maintenance services. Expert technicians ensure your cooling system runs efficiently year-round.',
//         price: '₹499',
//         image: '❄️'
//     },
//     cleaning: {
//         title: 'Cleaning Service',
//         description: 'Professional cleaning services for homes and offices. Thorough cleaning with eco-friendly products and trained staff.',
//         price: '₹399',
//         image: '✨'
//     }
// };

// DOM Elements
const serviceDropdown = document.getElementById('serviceDropdown');
const serviceTitle = document.getElementById('serviceTitle');
const serviceDescription = document.getElementById('serviceDescription');
const servicePrice = document.getElementById('servicePrice');
const serviceImage = document.getElementById('serviceImage');
const serviceSelect = document.getElementById('serviceSelect');
const minimumCost = document.getElementById('minimumCost');
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const navbar = document.querySelector('.navbar');

// Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     // initializeServiceDropdown();
//     // initializeFormSync();
//     initializeScrollAnimations();
//     setupFormValidation();
//     // setupEventListeners();
// });

// Service Dropdown Handler
function initializeServiceDropdown() {
    // updateServiceDetails('electrician');
    
    serviceDropdown.addEventListener('change', (e) => {
        const selectedService = e.target.value;
        // updateServiceDetails(selectedService);
        serviceSelect.value = selectedService;
        // updateMinimumCost(selectedService);
    });
}

// Update service details in right panel
// function updateServiceDetails(serviceKey) {
//     const service = services[serviceKey];
//     serviceTitle.textContent = service.title;
//     serviceDescription.textContent = service.description;
//     servicePrice.textContent = service.price;
//     serviceImage.textContent = service.image;
// }

// Initialize form sync between dropdowns
function initializeFormSync() {
    serviceSelect.addEventListener('change', (e) => {
        const selectedService = e.target.value;
        serviceDropdown.value = selectedService;
        // updateServiceDetails(selectedService);
        // updateMinimumCost(selectedService);
    });

    // Set initial minimum cost
    // updateMinimumCost('electrician');
}

// Update minimum cost field
// function updateMinimumCost(serviceKey) {
//     const service = services[serviceKey];
//     minimumCost.value = service.price;
// }

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeIn 0.6s ease-out`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.form-group, .worker-card, .booking-title').forEach(el => {
        observer.observe(el);
    });
}

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form Validation
function setupFormValidation() {
    const fullName = document.getElementById('fullName');
    const mobileNumber = document.getElementById('mobileNumber');
    const address = document.getElementById('address');
    const problemDescription = document.getElementById('problemDescription');
    const preferredDate = document.getElementById('preferredDate');
    const preferredTime = document.getElementById('preferredTime');

    // Real-time validation
    fullName.addEventListener('blur', () => validateName(fullName));
    mobileNumber.addEventListener('blur', () => validatePhone(mobileNumber));
    address.addEventListener('blur', () => validateAddress(address));
    problemDescription.addEventListener('blur', () => validateDescription(problemDescription));
    preferredDate.addEventListener('blur', () => validateDate(preferredDate));
    preferredTime.addEventListener('blur', () => validateTime(preferredTime));

    // Clear error on focus
    [fullName, mobileNumber, address, problemDescription, preferredDate, preferredTime].forEach(field => {
        field.addEventListener('focus', () => {
            clearFieldError(field);
        });
    });
}

// Validation functions
function validateName(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById('fullNameError');
    
    if (!value) {
        showFieldError(field, errorEl, 'Full name is required');
        return false;
    }
    if (value.length < 2) {
        showFieldError(field, errorEl, 'Name must be at least 2 characters');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validatePhone(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById('mobileError');
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!value) {
        showFieldError(field, errorEl, 'Mobile number is required');
        return false;
    }
    if (!phoneRegex.test(value)) {
        showFieldError(field, errorEl, 'Mobile number must be 10 digits');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateAddress(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById('addressError');
    
    if (!value) {
        showFieldError(field, errorEl, 'Address is required');
        return false;
    }
    if (value.length < 5) {
        showFieldError(field, errorEl, 'Address must be at least 5 characters');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateDescription(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById('descriptionError');
    
    if (!value) {
        showFieldError(field, errorEl, 'Problem description is required');
        return false;
    }
    if (value.length < 10) {
        showFieldError(field, errorEl, 'Description must be at least 10 characters');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateDate(field) {
    const value = field.value;
    const errorEl = document.getElementById('dateError');
    
    if (!value) {
        showFieldError(field, errorEl, 'Date is required');
        return false;
    }
    
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showFieldError(field, errorEl, 'Date must be in the future');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateTime(field) {
    const value = field.value;
    const errorEl = document.getElementById('timeError');
    
    if (!value) {
        showFieldError(field, errorEl, 'Time is required');
        return false;
    }
    clearFieldError(field);
    return true;
}

function showFieldError(field, errorEl, message) {
    field.style.borderColor = '#d32f2f';
    field.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)';
    errorEl.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    const errorId = field.id + 'Error';
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Form submission
// function setupEventListeners() {
//     bookingForm.addEventListener('submit', (e) => {
//         e.preventDefault();
        
//         if (validateForm()) {
//             showSuccessModal();
//             bookingForm.reset();
//             updateMinimumCost('electrician');
//             serviceDropdown.value = 'electrician';
//             serviceSelect.value = 'electrician';
//         }
//     });

//     modalCloseBtn.addEventListener('click', closeModal);
    
//     // Close modal when clicking outside
//     successModal.addEventListener('click', (e) => {
//         if (e.target === successModal) {
//             closeModal();
//         }
//     });
// }

// // Validate entire form
function validateForm() {
    const fullName = document.getElementById('fullName');
    const mobileNumber = document.getElementById('mobileNumber');
    const address = document.getElementById('address');
    const problemDescription = document.getElementById('problemDescription');
    const preferredDate = document.getElementById('preferredDate');
    const preferredTime = document.getElementById('preferredTime');

    const isNameValid = validateName(fullName);
    const isPhoneValid = validatePhone(mobileNumber);
    const isAddressValid = validateAddress(address);
    const isDescriptionValid = validateDescription(problemDescription);
    const isDateValid = validateDate(preferredDate);
    const isTimeValid = validateTime(preferredTime);

    return isNameValid && isPhoneValid && isAddressValid && isDescriptionValid && isDateValid && isTimeValid;
}

// Modal functions
function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeModal();
    }, 5000);
}

function closeModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#' && href !== '#home') {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Set minimum date to today
// document.addEventListener('DOMContentLoaded', () => {
//     const dateInput = document.getElementById('preferredDate');
//     const today = new Date().toISOString().split('T')[0];
//     dateInput.min = today;
// });
