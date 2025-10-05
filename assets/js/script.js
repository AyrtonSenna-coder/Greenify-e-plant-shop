// ================== CART PANEL TOGGLE ==================

// Grab elements
const cartLink = document.querySelector('a[href="#cart"]');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');

// Open Cart Panel
if (cartLink) {
  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
  });
}

// Close Cart Panel
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });
}

if (cartOverlay) {
  cartOverlay.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });
}
