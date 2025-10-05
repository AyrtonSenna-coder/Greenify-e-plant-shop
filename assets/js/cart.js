document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.getElementById("cart-count");

  let cart = [];

  // Add item to cart
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCartDisplay();
    });
  });

  // Remove item from cart
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const name = e.target.getAttribute("data-name");
      cart = cart.filter(item => item.name !== name);
      updateCartDisplay();
    }
  });

  // Update Cart UI
  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-text">Your cart is empty 🛍️</p>`;
      cartTotalElement.textContent = "0.00";
      cartCountElement.textContent = "0";
      return;
    }

    let total = 0;
    let count = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      count += item.quantity;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="item-actions">
          <span class="item-qty">x${item.quantity}</span>
          <button class="remove-item" data-name="${item.name}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2);
    cartCountElement.textContent = count;
    bounceCartIcon();
  }

  // Add a lil bounce animation when adding items
  function bounceCartIcon() {
    cartCountElement.classList.add("bounce");
    setTimeout(() => {
      cartCountElement.classList.remove("bounce");
    }, 500);
  }
});
