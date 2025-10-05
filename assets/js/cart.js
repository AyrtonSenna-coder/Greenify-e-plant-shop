// ===================== CART LOGIC =====================

// Cart state stored in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartLink = document.getElementById('cart-link');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// ===================== OPEN/CLOSE CART PANEL =====================
if (cartLink && cartPanel && cartOverlay) {
  cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
    renderCart();
  });

  closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });

  cartOverlay.addEventListener('click', () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  });
}

// ===================== ADD TO CART =====================
document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const image = btn.dataset.image || './assets/images/default-plant.jpg';

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  });
});

// ===================== UPDATE CART UI =====================
function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-text">Your cart is empty 🛍️</p>`;
    cartTotal.textContent = '0.00';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="decrease" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button class="increase" data-index="${index}">+</button>
        <button class="remove" data-index="${index}">✖</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  // Quantity controls
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      cart[idx].quantity++;
      saveAndRender();
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
      } else {
        cart.splice(idx, 1);
      }
      saveAndRender();
    });
  });

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      saveAndRender();
    });
  });
}

function saveAndRender() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ===================== UPDATE CART COUNT =====================
function updateCartCount() {
  if (!cartCount) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
}

// On page load
updateCartCount();
renderCart();

