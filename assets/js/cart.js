// ========== CART SYSTEM ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartLink = document.querySelector('a[href="#cart"]');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// ========== CART PANEL ==========
cartLink.addEventListener('click', (e) => {
  e.preventDefault();
  cartPanel.classList.add('active');
  cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
});

// ========== ADD TO CART ==========
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const image = btn.dataset.image || '';

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  });
});

// ========== UPDATE CART UI ==========
function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  
    if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-text">Your cart is empty 🛍️</p>`;
    cartTotal.textContent = '0.00';
    cartCount.textContent = '0';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
      </div>
      <div class="cart-controls">
        <button class="decrease" data-index="${index}">−</button>
        <button class="increase" data-index="${index}">+</button>
        <button class="remove" data-index="${index}">✖</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quantity controls
  cartItemsContainer.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      cart[index].quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    });
  });

  cartItemsContainer.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    });
  });

  cartItemsContainer.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
    });
  });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#') {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Init
updateCartUI();
