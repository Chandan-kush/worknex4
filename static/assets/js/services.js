
// REVIEWS DATA
const reviews = [
    {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
        rating: '⭐⭐⭐⭐⭐',
        text: 'Amazing service! The electrician was professional and fixed my wiring issue quickly. Highly recommended!'
    },
    {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
        rating: '⭐⭐⭐⭐⭐',
        text: 'WORKNEX made booking a plumber so easy. The professional arrived on time and did excellent work.'
    },
    {
        name: 'Emily Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
        rating: '⭐⭐⭐⭐⭐',
        text: 'Best experience ever! The painting team was thorough and my house looks fantastic now.'
    }
];

let currentReviewIndex = 0;
let filteredServices = [...services];

// INITIALIZE PAGE
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderReviews();
    setupEventListeners();
});

// SETUP EVENT LISTENERS
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// RENDER SERVICES

// RENDER REVIEWS
function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card">
            <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
            <h4>${review.name}</h4>
            <div class="review-rating">${review.rating}</div>
            <p class="review-text">"${review.text}"</p>
        </div>
    `).join('');
}

// SEARCH/FILTER FUNCTIONALITY
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
    );
    
    renderServices();
}

// REVIEW SLIDER
function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    updateReviewSlider();
}

function previousReview() {
    currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
    updateReviewSlider();
}

function updateReviewSlider() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (reviewsContainer) {
        const offset = -currentReviewIndex * 100;
        reviewsContainer.style.transform = `translateX(${offset}%)`;
    }
}

// SMOOTH SCROLLING
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// BOOK SERVICE
function bookService(serviceName) {
    alert(`Booking "${serviceName}" service. This will redirect to the booking page in a real application.`);
}

// KEYBOARD NAVIGATION FOR REVIEWS
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') previousReview();
    if (event.key === 'ArrowRight') nextReview();
});
