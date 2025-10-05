document.addEventListener("DOMContentLoaded", () => {
  // ====== CART PANEL ELEMENTS ======
  const cartLink = document.querySelector('a[href="#cart"]');
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  let cart = [];

  // ====== OPEN CART PANEL ======
  if (cartLink) {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      cartPanel.classList.add('active');
      cartOverlay.classList.add('active');
    });
  }

  // ====== CLOSE CART PANEL ======
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

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
        updateCartUI();
      });
    });
  }
});
