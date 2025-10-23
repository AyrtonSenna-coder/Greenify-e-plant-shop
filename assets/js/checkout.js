// ===== CHECKOUT PAGE FUNCTIONALITY =====

// Checkout State
let checkoutState = {
    currentStep: 1,
    deliveryInfo: {},
    paymentMethod: 'mpesa',
    orderData: {}
};

// DOM Elements
const elements = {
    // Progress
    steps: document.querySelectorAll('.checkout-step'),
    progressSteps: document.querySelectorAll('.progress-steps .step'),
    
    // Navigation
    nextStepBtns: document.querySelectorAll('.next-step'),
    prevStepBtns: document.querySelectorAll('.prev-step'),
    placeOrderBtn: document.getElementById('place-order'),
    
    // Payment
    paymentOptions: document.querySelectorAll('.payment-option'),
    paymentDetails: document.querySelectorAll('.payment-details'),
    
    // Order Summary
    orderItemsPreview: document.getElementById('order-items-preview'),
    sidebarSubtotal: document.getElementById('sidebar-subtotal'),
    sidebarDelivery: document.getElementById('sidebar-delivery'),
    sidebarTotal: document.getElementById('sidebar-total'),
    freeShippingNotice: document.querySelector('.free-shipping-notice'),
    
    // Confirmation
    confirmDelivery: document.getElementById('confirm-delivery'),
    confirmPayment: document.getElementById('confirm-payment'),
    confirmItems: document.getElementById('confirm-items'),
    confirmSubtotal: document.getElementById('confirm-subtotal'),
    confirmDeliveryCost: document.getElementById('confirm-delivery-cost'),
    confirmTotal: document.getElementById('confirm-total'),
    
    // Success Modal
    orderSuccessModal: document.getElementById('order-success'),
    successOrderId: document.getElementById('success-order-id'),
    successDeliveryTime: document.getElementById('success-delivery-time'),
    successTotal: document.getElementById('success-total'),
    trackOrderBtn: document.getElementById('track-order')
};

// Cart data from localStorage
let cart = JSON.parse(localStorage.getItem('greenify_cart')) || [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    if (cart.length === 0) {
        // Redirect to home if cart is empty
        window.location.href = 'index.html';
        return;
    }
    
    updateCartCount();
    setupEventListeners();
    updateOrderSummary();
    setupDeliveryDate();
    updatePaymentAmounts();
}

function setupEventListeners() {
    // Step navigation
    elements.nextStepBtns.forEach(btn => {
        btn.addEventListener('click', goToNextStep);
    });

    elements.prevStepBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevStep);
    });

    // Payment method selection
    elements.paymentOptions.forEach(option => {
        option.addEventListener('click', handlePaymentSelection);
    });

    // Delivery options
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.addEventListener('click', handleDeliverySelection);
    });

    // Place order
    elements.placeOrderBtn.addEventListener('click', placeOrder);

    // Success modal actions
    elements.trackOrderBtn.addEventListener('click', trackOrder);

    // Form validation
    document.getElementById('delivery-form').addEventListener('input', validateDeliveryForm);
}

function setupDeliveryDate() {
    const deliveryDate = document.getElementById('delivery-date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set min date to tomorrow
    deliveryDate.min = tomorrow.toISOString().split('T')[0];
    
    // Set default date to tomorrow
    deliveryDate.value = tomorrow.toISOString().split('T')[0];
}

// ===== STEP MANAGEMENT =====
function goToNextStep(e) {
    const nextStep = parseInt(e.target.dataset.next);
    
    if (!validateCurrentStep()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }

    if (nextStep === 3) {
        updateOrderConfirmation();
    }

    checkoutState.currentStep = nextStep;
    updateCheckoutSteps();
    scrollToTop();
}

function goToPrevStep(e) {
    const prevStep = parseInt(e.target.dataset.prev);
    checkoutState.currentStep = prevStep;
    updateCheckoutSteps();
    scrollToTop();
}

function updateCheckoutSteps() {
    // Update step content
    elements.steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active');
        
        if (stepNumber === checkoutState.currentStep) {
            step.classList.add('active');
        }
    });

    // Update progress indicators
    elements.progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === checkoutState.currentStep) {
            step.classList.add('active');
        } else if (stepNumber < checkoutState.currentStep) {
            step.classList.add('completed');
        }
    });
}

function validateCurrentStep() {
    switch (checkoutState.currentStep) {
        case 1:
            return validateDeliveryInfo();
        case 2:
            return validatePaymentInfo();
        case 3:
            return document.getElementById('terms').checked;
        default:
            return true;
    }
}

