// Cart functionality
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');
  cartItems.innerHTML = '';
  let totalAmount = 0;

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <p>${item.name} - ₹${item.price}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(itemElement);
    totalAmount += item.price;
  });

  total.textContent = totalAmount;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Payment form submission
document.getElementById('payment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Payment Successful!');
  cart = [];
  updateCart();
  window.location.href = 'index.html';
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Message Sent!');
  document.getElementById('contact-form').reset();
});