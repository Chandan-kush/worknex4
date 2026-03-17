// Cart Management - Minimal JS for UI interactions only

let cart = [];

// Open Cart Sidebar
function openCart(event) {
    if (event) {
        event.preventDefault();
    }
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

// Close Cart Sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// Add to Cart (UI only - prepare for Django backend)
function addToCart(productName, productPrice) {
    // Add item to cart array
    const cartItem = {
        name: productName,
        price: productPrice,
        id: Date.now() // Simple ID generation
    };

    cart.push(cartItem);

    // Update cart display
    updateCartDisplay();

    // Optional: Show a brief visual feedback
    console.log(`${productName} added to cart`);
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = '₹0';
        return;
    }

    // Build cart items HTML
    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #888; cursor: pointer; font-size: 1.2rem;">×</button>
            </div>
        `;
        total += item.price;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = '₹' + total;
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Clear Cart (for future use with checkout)
function clearCart() {
    cart = [];
    updateCartDisplay();
}

// Get Cart Data (for Django backend integration)
function getCartData() {
    return JSON.stringify(cart);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code can go here
    console.log('Worknex Parts Store loaded');
});
function increaseQty(btn){
    let input = btn.parentElement.querySelector("input");
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(btn){
    let input = btn.parentElement.querySelector("input");
    if(input.value > 1){
        input.value = parseInt(input.value) - 1;
    }
}