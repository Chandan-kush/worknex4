
// WORKNEX Dashboard Navigation and Interactivity

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            
            // Handle logout
            if (sectionId === 'logout') {
                handleLogout();
                return;
            }

            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked nav item
            this.classList.add('active');

            // Show corresponding section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// ===== LOGOUT HANDLER =====
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Here you can add backend logout logic
          window.location.href = "/logout/";
        alert('Logged out successfully!');
        // window.location.href = '/logout'; // Uncomment for real logout
    }
}

