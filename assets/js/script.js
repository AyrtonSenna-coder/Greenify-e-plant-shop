// Cart Functionality
const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

let cart = JSON.parse(localStorage.getItem('greenifyCart')) || [];

// Toggle Cart Panel
cartButton.addEventListener('click', () => cartPanel.classList.add('open'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));

// Add to Cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    const product = e.target.closest('.product');
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    const img = product.querySelector('img').src;

    cart.push({name, price, img});
    saveCart();
    updateCartUI();
    cartPanel.classList.add('open');
  });
});

// Remove Item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${item.img}" alt="${item.name}"><span>${item.name} - $${item.price}</span><button onclick="removeItem(${index})">Remove</button>`;
    li.style.opacity = '0';
    li.style.transform = 'translateX(30px)';
    setTimeout(() => {
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, 50*index);
    cartItems.appendChild(li);
    total += item.price;
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: $${total}`;
}

// Save Cart
function saveCart() {
  localStorage.setItem('greenifyCart', JSON.stringify(cart));
}

// Initialize Cart
updateCartUI();

// Scroll Animations
const animItems = document.querySelectorAll('.category-card, .product, .about-card');
function revealOnScroll() {
  const screenHeight = window.innerHeight;
  animItems.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if(top < screenHeight - 100){
      item.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Contact Form
const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formMsg.textContent = "Thank you! We'll get back to you soon.";
  contactForm.reset();
});
