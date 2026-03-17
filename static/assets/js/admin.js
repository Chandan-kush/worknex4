// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section');
const sectionTitle = document.getElementById('sectionTitle');
const searchBox = document.getElementById('searchBox');
const verifyModal = document.getElementById('verifyModal');
const blockModal = document.getElementById('blockModal');
const assignModal = document.getElementById('assignModal');

// Section title mapping
const sectionTitles = {
    dashboard: 'Dashboard Overview',
    users: 'Users Management',
    workers: 'Workers Management',
    bookings: 'Booking Monitor',
    payments: 'Payments Section',
    parts: 'Service Parts Store',
    emergency: 'Emergency Requests',
    analytics: 'AI Analytics',
    reports: 'Reports'
};

// Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Menu Item Click
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Logout button behavior
        if (item.classList.contains('logout')) {
            handleLogout();
            return;
        }

        e.preventDefault();
        
        // Remove active class from all items
        menuItems.forEach(m => m.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');

        // Get section ID
        const sectionId = item.getAttribute('data-section');
        
        // Update title
        sectionTitle.textContent = sectionTitles[sectionId] || 'Dashboard';
        
        // Hide all sections
        sections.forEach(s => s.classList.remove('active'));
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Search Functionality
searchBox.addEventListener('keyup', () => {
    const searchTerm = searchBox.value.toLowerCase();
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
});

// Verify Worker Modal
const verifyBtns = document.querySelectorAll('.verify-btn');
verifyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showModal(verifyModal);
        const confirmBtn = verifyModal.querySelector('.modal-confirm');
        confirmBtn.onclick = () => {
            alert('Worker verified successfully!');
            btn.textContent = 'Verified';
            btn.disabled = true;
            closeModal(verifyModal);
        };
    });
});

// Block Worker Modal
const blockBtns = document.querySelectorAll('.block-btn');
blockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showModal(blockModal);
        const confirmBtn = blockModal.querySelector('.modal-confirm');
        confirmBtn.onclick = () => {
            alert('Worker blocked successfully!');
            btn.textContent = 'Blocked';
            btn.disabled = true;
            closeModal(blockModal);
        };
    });
});

// Assign Worker Modal
const assignBtns = document.querySelectorAll('.assign-btn');
assignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showModal(assignModal);
        const confirmBtn = assignModal.querySelector('.modal-confirm');
        confirmBtn.onclick = () => {
            const workerSelect = document.getElementById('workerSelect');
            const selectedWorker = workerSelect.value;
            
            if (selectedWorker) {
                alert(`Worker assigned successfully!`);
                btn.textContent = 'Assigned';
                btn.disabled = true;
                closeModal(assignModal);
            } else {
                alert('Please select a worker');
            }
        };
    });
});

// Modal Control Functions
function showModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Cancel buttons
const cancelBtns = document.querySelectorAll('.modal-cancel');
cancelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('active');
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Logout Function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
        // Redirect to login page (in real application)
        // window.location.href = '/login';
    }
}

// Hover effects for buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Smooth scroll for tables
const dataTables = document.querySelectorAll('.data-table');
dataTables.forEach(table => {
    table.addEventListener('scroll', function() {
        const isScrolled = this.scrollLeft > 0;
        this.style.boxShadow = isScrolled ? 'inset 10px 0 10px -10px rgba(0,0,0,0.1)' : 'none';
    });
});

// Add click effects to table rows
const tableRows = document.querySelectorAll('.data-table tbody tr');
tableRows.forEach(row => {
    row.addEventListener('click', function() {
        this.style.backgroundColor = '#f0f0f0';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 300);
    });
});

// Dynamic data updates (simulation)
function updateDashboardData() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        // Update stats with random numbers (for demo purposes)
        stats[0].textContent = (Math.random() * 15000 | 0).toLocaleString();
        stats[1].textContent = (Math.random() * 2000 | 0).toLocaleString();
        stats[2].textContent = (Math.random() * 1000 | 0).toLocaleString();
        stats[3].textContent = '$' + (Math.random() * 500000 | 0).toLocaleString();
    }
}

// Refresh data on interval
setInterval(updateDashboardData, 30000); // Update every 30 seconds

// Mobile responsive adjustments
function handleResponsive() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Mobile view
        menuItems.forEach(item => {
            if (item.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
}

window.addEventListener('resize', handleResponsive);

// Filter functionality for status badges
function filterByStatus(status) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        if (status === '' || row.textContent.includes(status)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter select change event
const filterSelect = document.querySelector('.filter-select');
if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
        filterByStatus(e.target.value);
    });
}

// Add loading animation on button click
buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.classList.contains('modal-cancel') && !this.classList.contains('logout')) {
            const originalText = this.textContent;
            this.textContent = '...';
            setTimeout(() => {
                this.textContent = originalText;
            }, 500);
        }
    });
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Set first menu item as active
    menuItems[0].click();
    
    // Add transition classes
    sections.forEach(section => {
        section.style.transition = 'opacity 0.3s ease';
    });
    
    console.log('Dashboard initialized successfully');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + D for Dashboard
    if (e.altKey && e.key === 'd') {
        document.querySelector('[data-section="dashboard"]').click();
    }
    // Alt + U for Users
    if (e.altKey && e.key === 'u') {
        document.querySelector('[data-section="users"]').click();
    }
    // Alt + W for Workers
    if (e.altKey && e.key === 'w') {
        document.querySelector('[data-section="workers"]').click();
    }
    // Escape to close modal
    if (e.key === 'Escape') {
        [verifyModal, blockModal, assignModal].forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Add active state to current menu item on page load
window.addEventListener('load', () => {
    const activeMenuItem = document.querySelector('.menu-item.active');
    if (activeMenuItem) {
        const sectionId = activeMenuItem.getAttribute('data-section');
        sectionTitle.textContent = sectionTitles[sectionId] || 'Dashboard';
    }
});

// Performance optimization - Lazy load images if needed
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.getAttribute('data-src');
            entry.target.removeAttribute('data-src');
            observer.unobserve(entry.target);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Prevent sidebar close on outside click for desktop
document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            // Desktop - keep sidebar open
            return;
        }
    }
});

// Add data attribute to theme toggle (future enhancement)
function toggleTheme() {
    document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
}

// Export table data functionality
function exportTableData(tableSelector, filename) {
    const table = document.querySelector(tableSelector);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        let csvRow = [];
        cols.forEach(col => {
            csvRow.push('"' + col.textContent + '"');
        });
        csv.push(csvRow.join(','));
    });
    
    // Create download link
    const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename);
    link.click();
}

// Add export functionality to export buttons
const exportBtns = document.querySelectorAll('[class*="export"]');
exportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        exportTableData('.data-table', 'export.csv');
        alert('Data exported successfully!');
    });
});

// Session management
let sessionTimer = null;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        alert('Session expired. Please login again.');
        handleLogout();
    }, SESSION_TIMEOUT);
}

document.addEventListener('mousemove', resetSessionTimer);
document.addEventListener('keypress', resetSessionTimer);

// Initialize session timer
resetSessionTimer();

// Add animations to page load
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
    });
});
