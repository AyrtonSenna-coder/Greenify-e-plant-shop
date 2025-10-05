const cartLink = document.getElementById('cart-link');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Open Cart
cartLink.addEventListener('click', (e) => {
  e.preventDefault();
  cartPanel.classList.add('active');
  cartOverlay.classList.add('active');
});

// Close Cart
closeCartBtn.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
});

// Add to Cart
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = {
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price)
    };
    cart.push(product);
    updateCartUI();
  });
});

function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-text" style="text-align:center; padding:20px;">Your cart is empty 🛍️</p>`;
    cartTotal.textContent = '0';
    cartCount.textContent = '0';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-btn" data-index="${index}">✖</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      updateCartUI();
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#cart') {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