function validateDeliveryInfo() {
    const requiredFields = ['fullName', 'phone', 'email', 'address'];
    let isValid = true;

    requiredFields.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '';
        }
    });

    // Validate email format
    const email = document.querySelector('[name="email"]');
    if (email.value && !validateEmail(email.value)) {
        isValid = false;
        email.style.borderColor = '#dc3545';
    }

    return isValid;
}

function validatePaymentInfo() {
    const paymentMethod = checkoutState.paymentMethod;
    
    if (paymentMethod === 'mpesa') {
        const mpesaCode = document.querySelector('[name="mpesaCode"]');
        if (!mpesaCode.value.trim()) {
            mpesaCode.style.borderColor = '#dc3545';
            return false;
        }
        mpesaCode.style.borderColor = '';
    }
    
    return true;
}

function validateDeliveryForm() {
    const form = document.getElementById('delivery-form');
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allValid = false;
        }
    });

    // Enable/disable next button based on validation
    const nextButton = form.querySelector('.next-step');
    if (nextButton) {
        nextButton.disabled = !allValid;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== PAYMENT HANDLING =====
function handlePaymentSelection(e) {
    const option = e.currentTarget;
    const paymentMethod = option.querySelector('input').id;
    
    // Update active state
    elements.paymentOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    
    // Update payment details
    elements.paymentDetails.forEach(detail => detail.classList.remove('active'));
    document.getElementById(`${paymentMethod}-details`).classList.add('active');
    
    checkoutState.paymentMethod = paymentMethod;
}

function handleDeliverySelection(e) {
    const option = e.currentTarget;
    
    // Update active state
    document.querySelectorAll('.delivery-option').forEach(opt => {
        opt.classList.remove('active');
    });
    option.classList.add('active');
    
    updatePaymentAmounts();
    updateOrderSummary();
}

function updatePaymentAmounts() {
    const subtotal = calculateSubtotal();
    const delivery = calculateDelivery();
    const total = subtotal + delivery;

    // Update M-Pesa amount
    const mpesaAmount = document.getElementById('mpesa-amount');
    if (mpesaAmount) {
        mpesaAmount.textContent = `KSh ${total.toLocaleString()}`;
    }
    
    // Update cash amount
    const cashAmount = document.getElementById('cash-amount');
    if (cashAmount) {
        cashAmount.textContent = `KSh ${total.toLocaleString()}`;
    }
}

// ===== ORDER SUMMARY =====
function updateOrderSummary() {
    updateOrderItemsPreview();
    updateOrderTotals();
}

function updateOrderItemsPreview() {
    if (!elements.orderItemsPreview) return;

    elements.orderItemsPreview.innerHTML = cart.map(item => `
        <div class="order-item-preview">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder-plant.jpg'">
            <div class="order-item-preview-details">
                <h4>${item.name}</h4>
                <p>KSh ${item.price.toLocaleString()} each</p>
            </div>
            <div class="order-item-quantity">×${item.quantity}</div>
        </div>
    `).join('');
}

function updateOrderTotals() {
    const subtotal = calculateSubtotal();
    const delivery = calculateDelivery();
    const total = subtotal + delivery;

    // Update sidebar
    if (elements.sidebarSubtotal) {
        elements.sidebarSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
    }
    if (elements.sidebarDelivery) {
        elements.sidebarDelivery.textContent = delivery === 0 ? 'FREE' : `KSh ${delivery.toLocaleString()}`;
    }
    if (elements.sidebarTotal) {
        elements.sidebarTotal.textContent = `KSh ${total.toLocaleString()}`;
    }

    // Update free shipping notice
    if (elements.freeShippingNotice) {
        if (subtotal >= 2000) {
            elements.freeShippingNotice.classList.add('visible');
        } else {
            elements.freeShippingNotice.classList.remove('visible');
        }
    }
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateDelivery() {
    const subtotal = calculateSubtotal();
    const deliveryOption = document.querySelector('.delivery-option.active input').id;
    
    if (deliveryOption === 'pickup') {
        return 0;
    }
    
    return subtotal >= 2000 ? 0 : 200;
}

// ===== ORDER CONFIRMATION =====
function updateOrderConfirmation() {
    const subtotal = calculateSubtotal();
    const delivery = calculateDelivery();
    const total = subtotal + delivery;

    // Update delivery information
    const deliveryInfo = getDeliveryInfo();
    elements.confirmDelivery.innerHTML = `
        <p><strong>${deliveryInfo.fullName}</strong></p>
        <p>📞 ${deliveryInfo.phone}</p>
        <p>✉️ ${deliveryInfo.email}</p>
        <p>📍 ${deliveryInfo.address}</p>
        ${deliveryInfo.instructions ? `<p><em>📝 Instructions: ${deliveryInfo.instructions}</em></p>` : ''}
        ${deliveryInfo.deliveryDate ? `<p>📅 Delivery: ${formatDeliveryDate(deliveryInfo.deliveryDate)} at ${deliveryInfo.deliveryTime}</p>` : ''}
    `;

    // Update payment method
    const paymentText = {
        'mpesa': '📱 M-Pesa Mobile Payment',
        'cash': '💵 Cash on Delivery',
        'card': '💳 Credit/Debit Card'
    };
    elements.confirmPayment.innerHTML = `<p><strong>${paymentText[checkoutState.paymentMethod]}</strong></p>`;

    // Update order items
    elements.confirmItems.innerHTML = cart.map(item => `
        <div class="order-item-detailed">
            <div class="order-item-detailed-info">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder-plant.jpg'">
                <div class="order-item-detailed-details">
                    <h5>${item.name}</h5>
                    <span>Qty: ${item.quantity} × KSh ${item.price.toLocaleString()}</span>
                </div>
            </div>
            <div class="order-item-detailed-price">KSh ${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');

    // Update totals
    elements.confirmSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
    elements.confirmDeliveryCost.textContent = delivery === 0 ? 'FREE' : `KSh ${delivery.toLocaleString()}`;
    elements.confirmTotal.textContent = `KSh ${total.toLocaleString()}`;
}

function getDeliveryInfo() {
    return {
        fullName: document.querySelector('[name="fullName"]').value,
        phone: document.querySelector('[name="phone"]').value,
        email: document.querySelector('[name="email"]').value,
        address: document.querySelector('[name="address"]').value,
        instructions: document.querySelector('[name="instructions"]').value,
        deliveryDate: document.querySelector('[name="deliveryDate"]').value,
        deliveryTime: document.querySelector('[name="deliveryTime"]').value
    };
}

function formatDeliveryDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
}

// ===== ORDER PLACEMENT =====
function placeOrder() {
    if (!document.getElementById('terms').checked) {
        showNotification('Please agree to the terms and conditions.', 'error');
        return;
    }

    // Show loading state
    elements.placeOrderBtn.innerHTML = '<span class="loading-spinner"></span> Placing Order...';
    elements.placeOrderBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        processOrderPayment();
    }, 2000);
}

function processOrderPayment() {
    const paymentMethod = checkoutState.paymentMethod;
    
    if (paymentMethod === 'mpesa') {
        processMpesaPayment();
    } else if (paymentMethod === 'cash') {
        processCashPayment();
    } else {
        processCardPayment();
    }
}

function processMpesaPayment() {
    showNotification('Processing M-Pesa payment...');
    
    setTimeout(() => {
        completeOrder();
    }, 3000);
}

function processCashPayment() {
    completeOrder();
}

function processCardPayment() {
    showNotification('Processing card payment...');
    
    setTimeout(() => {
        completeOrder();
    }, 3000);
}

function completeOrder() {
    // Generate order details
    const orderId = 'GFY-' + Date.now().toString().slice(-6);
    const subtotal = calculateSubtotal();
    const delivery = calculateDelivery();
    const total = subtotal + delivery;
    
    // Save order to localStorage (in a real app, this would go to a backend)
    const order = {
        id: orderId,
        items: cart,
        deliveryInfo: getDeliveryInfo(),
        paymentMethod: checkoutState.paymentMethod,
        subtotal: subtotal,
        delivery: delivery,
        total: total,
        status: 'confirmed',
        date: new Date().toISOString()
    };
    
    saveOrder(order);
    
    // Update success modal
    elements.successOrderId.textContent = orderId;
    elements.successDeliveryTime.textContent = 'Today, 2-4 hours';
    elements.successTotal.textContent = `KSh ${total.toLocaleString()}`;
    
    // Show success modal
    elements.orderSuccessModal.classList.add('active');
    
    // Clear cart
    clearCart();
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('greenify_orders')) || [];
    orders.push(order);
    localStorage.setItem('greenify_orders', JSON.stringify(orders));
}

function clearCart() {
    localStorage.removeItem('greenify_cart');
    cart = [];
    updateCartCount();
}

function trackOrder() {
    showNotification('Order tracking will be available in your account dashboard!');
    elements.orderSuccessModal.classList.remove('active');
    window.location.href = 'index.html';
}

// ===== UTILITY FUNCTIONS =====
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add loading spinner styles
const spinnerStyles = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = spinnerStyles;
document.head.appendChild(styleSheet);