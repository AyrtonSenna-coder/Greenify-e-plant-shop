  // ===== ENHANCED JAVASCRIPT FUNCTIONALITY =====

    // Product Data
    const products = [
      {
        id: 1,
        name: "Fiddle Leaf Fig",
        price: 1200,
        originalPrice: 1500,
        category: ["indoor", "air-purifying"],
        image: "assets/images/products/Fiddle leaf fig.jpg",
        description: "A stunning indoor tree with large, violin-shaped leaves. Perfect for adding a tropical touch to your Nairobi home.",
        careLevel: "moderate",
        size: "large",
        sunlight: "medium",
        petFriendly: false,
        airPurifying: true,
        inStock: true,
        deliveryTime: "2-4 hours",
        rating: 4.8,
        reviews: 24,
        features: ["Air purifying", "Low maintenance", "Fast growing"]
      },
      {
        id: 2,
        name: "Monstera Deliciosa",
        price: 1800,
        originalPrice: null,
        category: ["indoor", "air-purifying", "pet-friendly"],
        image: "assets/images/products/Monstera.jpg",
        description: "Known for its unique split leaves, this plant is a favorite for modern interior design.",
        careLevel: "easy",
        size: "medium",
        sunlight: "low",
        petFriendly: true,
        airPurifying: true,
        inStock: true,
        deliveryTime: "2-4 hours",
        rating: 4.5,
        reviews: 18,
        features: ["Pet friendly", "Air purifying", "Easy care"]
      },
      {
        id: 3,
        name: "Rose Plant",
        price: 850,
        originalPrice: null,
        category: ["outdoor", "flowering"],
        image: "assets/images/products/rose-plant.jpg",
        description: "Beautiful flowering plant that adds color and fragrance to your garden.",
        careLevel: "moderate",
        size: "medium",
        sunlight: "high",
        petFriendly: true,
        airPurifying: false,
        inStock: true,
        deliveryTime: "2-4 hours",
        rating: 4.7,
        reviews: 32,
        features: ["Colorful blooms", "Fragrant", "Garden favorite"]
      },
      {
        id: 4,
        name: "Snake Plant",
        price: 950,
        originalPrice: 1200,
        category: ["indoor", "low-maintenance", "air-purifying", "pet-friendly"],
        image: "assets/images/products/snake-plant.jpg",
        description: "Extremely hardy plant that thrives on neglect. Perfect for beginners.",
        careLevel: "easy",
        size: "small",
        sunlight: "low",
        petFriendly: true,
        airPurifying: true,
        inStock: true,
        deliveryTime: "2-4 hours",
        rating: 4.6,
        reviews: 27,
        features: ["Low maintenance", "Air purifying", "Pet safe"]
      }
    ];

    // Shopping Cart
    let cart = JSON.parse(localStorage.getItem('greenify_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('greenify_wishlist')) || [];

    // DOM Elements
    const elements = {
      // Cart Elements
      cartPanel: document.getElementById('cart-panel'),
      cartButton: document.getElementById('cart-button'),
      headerCartButton: document.querySelector('.cart-btn'),
      closeCart: document.getElementById('close-cart'),
      cartOverlay: document.getElementById('cart-overlay'),
      cartItems: document.getElementById('cart-items'),
      cartCountBadge: document.getElementById('cart-count-badge'),
      cartSubtotal: document.getElementById('cart-subtotal'),
      deliveryCost: document.getElementById('delivery-cost'),
      cartTotal: document.getElementById('cart-total'),
      freeShippingMessage: document.getElementById('free-shipping-message'),
      proceedCheckout: document.getElementById('proceed-checkout'),
      mpesaCheckout: document.getElementById('mpesa-checkout'),

      // Hero Slider Elements
      heroSlides: document.querySelectorAll('.hero-slide'),
      sliderDots: document.querySelectorAll('.slider-dots .dot'),
      sliderPrev: document.querySelector('.slider-prev'),
      sliderNext: document.querySelector('.slider-next'),

      // Filter Elements
      filterTabs: document.querySelectorAll('.filter-tab'),
      viewOptions: document.querySelectorAll('.view-option'),
      productsView: document.getElementById('products-view')
    };

    // Current State
    let currentSlide = 0;
    let slideInterval = null;

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', function() {
      initializeApp();
    });

    function initializeApp() {
      console.log('Initializing Greenify app...');
      updateCartCount();
      setupEventListeners();
      initializeCart();
      initializeHeroSlider();
      initializeProductFilters();
      console.log('App initialized successfully');
    }

    function initializeCart() {
      updateCartDisplay();
      setupCartEventListeners();
      setupCheckoutButtons();
      console.log('Cart initialized');
    }

    function setupEventListeners() {
      // Search functionality
      const searchBtn = document.querySelector('.search-btn');
      const searchInput = document.querySelector('.search-input');
      
      if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') handleSearch();
        });
      }

      // Mobile menu
 const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      }
      // Newsletter form
      const newsletterForm = document.querySelector('.subscription-form');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
      }

      // Mega menu hover
      initializeMegaMenu();
    }

    function setupCartEventListeners() {
      console.log('Setting up cart event listeners');
      
      // Floating cart button
      if (elements.cartButton) {
        elements.cartButton.addEventListener('click', toggleCart);
      }
      
      // Header cart button
      if (elements.headerCartButton) {
        elements.headerCartButton.addEventListener('click', toggleCart);
      }
      
      // Close cart button
      if (elements.closeCart) {
        elements.closeCart.addEventListener('click', toggleCart);
      }
      
      // Overlay click to close
      if (elements.cartOverlay) {
        elements.cartOverlay.addEventListener('click', toggleCart);
      }
      
      // Escape key to close cart
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.cartPanel.classList.contains('active')) {
          toggleCart();
        }
      });
    }

    function setupCheckoutButtons() {
      console.log('Setting up checkout buttons');
      
      if (elements.proceedCheckout) {
        elements.proceedCheckout.addEventListener('click', redirectToCheckout);
      }
      
      if (elements.mpesaCheckout) {
        elements.mpesaCheckout.addEventListener('click', redirectToCheckout);
      }
    }

    // ===== HERO SLIDER FUNCTIONALITY =====
    function initializeHeroSlider() {
      if (elements.heroSlides.length === 0) return;

      // Auto slide
      startAutoSlide();
      setInterval(nextSlide, 5000)

      // Dot click events
      elements.sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
        });
      });

      // Navigation buttons
      if (elements.sliderPrev) {
        elements.sliderPrev.addEventListener('click', () => {
          prevSlide();
        });
      }

      if (elements.sliderNext) {
        elements.sliderNext.addEventListener('click', () => {
          nextSlide();
        });
      }

      // Pause on hover
      const slider = document.querySelector('.hero-slider');
      if (slider) {
        slider.addEventListener('mouseenter', () => {
          stopAutoSlide();
        });

        slider.addEventListener('mouseleave', () => {
          startAutoSlide();
        });
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % elements.heroSlides.length;
      updateSlider();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + elements.heroSlides.length) % elements.heroSlides.length;
      updateSlider();
    }

    function updateSlider() {
      // Update slides
      elements.heroSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });

      // Update dots
      elements.sliderDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    // ===== MEGA MENU FUNCTIONALITY =====
    function initializeMegaMenu() {
      const megaDropdowns = document.querySelectorAll('.mega-dropdown');
      
      megaDropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
          showMegaMenu(dropdown);
        });

        dropdown.addEventListener('mouseleave', (e) => {
          if (!dropdown.contains(e.relatedTarget)) {
            hideMegaMenu(dropdown);
          }
        });
      });
    }

    function showMegaMenu(dropdown) {
      const menu = dropdown.querySelector('.mega-menu');
      if (menu) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
      }
    }

    function hideMegaMenu(dropdown) {
      const menu = dropdown.querySelector('.mega-menu');
      if (menu) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px)';
      }
    }

    // ===== PRODUCT FILTERING =====
    function initializeProductFilters() {
      if (!elements.filterTabs.length || !elements.productsView) return;

      // Filter tabs
      elements.filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;
          
          // Update active tab
          elements.filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          // Filter products
          filterProducts(filter);
        });
      });

      // View options
      elements.viewOptions.forEach(option => {
        option.addEventListener('click', () => {
          const view = option.dataset.view;
          
          // Update active view
          elements.viewOptions.forEach(o => o.classList.remove('active'));
          option.classList.add('active');

          // Change view layout
          changeViewLayout(view, elements.productsView);
        });
      });

      // Add to cart buttons
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          const productElement = this.closest('.business-product');
          const productId = parseInt(productElement.dataset.category?.includes('indoor') ? 
            (productElement.dataset.name.includes('Fiddle') ? 1 : 
             productElement.dataset.name.includes('Monstera') ? 2 : 
             productElement.dataset.name.includes('Snake') ? 4 : 1) : 3);
          
          addToCart(productId);
        });
      });
    }

    function filterProducts(filter) {
      console.log('Filtering products by:', filter);
      
      const productElements = document.querySelectorAll('.business-product');
      
      productElements.forEach(product => {
        const categories = product.dataset.category;
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        product.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
          product.classList.add('animate-in');
        }
      });
    }

    function changeViewLayout(view, container) {
      if (view === 'list') {
        container.classList.add('list-view');
        container.classList.remove('grid-view');
      } else {
        container.classList.add('grid-view');
        container.classList.remove('list-view');
      }
    }

    // ===== CART FUNCTIONALITY =====
    function toggleCart() {
      console.log('Toggle cart called');
      
      const isActive = elements.cartPanel.classList.contains('active');
      
      if (isActive) {
        // Close cart
        elements.cartPanel.classList.remove('active');
        if (elements.cartOverlay) {
          elements.cartOverlay.classList.remove('active');
        }
        document.body.classList.remove('cart-open');
        document.body.style.overflow = 'auto';
      } else {
        // Open cart
        elements.cartPanel.classList.add('active');
        if (elements.cartOverlay) {
          elements.cartOverlay.classList.add('active');
        }
        document.body.classList.add('cart-open');
        document.body.style.overflow = 'hidden';
        
        // Update cart display when opening
        updateCartDisplay();
      }
    }

    function updateCartDisplay() {
      console.log('Updating cart display, cart items:', cart.length);
      
      if (!elements.cartItems) {
        console.log('Cart items element not found');
        return;
      }

      if (cart.length === 0) {
        elements.cartItems.innerHTML = `
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <a href="#shop" class="btn btn-primary" onclick="toggleCart()">Start Shopping</a>
          </div>
        `;
      } else {
        elements.cartItems.innerHTML = cart.map(item => `
          <li class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder-plant.jpg'">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p class="cart-item-price">KSh ${item.price.toLocaleString()}</p>
              <div class="cart-item-controls">
                <button onclick="updateCartQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">✕</button>
          </li>
        `).join('');
      }

      updateCartTotals();
      updateCartCount();
    }

    function updateCartTotals() {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const delivery = subtotal >= 2000 ? 0 : 200;
      const total = subtotal + delivery;

      if (elements.cartSubtotal) {
        elements.cartSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
      }
      
      if (elements.deliveryCost) {
        elements.deliveryCost.textContent = delivery === 0 ? 'FREE' : `KSh ${delivery.toLocaleString()}`;
      }
      
      if (elements.cartTotal) {
        elements.cartTotal.textContent = `KSh ${total.toLocaleString()}`;
      }

      // Show/hide free shipping message
      if (elements.freeShippingMessage) {
        if (subtotal >= 2000) {
          elements.freeShippingMessage.style.display = 'block';
        } else {
          elements.freeShippingMessage.style.display = 'none';
        }
      }
    }

    function updateCartCount() {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update floating cart badge
      if (elements.cartCountBadge) {
        elements.cartCountBadge.textContent = totalItems;
        elements.cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
      }
      
      // Update header cart count
      const headerCartCount = document.querySelector('.cart-count');
      if (headerCartCount) {
        headerCartCount.textContent = totalItems;
      }
    }

    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      if (!product || !product.inStock) {
        showNotification('Sorry, this product is out of stock!', 'error');
        return;
      }

      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      updateCartCount();
      updateCartDisplay();
      saveCartToStorage();
      
      showNotification(`✅ ${product.name} added to cart!`);
      
      // Add animation to button
      const button = event.target;
      button.classList.add('adding-to-cart');
      setTimeout(() => {
        button.classList.remove('adding-to-cart');
      }, 600);
      
      // Auto-open cart on mobile or if it's the first item
      if (window.innerWidth < 768 || cart.length === 1) {
        if (!elements.cartPanel.classList.contains('active')) {
          setTimeout(() => {
            toggleCart();
          }, 500);
        }
      }
    }

    function removeFromCart(productId) {
      const product = products.find(p => p.id === productId);
      cart = cart.filter(item => item.id !== productId);
      
      updateCartCount();
      updateCartDisplay();
      saveCartToStorage();
      
      if (product) {
        showNotification(`${product.name} removed from cart`);
      }
    }

    function updateCartQuantity(productId, change) {
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
          removeFromCart(productId);
        } else {
          updateCartCount();
          updateCartDisplay();
          saveCartToStorage();
        }
      }
    }

    function saveCartToStorage() {
      localStorage.setItem('greenify_cart', JSON.stringify(cart));
    }

    // ===== CHECKOUT REDIRECTION =====
    function redirectToCheckout() {
      console.log('Redirect to checkout called');
      
      if (cart.length === 0) {
        showNotification('Your cart is empty! Add some plants first.', 'error');
        return;
      }

      // Close cart panel if open
      if (elements.cartPanel && elements.cartPanel.classList.contains('active')) {
        toggleCart();
      }

      // Save cart and redirect
      saveCartToStorage();
      
      console.log('Redirecting to checkout page...');
      window.location.href = 'checkout.html';
    }

    // ===== UTILITY FUNCTIONS =====
    function toggleMobileMenu() {
      const navMenu = document.querySelector('.nav-menu');
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      
      if (navMenu && mobileMenuBtn) {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      }
    }

    function handleSearch() {
      const searchInput = document.querySelector('.search-input');
      const query = searchInput.value.toLowerCase().trim();
      
      if (query) {
        showNotification(`Searching for: ${query}`);
        // In a real implementation, this would filter products
      }
    }

    function handleNewsletter(e) {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      const button = e.target.querySelector('button[type="submit"]');
      
      if (validateEmail(email)) {
        // Show loading state
        const originalText = button.textContent;
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          showNotification('Thank you for subscribing! Check your email for 10% off coupon.', 'success');
          e.target.reset();
          button.textContent = originalText;
          button.disabled = false;
        }, 1500);
      } else {
        showNotification('Please enter a valid email address.', 'error');
      }
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
      // Remove existing notification
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
      `;
      
      // Add styles if not already added
      if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
          .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #2e8b57;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
          }
          
          .notification.error {
            background: #dc3545;
          }
          
          .notification button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.1rem;
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(styles);
      }
      
      document.body.appendChild(notification);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    }

    // Make functions globally available for onclick attributes
    window.toggleCart = toggleCart;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartQuantity = updateCartQuantity;
    window.redirectToCheckout = redirectToCheckout;