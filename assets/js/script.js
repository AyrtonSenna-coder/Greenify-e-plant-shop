document.addEventListener("DOMContentLoaded", () => {
  // ====== CART PANEL ELEMENTS ======
  const cartLink = document.querySelector('a[href="#cart"]');
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // ====== LOAD CART FROM LOCALSTORAGE ======
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartUI();
  // Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});
  document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Auto-open cart panel if cart has items
  if (cart.length > 0) {
    document.getElementById('cart-panel').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
  }
});

function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-text">Your cart is empty 🛍️</p>`;
    cartTotal.textContent = '0';
    cartCount.textContent = '0';
  } else {
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <button class="remove-btn" data-index="${index}">✖</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
  }

  // Save current state
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reattach remove button listeners
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      updateCartUI();
    });
  });
}


  // ====== OPEN CART PANEL ======
  if (cartLink) {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      cartPanel.classList.add('active');
      cartOverlay.classList.add('active');
    });
  }

  // ====== CLOSE CART PANEL ======
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function closeCart() {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  // ====== ADD TO CART ======
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveCart();
      updateCartUI();
    });
  });

  // ====== RENDER CART ======
  function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-text">Your cart is empty 🛍️</p>`;
      cartTotal.textContent = '0.00';
      cartCount.textContent = '0';
      return;
    }

    let total = 0;
    let totalCount = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalCount += item.quantity;

      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity}
        </div>
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalCount;

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.index;
        cart.splice(idx, 1);
        saveCart();
        updateCartUI();
      });
    });
  }

  // ====== SAVE CART TO LOCALSTORAGE ======
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});


